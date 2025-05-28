import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertPostSchema, insertEventSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store active connections
  const connections = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    connections.add(ws);
    
    ws.on('close', () => {
      connections.delete(ws);
    });

    // Send initial connection confirmation
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket connected' }));
    }
  });

  // Broadcast function for real-time updates
  function broadcast(data: any) {
    const message = JSON.stringify(data);
    connections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  // API Routes

  // Get current user (mock for now - in real app would check JWT)
  app.get("/api/auth/me", async (req, res) => {
    try {
      // For demo purposes, return the first user
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get community by slug
  app.get("/api/communities/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const community = await storage.getCommunityBySlug(slug);
      
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

      res.json(community);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get community spaces
  app.get("/api/communities/:id/spaces", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      const spaces = await storage.getCommunitySpaces(communityId);
      res.json(spaces);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get community stats
  app.get("/api/communities/:id/stats", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      const stats = await storage.getCommunityStats(communityId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get recent posts
  app.get("/api/communities/:id/posts", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 10;
      const posts = await storage.getRecentPosts(communityId, limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create post
  app.post("/api/posts", async (req, res) => {
    try {
      const validation = insertPostSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid post data", errors: validation.error.errors });
      }

      const post = await storage.createPost(validation.data);
      
      // Broadcast new post to all connected clients
      broadcast({
        type: 'new_post',
        data: {
          ...post,
          author: await storage.getUser(post.authorId)
        }
      });

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get upcoming events
  app.get("/api/communities/:id/events", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 5;
      const events = await storage.getUpcomingEvents(communityId, limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create event
  app.post("/api/events", async (req, res) => {
    try {
      const validation = insertEventSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid event data", errors: validation.error.errors });
      }

      const event = await storage.createEvent(validation.data);
      
      // Broadcast new event to all connected clients
      broadcast({
        type: 'new_event',
        data: event
      });

      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get top members
  app.get("/api/communities/:id/members/top", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 5;
      const topMembers = await storage.getTopMembers(communityId, limit);
      res.json(topMembers);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update member points
  app.put("/api/members/:userId/points", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { communityId, points } = req.body;

      if (!communityId || typeof points !== 'number') {
        return res.status(400).json({ message: "Community ID and points are required" });
      }

      const memberPoints = await storage.updateMemberPoints(userId, communityId, points);
      
      // Broadcast points update
      broadcast({
        type: 'points_updated',
        data: {
          userId,
          communityId,
          points: memberPoints.points,
          level: memberPoints.level
        }
      });

      res.json(memberPoints);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
