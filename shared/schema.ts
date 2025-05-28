import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  avatar: text("avatar"),
  role: text("role").notNull().default("member"), // admin, moderator, member
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logo: text("logo"),
  domain: text("domain"),
  theme: jsonb("theme"), // colors, fonts, etc.
  ownerId: integer("owner_id").notNull().references(() => users.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const spaces = pgTable("spaces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // post, course, event, chat, ranking
  description: text("description"),
  communityId: integer("community_id").notNull().references(() => communities.id),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  spaceId: integer("space_id").notNull().references(() => spaces.id),
  likesCount: integer("likes_count").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  isPinned: boolean("is_pinned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location"),
  isOnline: boolean("is_online").notNull().default(false),
  youtubeUrl: text("youtube_url"), // Para lives/vídeos do YouTube
  eventType: text("event_type").notNull().default("meeting"), // meeting, live, video, workshop
  spaceId: integer("space_id").notNull().references(() => spaces.id),
  organizerId: integer("organizer_id").notNull().references(() => users.id),
  attendeesCount: integer("attendees_count").notNull().default(0),
  maxAttendees: integer("max_attendees"),
  whatsappNotificationsSent: boolean("whatsapp_notifications_sent").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const memberPoints = pgTable("member_points", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  communityId: integer("community_id").notNull().references(() => communities.id),
  points: integer("points").notNull().default(0),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relacionamento usuário-comunidade com roles específicos por comunidade
export const communityMembers = pgTable("community_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  communityId: integer("community_id").notNull().references(() => communities.id),
  role: text("role").notNull().default("member"), // owner, admin, moderator, member
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
  phoneNumber: text("phone_number"), // Para notificações WhatsApp
  receiveWhatsappNotifications: boolean("receive_whatsapp_notifications").notNull().default(true),
  receiveCommentNotifications: boolean("receive_comment_notifications").notNull().default(false),
});

// Tabela para comentários
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  postId: integer("post_id").notNull().references(() => posts.id),
  parentCommentId: integer("parent_comment_id").references(() => comments.id), // Para respostas
  likesCount: integer("likes_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tabela para vídeos/conteúdo multimídia
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  youtubeUrl: text("youtube_url").notNull(),
  thumbnail: text("thumbnail"),
  duration: integer("duration"), // em segundos
  authorId: integer("author_id").notNull().references(() => users.id),
  spaceId: integer("space_id").notNull().references(() => spaces.id),
  viewsCount: integer("views_count").notNull().default(0),
  likesCount: integer("likes_count").notNull().default(0),
  isLive: boolean("is_live").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCommunitySchema = createInsertSchema(communities).omit({
  id: true,
  createdAt: true,
});

export const insertSpaceSchema = createInsertSchema(spaces).omit({
  id: true,
  createdAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  likesCount: true,
  commentsCount: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  attendeesCount: true,
});

export const insertCommunityMemberSchema = createInsertSchema(communityMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  likesCount: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
  viewsCount: true,
  likesCount: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Community = typeof communities.$inferSelect;
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type Space = typeof spaces.$inferSelect;
export type InsertSpace = z.infer<typeof insertSpaceSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type MemberPoints = typeof memberPoints.$inferSelect;
export type CommunityMember = typeof communityMembers.$inferSelect;
export type InsertCommunityMember = z.infer<typeof insertCommunityMemberSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
