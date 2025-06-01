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
  role: text("role").notNull().default("member"), // metasync_admin, company_admin, specialist, member
  isActive: boolean("is_active").notNull().default(true),
  phone: text("phone"),
  speciality: text("speciality"),
  bio: text("bio"),
  companyId: integer("company_id").references(() => companies.id), // null para metasync_admin
  isTemporaryPassword: boolean("is_temporary_password").notNull().default(false),
  passwordExpiresAt: timestamp("password_expires_at"),
  lastPasswordChange: timestamp("last_password_change").defaultNow(),
  resetToken: text("reset_token"),
  resetTokenExpiresAt: timestamp("reset_token_expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tabela de empresas/clientes
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // para URLs personalizadas
  logo: text("logo"),
  description: text("description"),
  website: text("website"),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  instagram: text("instagram"),
  telegram: text("telegram"),
  facebook: text("facebook"),
  email: text("email"),
  address: text("address"),
  planType: text("plan_type").notNull().default("basic"), // basic, premium, enterprise
  isActive: boolean("is_active").notNull().default(true),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  maxUsers: integer("max_users").default(50),
  maxSpecialists: integer("max_specialists").default(5),
  customDomain: text("custom_domain"),
  // Configurações de White Label
  hasWhiteLabel: boolean("has_white_label").notNull().default(false),
  whiteLabelExpiresAt: timestamp("white_label_expires_at"),
  brandingColors: jsonb("branding_colors"), // cores personalizadas
  customCSS: text("custom_css"), // CSS personalizado
  footerText: text("footer_text"), // texto do rodapé personalizado
  hideMetaSyncBranding: boolean("hide_metasync_branding").notNull().default(false),
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
  companyId: integer("company_id").notNull().references(() => companies.id),
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

// Tabela para cursos integrados com PerfectPAY
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  price: text("price"), // Armazenado como texto para evitar problemas de precisão
  perfectPayUrl: text("perfect_pay_url"), // Link de compra do PerfectPAY
  perfectPayProductId: text("perfect_pay_product_id"), // ID do produto no PerfectPAY
  level: text("level").default("iniciante"), // iniciante, intermediario, avancado
  duration: text("duration"), // ex: "4 semanas", "12 horas"
  enrollmentCount: integer("enrollment_count").default(0),
  isActive: boolean("is_active").default(true),
  communityId: integer("community_id").notNull().references(() => communities.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tabela para controlar assinaturas dos usuários
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  planType: text("plan_type").notNull(), // "basic", "intermediate", "premium"
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  sosTicketsUsed: integer("sos_tickets_used").default(0),
  sosTicketsTotal: integer("sos_tickets_total").default(0),
  lastSosReset: timestamp("last_sos_reset").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela para rastrear uso dos tickets SOS
export const sosTicketUsage = pgTable("sos_ticket_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  subscriptionId: integer("subscription_id").notNull().references(() => userSubscriptions.id),
  usedAt: timestamp("used_at").defaultNow(),
  description: text("description"),
  specialistName: text("specialist_name"),
});

// Configurações do especialista (personalizável por comunidade)
export const specialistSettings = pgTable("specialist_settings", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  specialistName: text("specialist_name").notNull().default("Especialista"),
  specialistPhone: text("specialist_phone").notNull().default("11999999999"),
  specialistEmail: text("specialist_email"),
  speciality: text("speciality").default("Consultoria"),
  bio: text("bio"),
  avatar: text("avatar"),
  isActive: boolean("is_active").default(true),
  // Configurações de teste/beta
  betaModeEnabled: boolean("beta_mode_enabled").default(false),
  betaEndDate: timestamp("beta_end_date"),
  betaMessage: text("beta_message").default("🎉 Acesso Premium Beta - Teste gratuito por tempo limitado!"),
  // Sistema de countdown pós-beta
  gracePeriodEnabled: boolean("grace_period_enabled").default(false),
  gracePeriodDays: integer("grace_period_days").default(3),
  gracePeriodStartDate: timestamp("grace_period_start_date"),
  // Configurações de preços dos planos
  basicPlanPrice: text("basic_plan_price").default("29.90"),
  intermediatePlanPrice: text("intermediate_plan_price").default("59.90"),
  premiumPlanPrice: text("premium_plan_price").default("119.90"),
  // Configurações de suporte
  supportWhatsapp: text("support_whatsapp").default("17997337322"),
  supportEmail: text("support_email").default("suporte@metasync.com.br"),
  supportEnabled: boolean("support_enabled").default(true),
  // Configurações do ChatGPT/Assistente IA
  openaiApiKey: text("openai_api_key"),
  openaiModel: text("openai_model").default("gpt-4o"),
  assistantEnabled: boolean("assistant_enabled").default(false),
  assistantInstructions: text("assistant_instructions").default("Você é o assistente oficial desta comunidade. Seja sempre prestativo, claro e amigável."),
  assistantTemperature: text("assistant_temperature").default("0.7"),
  assistantMaxTokens: text("assistant_max_tokens").default("500"),
  createdAt: timestamp("created_at").defaultNow()
});

// Disponibilidades do especialista
export const availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (domingo-sábado)
  startTime: text("start_time").notNull(), // "09:00"
  endTime: text("end_time").notNull(), // "17:00"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Agendamentos
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  communityId: integer("community_id").notNull().references(() => communities.id),
  appointmentDate: timestamp("appointment_date").notNull(),
  duration: integer("duration").default(60), // em minutos
  type: text("type").notNull(), // "regular", "sos"
  status: text("status").default("scheduled"), // "scheduled", "confirmed", "completed", "cancelled"
  notes: text("notes"),
  meetingLink: text("meeting_link"),
  whatsappSent: boolean("whatsapp_sent").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Importações em lote
export const bulkImports = pgTable("bulk_imports", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  totalRecords: integer("total_records").notNull(),
  successCount: integer("success_count").notNull().default(0),
  errorCount: integer("error_count").notNull().default(0),
  status: text("status").notNull().default("processing"), // processing, completed, failed
  errors: jsonb("errors"), // Array de erros encontrados
  createdBy: integer("created_by").notNull().references(() => users.id),
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

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  enrollmentCount: true,
  createdAt: true,
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
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertSosTicketUsageSchema = createInsertSchema(sosTicketUsage).omit({
  id: true,
  usedAt: true,
});

export const insertAvailabilitySchema = createInsertSchema(availability).omit({
  id: true,
  createdAt: true,
});

export const insertSpecialistSettingsSchema = createInsertSchema(specialistSettings).omit({
  id: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type SosTicketUsage = typeof sosTicketUsage.$inferSelect;
export type InsertSosTicketUsage = z.infer<typeof insertSosTicketUsageSchema>;

export type SpecialistSettings = typeof specialistSettings.$inferSelect;
export type InsertSpecialistSettings = z.infer<typeof insertSpecialistSettingsSchema>;
export type Availability = typeof availability.$inferSelect;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
