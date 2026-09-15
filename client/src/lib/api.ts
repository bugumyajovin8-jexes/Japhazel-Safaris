import type { Tour, Booking, AdminUser, GalleryItem, ContactMessage, InsertContactMessage } from "@shared/schema";
import { supabase } from "./supabase";

const API_BASE = "/api";

async function getAuthHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
  }
  
  return headers;
}

// Contact API
export const contactApi = {
  getAll: async (): Promise<ContactMessage[]> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/contact`, {
      headers,
    });
    if (!res.ok) throw new Error("Failed to fetch contact messages");
    return res.json();
  },

  create: async (message: InsertContactMessage): Promise<ContactMessage> => {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to send message");
    }
    
    return res.json();
  },

  updateStatus: async (id: number, isRead: boolean): Promise<ContactMessage> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/contact/${id}/read`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ isRead }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update message status");
    }
    
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/contact/${id}`, {
      method: "DELETE",
      headers,
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete message");
    }
  },
};

// Gallery API
export const galleryApi = {
  getAll: async (): Promise<GalleryItem[]> => {
    const res = await fetch(`${API_BASE}/gallery`);
    if (!res.ok) throw new Error("Failed to fetch gallery items");
    return res.json();
  },

  create: async (item: Omit<GalleryItem, "id" | "createdAt">): Promise<GalleryItem> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/gallery`, {
      method: "POST",
      headers,
      body: JSON.stringify(item),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to add gallery item");
    }
    
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: "DELETE",
      headers,
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete gallery item");
    }
  },
};

// Tours API
export const toursApi = {
  getAll: async (): Promise<Tour[]> => {
    const res = await fetch(`${API_BASE}/tours`);
    if (!res.ok) throw new Error("Failed to fetch tours");
    return res.json();
  },

  getById: async (id: number): Promise<Tour> => {
    const res = await fetch(`${API_BASE}/tours/${id}`);
    if (!res.ok) throw new Error("Failed to fetch tour");
    return res.json();
  },

  create: async (tour: Omit<Tour, "id" | "createdAt">): Promise<Tour> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/tours`, {
      method: "POST",
      headers,
      body: JSON.stringify(tour),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create tour");
    }
    
    return res.json();
  },

  update: async (id: number, tour: Omit<Tour, "id" | "createdAt">): Promise<Tour> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/tours/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(tour),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update tour");
    }
    
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/tours/${id}`, {
      method: "DELETE",
      headers,
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete tour");
    }
  },
};

// Bookings API
export const bookingsApi = {
  getAll: async (): Promise<Booking[]> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/bookings`, {
      headers,
    });
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
  },

  create: async (booking: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create booking");
    }
    
    return res.json();
  },

  updateStatus: async (id: number, status: string): Promise<Booking> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update booking status");
    }
    
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: "DELETE",
      headers,
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete booking");
    }
  },
};

// Settings API
export const settingsApi = {
  getAll: async (): Promise<Record<string, string>> => {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error("Failed to fetch settings");
    return res.json();
  },

  update: async (key: string, value: string): Promise<any> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/settings/${key}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ value }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update setting");
    }
    
    return res.json();
  },
};
