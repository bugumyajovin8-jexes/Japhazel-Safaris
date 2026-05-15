import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTourSchema, insertBookingSchema, insertGalleryItemSchema, insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { supabase } from "./supabase";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============= AUTH ROUTES =============
  // These are now handled by Supabase client-side, 
  // but we keep the requireAuth middleware for API protection.

  // ============= MIDDLEWARE =============
  
  const requireAuth = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    
    if (!supabase) {
      console.error("Supabase client not initialized on server");
      return res.status(500).json({ error: "Auth configuration error" });
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Auth verification error:", error);
      return res.status(401).json({ error: "Authentication failed" });
    }
  };

  // ============= ACCOUNT SETTINGS ROUTES =============
  
  // (Account settings now handled via Supabase Dashboard/SDK)

  // ============= TOUR ROUTES =============
  
  // Get all tours (public)
  app.get("/api/tours", async (req, res) => {
    try {
      const allTours = await storage.getAllTours();
      return res.json(allTours);
    } catch (error) {
      console.error("Get tours error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get single tour (public)
  app.get("/api/tours/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tour = await storage.getTourById(id);
      
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
      
      return res.json(tour);
    } catch (error) {
      console.error("Get tour error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create tour (protected)
  app.post("/api/tours", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTourSchema.parse(req.body);
      const tour = await storage.createTour(validatedData);
      return res.status(201).json(tour);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      console.error("Create tour error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update tour (protected)
  app.put("/api/tours/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTourSchema.parse(req.body);
      const tour = await storage.updateTour(id, validatedData);
      
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
      
      return res.json(tour);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      console.error("Update tour error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete tour (protected)
  app.delete("/api/tours/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTour(id);
      
      if (!success) {
        return res.status(404).json({ error: "Tour not found" });
      }
      
      return res.json({ message: "Tour deleted successfully" });
    } catch (error) {
      console.error("Delete tour error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= BOOKING ROUTES =============
  
  // Get all bookings (protected)
  app.get("/api/bookings", requireAuth, async (req, res) => {
    try {
      const allBookings = await storage.getAllBookings();
      return res.json(allBookings);
    } catch (error) {
      console.error("Get bookings error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create booking (public)
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      return res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      console.error("Create booking error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update booking status (protected)
  app.patch("/api/bookings/:id/status", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const booking = await storage.updateBookingStatus(id, status);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      return res.json(booking);
    } catch (error) {
      console.error("Update booking status error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete booking (protected)
  app.delete("/api/bookings/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBooking(id);
      
      if (!success) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      return res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error("Delete booking error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= GALLERY ROUTES =============
  
  // Get all gallery items (public)
  app.get("/api/gallery", async (req, res) => {
    try {
      const items = await storage.getAllGalleryItems();
      return res.json(items);
    } catch (error) {
      console.error("Get gallery items error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create gallery item (protected)
  app.post("/api/gallery", requireAuth, async (req, res) => {
    try {
      const validatedData = insertGalleryItemSchema.parse(req.body);
      const item = await storage.createGalleryItem(validatedData);
      return res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      console.error("Create gallery item error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete gallery item (protected)
  app.delete("/api/gallery/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGalleryItem(id);
      
      if (!success) {
        return res.status(404).json({ error: "Gallery item not found" });
      }
      
      return res.json({ message: "Gallery item deleted successfully" });
    } catch (error) {
      console.error("Delete gallery item error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= CONTACT ROUTES =============

  // Get all contact messages (protected)
  app.get("/api/contact", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      // Sort by newest first
      messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json(messages);
    } catch (error) {
      console.error("Get contact messages error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create contact message (public)
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      return res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues.map(i => i.message).join(", ") });
      }
      console.error("Create contact message error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update contact message read status (protected)
  app.patch("/api/contact/:id/read", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isRead } = req.body;
      
      if (typeof isRead !== "boolean") {
        return res.status(400).json({ error: "isRead must be a boolean" });
      }

      const updated = await storage.updateContactMessageStatus(id, isRead);
      if (!updated) {
        return res.status(404).json({ error: "Message not found" });
      }
      return res.json(updated);
    } catch (error) {
      console.error("Update message status error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete contact message (protected)
  app.delete("/api/contact/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContactMessage(id);
      if (!success) {
        return res.status(404).json({ error: "Message not found" });
      }
      return res.json({ message: "Message deleted successfully" });
    } catch (error) {
      console.error("Delete message error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= SETTINGS ROUTES =============

  // Get all settings (public so frontend can fetch hero video)
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSiteSettings();
      // Transform array of { settingKey: "a", settingValue: "b" } into an object { a: "b" }
      const settingsMap = settings.reduce((acc, curr) => {
        acc[curr.settingKey] = curr.settingValue;
        return acc;
      }, {} as Record<string, string>);
      return res.json(settingsMap);
    } catch (error) {
      console.error("Get settings error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Upsert a setting (protected)
  app.put("/api/settings/:key", requireAuth, async (req, res) => {
    try {
      const key = req.params.key;
      const { value } = req.body;
      
      if (value === undefined) {
        return res.status(400).json({ error: "Value is required in request body" });
      }

      const updated = await storage.upsertSiteSetting({ settingKey: key, settingValue: value });
      return res.json(updated);
    } catch (error) {
      console.error("Update setting error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
