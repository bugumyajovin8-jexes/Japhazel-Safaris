import { storage } from "./storage";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  try {
    // Check if any admin user exists
    const adminByEmail = await storage.getAdminUserByEmail("admin@japhazel.com");
    
    if (!adminByEmail) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash("Gimanwe%2311", 10);
      
      await storage.createAdminUser({
        name: "Admin User",
        email: "admin@japhazel.com",
        hashedPassword,
        role: "admin",
      });
      
      console.log("Default admin user created: admin@japhazel.com / Gimanwe%2311");
    }

    // Seed sample tours if none exist
    const existingTours = await storage.getAllTours();
    if (existingTours.length === 0) {
      const sampleTours = [
        {
          title: "Luxury Serengeti Safari",
          location: "Tanzania",
          price: 4500,
          duration: "7 Days",
          image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1000",
          description: "Experience the magic of the Serengeti with our all-inclusive luxury safari. See the big five in their natural habitat and stay in world-class lodges.",
          highlights: ["Big Five Spotting", "Hot Air Balloon Safari", "Luxury Tented Camp", "Indigenous Cultural Visit"]
        },
        {
          title: "Cape Town & Garden Route",
          location: "South Africa",
          price: 3200,
          duration: "10 Days",
          image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=1000",
          description: "Explore the stunning coastal scenery of the Garden Route and the vibrant culture of Cape Town. Includes wine tasting in Stellenbosch.",
          highlights: ["Table Mountain Sunset", "Wine Tasting", "Penguin Colony Visit", "Coastal Scenic Drive"]
        },
        {
          title: "Victoria Falls Adventure",
          location: "Zimbabwe / Zambia",
          price: 1800,
          duration: "4 Days",
          image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1000",
          description: "Witness the 'Smoke that Thunders'. A breathtaking adventure at one of the world's natural wonders.",
          highlights: ["Helicopter over Falls", "Sunset Cruise", "Guided Rain Forest Tour", "Bungee Jumping (Optional)"]
        }
      ];

      for (const tour of sampleTours) {
        await storage.createTour(tour);
      }
      console.log("Sample tours seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
