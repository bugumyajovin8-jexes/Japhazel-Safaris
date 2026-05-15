import { 
  adminUsers, 
  tours, 
  bookings, 
  galleryItems,
  contactMessages,
  siteSettings,
  type AdminUser, 
  type InsertAdminUser, 
  type Tour, 
  type InsertTour, 
  type Booking, 
  type InsertBooking,
  type GalleryItem,
  type InsertGalleryItem,
  type ContactMessage,
  type InsertContactMessage,
  type SiteSetting,
  type InsertSiteSetting
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Admin Users
  getAdminUserById(id: number): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(user: Omit<AdminUser, "id">): Promise<AdminUser>;
  updateAdminUser(id: number, data: { email: string; name: string; hashedPassword: string }): Promise<AdminUser>;
  
  // Tours
  getAllTours(): Promise<Tour[]>;
  getTourById(id: number): Promise<Tour | undefined>;
  createTour(tour: InsertTour): Promise<Tour>;
  updateTour(id: number, tour: InsertTour): Promise<Tour | undefined>;
  deleteTour(id: number): Promise<boolean>;
  
  // Bookings
  getAllBookings(): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  getBookingsByTourId(tourId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  deleteBooking(id: number): Promise<boolean>;

  // Gallery
  getAllGalleryItems(): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  deleteGalleryItem(id: number): Promise<boolean>;

  // Contact Messages
  getAllContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessageStatus(id: number, isRead: boolean): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<boolean>;

  // Settings
  getAllSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
}

export class DatabaseStorage implements IStorage {
  async getAdminUserById(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return user || undefined;
  }

  async createAdminUser(user: Omit<AdminUser, "id">): Promise<AdminUser> {
    const [newUser] = await db
      .insert(adminUsers)
      .values(user)
      .returning();
    return newUser;
  }

  async updateAdminUser(id: number, data: { email: string; name: string; hashedPassword: string }): Promise<AdminUser> {
    const [updatedUser] = await db
      .update(adminUsers)
      .set(data)
      .where(eq(adminUsers.id, id))
      .returning();
    return updatedUser;
  }

  async getAllTours(): Promise<Tour[]> {
    return await db.select().from(tours);
  }

  async getTourById(id: number): Promise<Tour | undefined> {
    const [tour] = await db.select().from(tours).where(eq(tours.id, id));
    return tour || undefined;
  }

  async createTour(tour: InsertTour): Promise<Tour> {
    const [newTour] = await db
      .insert(tours)
      .values(tour)
      .returning();
    return newTour;
  }

  async updateTour(id: number, tour: InsertTour): Promise<Tour | undefined> {
    const [updatedTour] = await db
      .update(tours)
      .set(tour)
      .where(eq(tours.id, id))
      .returning();
    return updatedTour || undefined;
  }

  async deleteTour(id: number): Promise<boolean> {
    const result = await db
      .delete(tours)
      .where(eq(tours.id, id))
      .returning();
    return result.length > 0;
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookingsByTourId(tourId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.tourId, tourId));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }

  async deleteBooking(id: number): Promise<boolean> {
    const result = await db
      .delete(bookings)
      .where(eq(bookings.id, id))
      .returning();
    return result.length > 0;
  }

  async getAllGalleryItems(): Promise<GalleryItem[]> {
    return await db.select().from(galleryItems);
  }

  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const [newItem] = await db
      .insert(galleryItems)
      .values(item)
      .returning();
    return newItem;
  }

  async deleteGalleryItem(id: number): Promise<boolean> {
    const result = await db
      .delete(galleryItems)
      .where(eq(galleryItems.id, id))
      .returning();
    return result.length > 0;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async updateContactMessageStatus(id: number, isRead: boolean): Promise<ContactMessage | undefined> {
    const [updatedMessage] = await db
      .update(contactMessages)
      .set({ isRead })
      .where(eq(contactMessages.id, id))
      .returning();
    return updatedMessage || undefined;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    const result = await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, id))
      .returning();
    return result.length > 0;
  }

  async getAllSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, key));
    return setting || undefined;
  }

  async upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const existing = await this.getSiteSetting(setting.settingKey);
    if (existing) {
      const [updated] = await db
        .update(siteSettings)
        .set({ settingValue: setting.settingValue, updatedAt: new Date() })
        .where(eq(siteSettings.settingKey, setting.settingKey))
        .returning();
      return updated;
    } else {
      const [inserted] = await db
        .insert(siteSettings)
        .values(setting)
        .returning();
      return inserted;
    }
  }
}

