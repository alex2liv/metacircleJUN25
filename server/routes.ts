import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { generateChatResponse, testOpenAIConnection } from "./openai-service";
import { insertPostSchema, insertEventSchema } from "@shared/schema";
import { whatsAppService } from "./whatsapp-service";
import { whatsAppProfessionalService } from "./whatsapp-professional";
import nodemailer from "nodemailer";

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

  // User authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Email e senha são obrigatórios" 
        });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "Usuário não encontrado" 
        });
      }

      // Verify password (simple comparison for demo)
      if (user.password !== password) {
        return res.status(401).json({ 
          success: false, 
          message: "Senha incorreta" 
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ 
          success: false, 
          message: "Usuário inativo" 
        });
      }

      res.json({ 
        success: true, 
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  // Force admin access for development
  app.post("/api/auth/force-admin", async (req, res) => {
    try {
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user role to admin in memory
      const updatedUser = { ...user, role: "admin" as const };
      (storage as any).users.set(user.id, updatedUser);
      
      res.json({ message: "Admin access granted", user: updatedUser });
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

  // Like/Unlike post
  app.post("/api/posts/:id/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Increment like count
      const updatedPost = await storage.likePost(postId);
      
      // Broadcast like update
      broadcast({
        type: 'post_liked',
        data: updatedPost
      });

      res.json(updatedPost);
    } catch (error) {
      console.error('Error liking post:', error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  // Join Event
  app.post("/api/events/:id/join", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = req.user?.id || 1; // Default to user 1 for demo

      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if event is full
      if (event.maxAttendees && event.attendeesCount >= event.maxAttendees) {
        return res.status(400).json({ message: "Event is full" });
      }

      // Update attendees count
      const updatedEvent = await storage.joinEvent(eventId, userId);

      // Send WhatsApp notification
      const user = await storage.getUser(userId);
      if (user) {
        const eventDate = new Date(event.startDate).toLocaleDateString('pt-BR');
        const eventTime = new Date(event.startDate).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        const message = `🎉 Confirmado! Você se inscreveu no evento "${event.title}"\n\n📅 Data: ${eventDate}\n⏰ Horário: ${eventTime}\n📍 Local: ${event.location || 'Online'}\n\nVocê receberá um lembrete 1 hora antes do evento!`;
        
        console.log(`📱 WhatsApp notification would be sent to ${user.firstName}: ${message}`);
      }

      // Broadcast event update
      broadcast({
        type: 'event_joined',
        data: updatedEvent
      });

      res.json({ 
        success: true, 
        message: "Successfully joined event",
        event: updatedEvent
      });
    } catch (error) {
      console.error('Error joining event:', error);
      res.status(500).json({ message: "Failed to join event" });
    }
  });

  // Leave Event
  app.post("/api/events/:id/leave", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = req.user?.id || 1; // Default to user 1 for demo

      const updatedEvent = await storage.leaveEvent(eventId, userId);

      // Broadcast event update
      broadcast({
        type: 'event_left',
        data: updatedEvent
      });

      res.json({ 
        success: true, 
        message: "Successfully left event",
        event: updatedEvent
      });
    } catch (error) {
      console.error('Error leaving event:', error);
      res.status(500).json({ message: "Failed to leave event" });
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

  // AI Assistant Chat Endpoint
  app.post("/api/assistant/chat", async (req, res) => {
    try {
      const { message, communityId } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Get community context if provided
      let communityContext = '';
      if (communityId) {
        const community = await storage.getCommunity(communityId);
        if (community) {
          communityContext = `Comunidade: ${community.name} - ${community.description}`;
        }
      }

      const response = await generateChatResponse(message, communityContext);
      res.json(response);
    } catch (error) {
      console.error('Assistant chat error:', error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // Test OpenAI Connection
  app.get("/api/assistant/test", async (req, res) => {
    try {
      const isConnected = await testOpenAIConnection();
      res.json({ 
        connected: isConnected,
        hasApiKey: !!process.env.OPENAI_API_KEY 
      });
    } catch (error) {
      res.json({ 
        connected: false, 
        hasApiKey: !!process.env.OPENAI_API_KEY,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Admin routes for company management
  app.post("/api/admin/companies", async (req, res) => {
    try {
      const { name, slug, planType, databaseType, supabaseUrl, supabaseAnonKey, supabaseServiceKey } = req.body;
      
      // Create company data
      const companyData = {
        name,
        slug,
        planType: planType || "basic",
        databaseType: databaseType || "postgresql",
        supabaseUrl: databaseType === "supabase" ? supabaseUrl : null,
        supabaseAnonKey: databaseType === "supabase" ? supabaseAnonKey : null,
        supabaseServiceKey: databaseType === "supabase" ? supabaseServiceKey : null,
        isActive: true,
        hasWhiteLabel: false,
        maxUsers: planType === "enterprise" ? 1000 : planType === "premium" ? 100 : 50,
        maxSpecialists: planType === "enterprise" ? 20 : planType === "premium" ? 10 : 5,
        connectionStatus: 'unknown'
      };

      // For now, just return success since we don't have company storage implemented
      const company = {
        id: Date.now(), // temporary ID
        ...companyData,
        createdAt: new Date().toISOString()
      };

      res.json(company);
    } catch (error) {
      console.error('Error creating company:', error);
      res.status(500).json({ message: "Erro ao criar empresa cliente" });
    }
  });

  // Get all companies
  app.get("/api/admin/companies", async (req, res) => {
    try {
      // For demo, return empty array - in real app would fetch from database
      res.json([]);
    } catch (error) {
      console.error('Error fetching companies:', error);
      res.status(500).json({ message: "Erro ao buscar empresas" });
    }
  });

  // Update company credentials
  app.put("/api/admin/companies/:id", async (req, res) => {
    try {
      const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = req.body;
      const companyId = parseInt(req.params.id);
      
      // For now, just return the updated data
      const updatedCompany = {
        supabaseUrl,
        supabaseAnonKey,
        supabaseServiceKey,
        connectionStatus: 'unknown'
      };

      res.json(updatedCompany);
    } catch (error) {
      console.error('Error updating company:', error);
      res.status(500).json({ message: "Erro ao atualizar empresa" });
    }
  });

  // Test Supabase connection
  app.post("/api/admin/companies/test-supabase", async (req, res) => {
    try {
      const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = req.body;
      
      if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
        return res.status(400).json({ 
          success: false, 
          error: "Todas as credenciais são obrigatórias" 
        });
      }

      // Basic URL validation
      if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
        return res.status(400).json({ 
          success: false, 
          error: "URL do Supabase inválida. Deve ser no formato https://xxxxx.supabase.co" 
        });
      }

      // Simulate connection test - in real app would actually test the connection
      const isValidFormat = supabaseAnonKey.startsWith('eyJ') && supabaseServiceKey.startsWith('eyJ');
      
      if (!isValidFormat) {
        return res.status(400).json({ 
          success: false, 
          error: "Formato das chaves inválido. Verifique se as chaves estão corretas." 
        });
      }

      // For demo purposes, assume connection is successful
      res.json({ 
        success: true, 
        message: "Conexão com Supabase bem-sucedida" 
      });
    } catch (error) {
      console.error('Error testing Supabase connection:', error);
      res.status(500).json({ 
        success: false, 
        error: "Erro interno ao testar conexão" 
      });
    }
  });

  // Company routes - Get company by slug
  app.get("/api/company/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      // For demo, return a sample company based on slug
      const company = {
        id: 1,
        name: slug === "clarissa-vargas" ? "Clarissa Vargas" : "Empresa Demo",
        slug: slug,
        planType: "premium",
        databaseType: "supabase",
        isActive: true,
        hasWhiteLabel: false
      };
      
      res.json(company);
    } catch (error) {
      console.error('Error fetching company:', error);
      res.status(500).json({ message: "Erro ao buscar empresa" });
    }
  });

  // Company authentication - Login
  app.post("/api/company/:slug/auth/login", async (req, res) => {
    try {
      const { slug } = req.params;
      const { email, password } = req.body;
      
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Email e senha são obrigatórios" 
        });
      }

      // For demo purposes, simulate authentication for company admin
      // In real app, would authenticate against company's database (PostgreSQL or Supabase)
      const validAdmins = [
        { email: "admin@clarissavargas.com", password: "123456", name: "Clarissa Vargas", role: "company_admin", type: "admin" }
      ];

      const user = validAdmins.find(u => u.email === email && u.password === password);
      
      if (user) {
        res.json({ 
          success: true, 
          message: "Login realizado com sucesso",
          user: {
            id: Math.floor(Math.random() * 1000),
            email: user.email,
            name: user.name,
            role: user.role,
            type: user.type,
            companySlug: slug
          }
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: "Credenciais inválidas. Verifique seu email e senha." 
        });
      }
    } catch (error) {
      console.error('Error during company login:', error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  // Password reset functionality
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: "Email é obrigatório" 
        });
      }

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "Email não encontrado em nossa base de dados" 
        });
      }

      // Generate reset code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // For demo purposes - in production you would:
      // 1. Store the reset code in database with expiration
      // 2. Use real SMTP configurations from client "ab7"
      // Mock SMTP settings for client "ab7"
      const smtpConfig = {
        host: "smtp.gmail.com",
        port: 587,
        user: "clarissa@podologos.com.br",
        password: "senha_app_smtp",
        fromEmail: "noreply@podologos.com.br",
        fromName: "Comunidade de Podólogos"
      };

      // Create transporter
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: false,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.password
        }
      });

      // Email template
      const mailOptions = {
        from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`,
        to: email,
        subject: "Código de Recuperação de Senha - Comunidade de Podólogos",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Recuperação de Senha</h2>
            <p>Olá,</p>
            <p>Você solicitou a recuperação de senha para sua conta na <strong>Comunidade de Podólogos</strong>.</p>
            <p>Use o código abaixo para redefinir sua senha:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #1f2937; margin: 0; font-size: 32px; letter-spacing: 4px;">${resetCode}</h1>
            </div>
            <p>Este código é válido por 15 minutos.</p>
            <p>Se você não solicitou esta recuperação, ignore este email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">
              Comunidade de Podólogos - Administrada pela especialista Clarissa Vaz<br>
              Powered by MetaSync Digital
            </p>
          </div>
        `
      };

      // For demo purposes, simulate email sending
      console.log(`Simulated email sent to ${email} with reset code: ${resetCode}`);
      
      // Store reset code temporarily (in production, store in database)
      global.resetCodes = global.resetCodes || {};
      global.resetCodes[email] = {
        code: resetCode,
        expires: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      };

      res.json({ 
        success: true, 
        message: "Código de recuperação enviado para seu email",
        resetCode: resetCode // Only for demo - remove in production
      });

    } catch (error) {
      console.error('Error in forgot password:', error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  // Verify reset code and change password
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { email, resetCode, newPassword } = req.body;
      
      if (!email || !resetCode || !newPassword) {
        return res.status(400).json({ 
          success: false, 
          message: "Email, código e nova senha são obrigatórios" 
        });
      }

      // Check stored reset code
      const storedData = global.resetCodes?.[email];
      if (!storedData) {
        return res.status(400).json({ 
          success: false, 
          message: "Código de recuperação não encontrado ou expirado" 
        });
      }

      if (storedData.code !== resetCode) {
        return res.status(400).json({ 
          success: false, 
          message: "Código de recuperação inválido" 
        });
      }

      if (new Date() > storedData.expires) {
        delete global.resetCodes[email];
        return res.status(400).json({ 
          success: false, 
          message: "Código de recuperação expirado" 
        });
      }

      // Update password (in production, hash the password)
      // For demo purposes, just simulate success
      delete global.resetCodes[email];

      res.json({ 
        success: true, 
        message: "Senha redefinida com sucesso" 
      });

    } catch (error) {
      console.error('Error in reset password:', error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  // Usar serviço básico do WhatsApp (o profissional será usado no VPS)
  const whatsappService = whatsAppService;

  // WhatsApp Connection Routes
  app.post("/api/whatsapp/generate-qr", async (req, res) => {
    try {
      const qrCode = await whatsappService.generateQRCode();
      res.json({ 
        success: true, 
        qrCode: qrCode 
      });
    } catch (error) {
      console.error('Error generating WhatsApp QR Code:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao gerar QR Code' 
      });
    }
  });

  app.get("/api/whatsapp/status", async (req, res) => {
    try {
      const isConnected = whatsappService.getConnectionStatus();
      const currentQR = whatsappService.getCurrentQRCode();
      
      res.json({ 
        connected: isConnected,
        hasQrCode: !!currentQR,
        qrCode: currentQR
      });
    } catch (error) {
      console.error('Error getting WhatsApp status:', error);
      res.status(500).json({ 
        connected: false, 
        hasQrCode: false,
        error: 'Erro ao verificar status do WhatsApp'
      });
    }
  });

  app.post("/api/whatsapp/send-message", async (req, res) => {
    try {
      const { number, message } = req.body;
      
      if (!number || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'Número e mensagem são obrigatórios' 
        });
      }

      const success = await whatsAppService.sendMessage(number, message);
      
      res.json({ 
        success: success,
        message: success ? 'Mensagem enviada com sucesso' : 'Falha ao enviar mensagem'
      });
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao enviar mensagem'
      });
    }
  });

  app.post("/api/whatsapp/send-bulk", async (req, res) => {
    try {
      const { numbers, message, delay } = req.body;
      
      if (!numbers || !Array.isArray(numbers) || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'Lista de números e mensagem são obrigatórios' 
        });
      }

      const results = await whatsAppService.sendBulkMessages(numbers, message, delay || 5000);
      
      res.json({ 
        success: true,
        results: results
      });
    } catch (error) {
      console.error('Error sending bulk WhatsApp messages:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao enviar mensagens em lote'
      });
    }
  });

  app.post("/api/whatsapp/disconnect", async (req, res) => {
    try {
      await whatsAppService.disconnect();
      res.json({ 
        success: true, 
        message: 'WhatsApp desconectado com sucesso' 
      });
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao desconectar WhatsApp'
      });
    }
  });

  return httpServer;
}
