import type { User, Company, Community, Space, Post, Event, MemberPoints, InsertUser, InsertCommunity, InsertSpace, InsertPost, InsertEvent } from "@shared/schema";
import type { IStorage } from "./storage";

export class CleanStorage implements IStorage {
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

    // Apenas admin MetaSync inicial
    this.initializeMetaSyncAdmin();
  }

  private initializeMetaSyncAdmin() {
    const metaSyncAdmin: User = {
      id: this.currentId++,
      username: "admin.metasync",
      email: "admin@metasyncdigital.com.br",
      password: "123456",
      firstName: "Admin",
      lastName: "MetaSync",
      avatar: null,
      role: "metasync_admin",
      isActive: true,
      phone: null,
      speciality: null,
      bio: null,
      companyId: null,
      isTemporaryPassword: false,
      passwordExpiresAt: null,
      lastPasswordChange: new Date(),
      resetToken: null,
      resetTokenExpiresAt: null,
      createdAt: new Date(),
    };

    this.users.set(metaSyncAdmin.id, metaSyncAdmin);
  }

  // Users
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
    const user: User = { 
      id: this.currentId++,
      avatar: null,
      role: "member",
      isActive: true,
      phone: null,
      speciality: null,
      bio: null,
      companyId: null,
      isTemporaryPassword: false,
      passwordExpiresAt: null,
      lastPasswordChange: new Date(),
      resetToken: null,
      resetTokenExpiresAt: null,
      createdAt: new Date(),
      ...insertUser,
    };
    this.users.set(user.id, user);
    return user;
  }

  // Communities
  async getCommunity(id: number): Promise<Community | undefined> {
    return this.communities.get(id);
  }

  async getCommunityBySlug(slug: string): Promise<Community | undefined> {
    return Array.from(this.communities.values()).find(community => community.slug === slug);
  }

  async createCommunity(insertCommunity: InsertCommunity): Promise<Community> {
    const community: Community = { 
      id: this.currentId++,
      isActive: true,
      logo: null,
      description: null,
      domain: null,
      theme: null,
      createdAt: new Date(),
      companyId: 1, // Default company
      ...insertCommunity,
    };
    this.communities.set(community.id, community);
    return community;
  }

  async getUserCommunities(userId: number): Promise<Community[]> {
    return Array.from(this.communities.values()).filter(community => community.ownerId === userId);
  }

  // Spaces
  async getSpace(id: number): Promise<Space | undefined> {
    return this.spaces.get(id);
  }

  async getCommunitySpaces(communityId: number): Promise<Space[]> {
    return Array.from(this.spaces.values()).filter(space => space.communityId === communityId);
  }

  async createSpace(insertSpace: InsertSpace): Promise<Space> {
    const space: Space = { 
      id: this.currentId++,
      isActive: true,
      createdAt: new Date(),
      ...insertSpace,
    };
    this.spaces.set(space.id, space);
    return space;
  }

  // Posts
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getSpacePosts(spaceId: number): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(post => post.spaceId === spaceId);
  }

  async getRecentPosts(communityId: number, limit = 10): Promise<(Post & { author: User })[]> {
    const posts = Array.from(this.posts.values())
      .filter(post => post.communityId === communityId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    return posts.map(post => {
      const author = this.users.get(post.authorId);
      return { ...post, author: author! };
    });
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const post: Post = { 
      id: this.currentId++,
      type: "discussion",
      isActive: true,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date(),
      ...insertPost,
    };
    this.posts.set(post.id, post);
    return post;
  }

  // Events
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getUpcomingEvents(communityId: number, limit = 5): Promise<Event[]> {
    const now = new Date();
    return Array.from(this.events.values())
      .filter(event => event.communityId === communityId && event.startDate > now)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, limit);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const event: Event = { 
      id: this.currentId++,
      endDate: null,
      location: null,
      maxAttendees: null,
      attendeesCount: 0,
      isOnline: false,
      isActive: true,
      createdAt: new Date(),
      ...insertEvent,
    };
    this.events.set(event.id, event);
    return event;
  }

  async joinEvent(eventId: number, userId: number): Promise<Event> {
    const event = this.events.get(eventId);
    if (event) {
      event.attendeesCount++;
      this.events.set(eventId, event);
    }
    return event!;
  }

  async leaveEvent(eventId: number, userId: number): Promise<Event> {
    const event = this.events.get(eventId);
    if (event && event.attendeesCount > 0) {
      event.attendeesCount--;
      this.events.set(eventId, event);
    }
    return event!;
  }

  async likePost(postId: number): Promise<Post> {
    const post = this.posts.get(postId);
    if (post) {
      post.likesCount++;
      this.posts.set(postId, post);
    }
    return post!;
  }

  // Member Points
  async getMemberPoints(userId: number, communityId: number): Promise<MemberPoints | undefined> {
    return this.memberPoints.get(`${userId}-${communityId}`);
  }

  async getTopMembers(communityId: number, limit = 5): Promise<(MemberPoints & { user: User })[]> {
    const points = Array.from(this.memberPoints.values())
      .filter(mp => mp.communityId === communityId)
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);

    return points.map(mp => {
      const user = this.users.get(mp.userId);
      return { ...mp, user: user! };
    });
  }

  async updateMemberPoints(userId: number, communityId: number, points: number): Promise<MemberPoints> {
    const key = `${userId}-${communityId}`;
    const existing = this.memberPoints.get(key);
    
    if (existing) {
      existing.points = points;
      existing.updatedAt = new Date();
      this.memberPoints.set(key, existing);
      return existing;
    } else {
      const memberPoints: MemberPoints = {
        id: this.currentId++,
        userId,
        communityId,
        points,
        level: Math.floor(points / 50) + 1,
        badges: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.memberPoints.set(key, memberPoints);
      return memberPoints;
    }
  }

  // Analytics
  async getCommunityStats(communityId: number): Promise<{
    activeMembers: number;
    postsToday: number;
    upcomingEvents: number;
    activeCourses: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const postsToday = Array.from(this.posts.values())
      .filter(post => post.communityId === communityId && post.createdAt >= today).length;
    
    const upcomingEvents = Array.from(this.events.values())
      .filter(event => event.communityId === communityId && event.startDate > new Date()).length;

    return {
      activeMembers: 0,
      postsToday,
      upcomingEvents,
      activeCourses: 0,
    };
  }
}