export class MemoryStorage implements IStorage {
  private users: Map<number, AdminUser>;
  private tours: Map<number, Tour>;
  private bookings: Map<number, Booking>;
  private galleryItems: Map<number, GalleryItem>;
  private contactMessagesMap: Map<number, ContactMessage>;
  private siteSettingsMap: Map<string, SiteSetting>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.tours = new Map();
    this.bookings = new Map();
    this.galleryItems = new Map();
    this.contactMessagesMap = new Map();
    this.siteSettingsMap = new Map();
    this.currentId = 1;
  }

  async getAdminUserById(id: number) { return this.users.get(id); }
  async getAdminUserByEmail(email: string) { return Array.from(this.users.values()).find(u => u.email === email); }
  async createAdminUser(user: any) {
    const id = this.currentId++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  async updateAdminUser(id: number, data: any) {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async getAllTours() { return Array.from(this.tours.values()); }
  async getTourById(id: number) { return this.tours.get(id); }
  async createTour(tour: any) {
    const id = this.currentId++;
    const newTour = { ...tour, id, createdAt: new Date() };
    this.tours.set(id, newTour);
    return newTour;
  }
  async updateTour(id: number, tour: any) {
    if (!this.tours.has(id)) return undefined;
    const updated = { ...this.tours.get(id), ...tour };
    this.tours.set(id, updated);
    return updated;
  }
  async deleteTour(id: number) { return this.tours.delete(id); }

  async getAllBookings() { return Array.from(this.bookings.values()); }
  async getBookingById(id: number) { return this.bookings.get(id); }
  async getBookingsByTourId(tourId: number) { return Array.from(this.bookings.values()).filter(b => b.tourId === tourId); }
  async createBooking(booking: any) {
    const id = this.currentId++;
    const newBooking = { ...booking, id, createdAt: new Date(), status: "pending" };
    this.bookings.set(id, newBooking);
    return newBooking;
  }
  async updateBookingStatus(id: number, status: string) {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    const updated = { ...booking, status };
    this.bookings.set(id, updated);
    return updated;
  }
  async deleteBooking(id: number) { return this.bookings.delete(id); }

  async getAllGalleryItems() { return Array.from(this.galleryItems.values()); }
  async createGalleryItem(item: any) {
    const id = this.currentId++;
    const newItem = { ...item, id, createdAt: new Date() };
    this.galleryItems.set(id, newItem);
    return newItem;
  }
  async deleteGalleryItem(id: number) { return this.galleryItems.delete(id); }

  async getAllContactMessages() { return Array.from(this.contactMessagesMap.values()); }
  async createContactMessage(message: any) {
    const id = this.currentId++;
    const newMessage = { ...message, id, isRead: false, createdAt: new Date() };
    this.contactMessagesMap.set(id, newMessage);
    return newMessage;
  }
  async updateContactMessageStatus(id: number, isRead: boolean) {
    const message = this.contactMessagesMap.get(id);
    if (!message) return undefined;
    const updated = { ...message, isRead };
    this.contactMessagesMap.set(id, updated);
    return updated;
  }
  async deleteContactMessage(id: number) { return this.contactMessagesMap.delete(id); }

  async getAllSiteSettings() { return Array.from(this.siteSettingsMap.values()); }
  async getSiteSetting(key: string) { return this.siteSettingsMap.get(key); }
  async upsertSiteSetting(setting: any) {
    const existing = this.siteSettingsMap.get(setting.settingKey);
    const id = existing ? existing.id : this.currentId++;
    const value = { id, ...setting, updatedAt: new Date() };
    this.siteSettingsMap.set(setting.settingKey, value);
    return value;
  }
}

export class ResilientStorage implements IStorage {
  private dbStorage: DatabaseStorage;
  private memoryStorage: MemoryStorage;
  private useMemory: boolean;

  constructor() {
    this.dbStorage = new DatabaseStorage();
    this.memoryStorage = new MemoryStorage();
    this.useMemory = !process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("http");
    
    if (this.useMemory) {
      console.warn("ResilientStorage: Starting in MEMORY mode due to missing or invalid DATABASE_URL.");
    }
  }

  private async withFallback<T>(fn: (storage: IStorage) => Promise<T>): Promise<T> {
    if (this.useMemory && !process.env.DATABASE_URL) {
      return fn(this.memoryStorage);
    }

    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Database connection timed out")), 3000); // 3s timeout for Vercel
    });
    
    try {
      const result = await Promise.race([fn(this.dbStorage), timeoutPromise]) as T;
      clearTimeout(timeoutId!);
      return result;
    } catch (e: any) {
      clearTimeout(timeoutId!);
      console.error(`ResilientStorage: DB error occurred, falling back to memory storage. Error: ${e.message}`);
      // Do not permanently disable DB in serverless mode, just fallback for this request
      return fn(this.memoryStorage);
    }
  }

  getAdminUserById(id: number) { return this.withFallback(s => s.getAdminUserById(id)); }
  getAdminUserByEmail(email: string) { return this.withFallback(s => s.getAdminUserByEmail(email)); }
  createAdminUser(user: any) { return this.withFallback(s => s.createAdminUser(user)); }
  updateAdminUser(id: number, data: any) { return this.withFallback(s => s.updateAdminUser(id, data)); }
  getAllTours() { return this.withFallback(s => s.getAllTours()); }
  getTourById(id: number) { return this.withFallback(s => s.getTourById(id)); }
  createTour(tour: any) { return this.withFallback(s => s.createTour(tour)); }
  updateTour(id: number, tour: any) { return this.withFallback(s => s.updateTour(id, tour)); }
  deleteTour(id: number) { return this.withFallback(s => s.deleteTour(id)); }
  getAllBookings() { return this.withFallback(s => s.getAllBookings()); }
  getBookingById(id: number) { return this.withFallback(s => s.getBookingById(id)); }
  getBookingsByTourId(tourId: number) { return this.withFallback(s => s.getBookingsByTourId(tourId)); }
  createBooking(booking: any) { return this.withFallback(s => s.createBooking(booking)); }
  updateBookingStatus(id: number, status: string) { return this.withFallback(s => s.updateBookingStatus(id, status)); }
  deleteBooking(id: number) { return this.withFallback(s => s.deleteBooking(id)); }
  getAllGalleryItems() { return this.withFallback(s => s.getAllGalleryItems()); }
  createGalleryItem(item: any) { return this.withFallback(s => s.createGalleryItem(item)); }
  deleteGalleryItem(id: number) { return this.withFallback(s => s.deleteGalleryItem(id)); }
  getAllContactMessages() { return this.withFallback(s => s.getAllContactMessages()); }
  createContactMessage(message: any) { return this.withFallback(s => s.createContactMessage(message)); }
  updateContactMessageStatus(id: number, isRead: boolean) { return this.withFallback(s => s.updateContactMessageStatus(id, isRead)); }
  deleteContactMessage(id: number) { return this.withFallback(s => s.deleteContactMessage(id)); }
  getAllSiteSettings() { return this.withFallback(s => s.getAllSiteSettings()); }
  getSiteSetting(key: string) { return this.withFallback(s => s.getSiteSetting(key)); }
  upsertSiteSetting(setting: any) { return this.withFallback(s => s.upsertSiteSetting(setting)); }
}

export const storage = new ResilientStorage();
