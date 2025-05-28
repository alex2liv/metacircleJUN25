import { 
  users, 
  communities, 
  spaces, 
  posts, 
  events, 
  memberPoints,
  type User, 
  type InsertUser,
  type Community,
  type InsertCommunity,
  type Space,
  type InsertSpace,
  type Post,
  type InsertPost,
  type Event,
  type InsertEvent,
  type MemberPoints
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Communities
  getCommunity(id: number): Promise<Community | undefined>;
  getCommunityBySlug(slug: string): Promise<Community | undefined>;
  createCommunity(community: InsertCommunity): Promise<Community>;
  getUserCommunities(userId: number): Promise<Community[]>;

  // Spaces
  getSpace(id: number): Promise<Space | undefined>;
  getCommunitySpaces(communityId: number): Promise<Space[]>;
  createSpace(space: InsertSpace): Promise<Space>;

  // Posts
  getPost(id: number): Promise<Post | undefined>;
  getSpacePosts(spaceId: number): Promise<Post[]>;
  getRecentPosts(communityId: number, limit?: number): Promise<(Post & { author: User })[]>;
  createPost(post: InsertPost): Promise<Post>;

  // Events
  getEvent(id: number): Promise<Event | undefined>;
  getUpcomingEvents(communityId: number, limit?: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;

  // Member Points
  getMemberPoints(userId: number, communityId: number): Promise<MemberPoints | undefined>;
  getTopMembers(communityId: number, limit?: number): Promise<(MemberPoints & { user: User })[]>;
  updateMemberPoints(userId: number, communityId: number, points: number): Promise<MemberPoints>;

  // Analytics
  getCommunityStats(communityId: number): Promise<{
    activeMembers: number;
    postsToday: number;
    upcomingEvents: number;
    activeCourses: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private communities: Map<number, Community>;
  private spaces: Map<number, Space>;
  private posts: Map<number, Post>;
  private events: Map<number, Event>;
  private memberPoints: Map<string, MemberPoints>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.communities = new Map();
    this.spaces = new Map();
    this.posts = new Map();
    this.events = new Map();
    this.memberPoints = new Map();
    this.currentId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const user1: User = {
      id: this.currentId++,
      username: "alexandre.nunes",
      email: "alexandre@metasync.com.br",
      password: "hashed_password",
      firstName: "Alexandre",
      lastName: "Nunes",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=40&h=40",
      role: "admin",
      isActive: true,
      createdAt: new Date(),
    };

    const user2: User = {
      id: this.currentId++,
      username: "maria.santos",
      email: "maria@metasync.com.br",
      password: "hashed_password",
      firstName: "Maria",
      lastName: "Santos",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=32&h=32",
      role: "member",
      isActive: true,
      createdAt: new Date(),
    };

    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);

    // Create sample community
    const community: Community = {
      id: this.currentId++,
      name: "MetaCircle",
      slug: "metacircle",
      description: "Comunidade oficial do MetaCircle",
      logo: null,
      domain: null,
      theme: {
        primary: "#7c3aed",
        secondary: "#6366f1"
      },
      ownerId: user1.id,
      isActive: true,
      createdAt: new Date(),
    };

    this.communities.set(community.id, community);

    // Create sample spaces
    const spaces_data = [
      { name: "Geral", type: "post", description: "Discussões gerais da comunidade" },
      { name: "Cursos", type: "course", description: "Cursos e materiais educativos" },
      { name: "Eventos", type: "event", description: "Eventos e workshops" },
      { name: "Ranking", type: "ranking", description: "Ranking de membros" },
    ];

    spaces_data.forEach(spaceData => {
      const space: Space = {
        id: this.currentId++,
        name: spaceData.name,
        type: spaceData.type,
        description: spaceData.description,
        communityId: community.id,
        isPublic: true,
        createdAt: new Date(),
      };
      this.spaces.set(space.id, space);
    });

    // Create sample posts
    const post: Post = {
      id: this.currentId++,
      title: "Como implementar gamificação em comunidades digitais",
      content: "Um guia completo para engajar seus membros e criar uma experiência interativa...",
      authorId: user2.id,
      spaceId: Array.from(this.spaces.values()).find(s => s.type === "post")!.id,
      likesCount: 12,
      commentsCount: 5,
      isPinned: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    };

    this.posts.set(post.id, post);

    // Create sample events
    const event: Event = {
      id: this.currentId++,
      title: "Workshop React",
      description: "Aprenda React do básico ao avançado",
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // Tomorrow + 2 hours
      location: null,
      isOnline: true,
      youtubeUrl: null,
      eventType: "workshop",
      spaceId: Array.from(this.spaces.values()).find(s => s.type === "event")!.id,
      organizerId: user1.id,
      attendeesCount: 23,
      maxAttendees: 50,
      whatsappNotificationsSent: false,
      createdAt: new Date(),
    };

    this.events.set(event.id, event);

    // Create sample member points
    const points1: MemberPoints = {
      id: this.currentId++,
      userId: user1.id,
      communityId: community.id,
      points: 2485,
      level: 5,
      createdAt: new Date(),
    };

    const points2: MemberPoints = {
      id: this.currentId++,
      userId: user2.id,
      communityId: community.id,
      points: 2203,
      level: 4,
      createdAt: new Date(),
    };

    this.memberPoints.set(`${user1.id}-${community.id}`, points1);
    this.memberPoints.set(`${user2.id}-${community.id}`, points2);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      avatar: insertUser.avatar || null,
      role: insertUser.role || "member",
      isActive: insertUser.isActive ?? true,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getCommunity(id: number): Promise<Community | undefined> {
    return this.communities.get(id);
  }

  async getCommunityBySlug(slug: string): Promise<Community | undefined> {
    return Array.from(this.communities.values()).find(community => community.slug === slug);
  }

  async createCommunity(insertCommunity: InsertCommunity): Promise<Community> {
    const id = this.currentId++;
    const community: Community = { 
      ...insertCommunity, 
      id,
      description: insertCommunity.description || null,
      logo: insertCommunity.logo || null,
      domain: insertCommunity.domain || null,
      theme: insertCommunity.theme || null,
      isActive: insertCommunity.isActive ?? true,
      createdAt: new Date()
    };
    this.communities.set(id, community);
    return community;
  }

  async getUserCommunities(userId: number): Promise<Community[]> {
    return Array.from(this.communities.values()).filter(community => 
      community.ownerId === userId
    );
  }

  async getSpace(id: number): Promise<Space | undefined> {
    return this.spaces.get(id);
  }

  async getCommunitySpaces(communityId: number): Promise<Space[]> {
    return Array.from(this.spaces.values()).filter(space => 
      space.communityId === communityId
    );
  }

  async createSpace(insertSpace: InsertSpace): Promise<Space> {
    const id = this.currentId++;
    const space: Space = { 
      ...insertSpace, 
      id,
      description: insertSpace.description || null,
      isPublic: insertSpace.isPublic ?? true,
      createdAt: new Date()
    };
    this.spaces.set(id, space);
    return space;
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getSpacePosts(spaceId: number): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(post => 
      post.spaceId === spaceId
    );
  }

  async getRecentPosts(communityId: number, limit = 10): Promise<(Post & { author: User })[]> {
    const communitySpaces = await this.getCommunitySpaces(communityId);
    const spaceIds = communitySpaces.map(space => space.id);
    
    const posts = Array.from(this.posts.values())
      .filter(post => spaceIds.includes(post.spaceId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    return posts.map(post => ({
      ...post,
      author: this.users.get(post.authorId)!
    }));
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentId++;
    const post: Post = { 
      ...insertPost, 
      id,
      likesCount: 0,
      commentsCount: 0,
      isPinned: false,
      createdAt: new Date()
    };
    this.posts.set(id, post);
    return post;
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getUpcomingEvents(communityId: number, limit = 5): Promise<Event[]> {
    const communitySpaces = await this.getCommunitySpaces(communityId);
    const spaceIds = communitySpaces.map(space => space.id);
    
    return Array.from(this.events.values())
      .filter(event => 
        spaceIds.includes(event.spaceId) && 
        event.startDate.getTime() > Date.now()
      )
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, limit);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentId++;
    const event: Event = { 
      ...insertEvent, 
      id,
      description: insertEvent.description || null,
      endDate: insertEvent.endDate || null,
      location: insertEvent.location || null,
      youtubeUrl: insertEvent.youtubeUrl || null,
      eventType: insertEvent.eventType || "meeting",
      isOnline: insertEvent.isOnline ?? false,
      maxAttendees: insertEvent.maxAttendees || null,
      attendeesCount: 0,
      whatsappNotificationsSent: false,
      createdAt: new Date()
    };
    this.events.set(id, event);
    return event;
  }

  async getMemberPoints(userId: number, communityId: number): Promise<MemberPoints | undefined> {
    return this.memberPoints.get(`${userId}-${communityId}`);
  }

  async getTopMembers(communityId: number, limit = 5): Promise<(MemberPoints & { user: User })[]> {
    return Array.from(this.memberPoints.values())
      .filter(points => points.communityId === communityId)
      .sort((a, b) => b.points - a.points)
      .slice(0, limit)
      .map(points => ({
        ...points,
        user: this.users.get(points.userId)!
      }));
  }

  async updateMemberPoints(userId: number, communityId: number, points: number): Promise<MemberPoints> {
    const key = `${userId}-${communityId}`;
    const existing = this.memberPoints.get(key);
    
    if (existing) {
      existing.points = points;
      return existing;
    } else {
      const id = this.currentId++;
      const memberPoints: MemberPoints = {
        id,
        userId,
        communityId,
        points,
        level: Math.floor(points / 500) + 1,
        createdAt: new Date()
      };
      this.memberPoints.set(key, memberPoints);
      return memberPoints;
    }
  }

  async getCommunityStats(communityId: number): Promise<{
    activeMembers: number;
    postsToday: number;
    upcomingEvents: number;
    activeCourses: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const communitySpaces = await this.getCommunitySpaces(communityId);
    const spaceIds = communitySpaces.map(space => space.id);

    const postsToday = Array.from(this.posts.values())
      .filter(post => 
        spaceIds.includes(post.spaceId) && 
        post.createdAt.getTime() >= today.getTime()
      ).length;

    const upcomingEvents = Array.from(this.events.values())
      .filter(event => 
        spaceIds.includes(event.spaceId) && 
        event.startDate.getTime() > Date.now()
      ).length;

    const activeCourses = communitySpaces.filter(space => space.type === "course").length;

    const activeMembers = Array.from(this.memberPoints.values())
      .filter(points => points.communityId === communityId).length;

    return {
      activeMembers,
      postsToday,
      upcomingEvents,
      activeCourses
    };
  }
}

export const storage = new MemStorage();
