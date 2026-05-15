import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  role: text("role").notNull().default("admin"),
});

export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  price: integer("price").notNull(),
  duration: text("duration").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  highlights: text("highlights").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").notNull().references(() => tours.id, { onDelete: "cascade" }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  numberOfGuests: integer("number_of_guests").notNull(),
  travelDate: text("travel_date").notNull(),
  specialRequests: text("special_requests"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  caption: text("caption"),
  category: text("category").notNull().default("general"), // e.g. nature, wildlife, luxury
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  phoneNumber: text("phone_number"),
  subject: text("subject"),
  message: text("message"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertAdminUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertGalleryItemSchema = z.object({
  url: z.string().url("Invalid image URL"),
  caption: z.string().optional(),
  category: z.string().min(1, "Category is required"),
});

export const insertTourSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  price: z.number().positive("Price must be positive"),
  duration: z.string().min(1, "Duration is required"),
  image: z.string().url("Invalid image URL"),
  description: z.string().min(1, "Description is required"),
  highlights: z.array(z.string()),
});

export const insertBookingSchema = z.object({
  tourId: z.number().int(),
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().min(1, "Phone is required"),
  numberOfGuests: z.number().int().positive(),
  travelDate: z.string().min(1, "Travel date is required"),
  specialRequests: z.string().optional(),
});

export const insertContactMessageSchema = z.object({
  name: z.string().optional().nullable(),
  email: z.union([z.string().email("Invalid email"), z.literal("")]).optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSiteSettingSchema = z.object({
  settingKey: z.string().min(1, "Key is required"),
  settingValue: z.string(),
});

// Types
export type InsertAdminUser = typeof adminUsers.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertTour = typeof tours.$inferInsert;
export type Tour = typeof tours.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type InsertGalleryItem = typeof galleryItems.$inferInsert;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
