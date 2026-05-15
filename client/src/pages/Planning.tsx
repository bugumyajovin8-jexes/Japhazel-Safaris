import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function Planning() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Request Received",
        description: "Our safari specialists will start crafting your itinerary.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <div className="bg-primary py-20 text-white text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Plan Your Custom Safari</h1>
        <p className="max-w-xl mx-auto opacity-80">Tell us about your dream trip, and we'll make it a reality.</p>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 shadow-lg border border-border">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif border-b pb-2">Traveler Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input required placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input required placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input required type="email" placeholder="jane@example.com" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif border-b pb-2">Trip Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Travel Dates</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (Days)</label>
                <Input type="number" placeholder="7" min="3" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium block mb-2">Interests</label>
              <div className="grid grid-cols-2 gap-2">
                {["Big Five Safari", "Gorilla Trekking", "Beach Relaxation", "Cultural Tours", "Photography", "Bird Watching"].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={item} />
                    <label htmlFor={item} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

             <div className="space-y-2">
                <label className="text-sm font-medium">Budget Per Person (USD)</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>$3,000 - $5,000</option>
                  <option>$5,000 - $8,000</option>
                  <option>$8,000 - $12,000</option>
                  <option>$12,000+</option>
                </select>
              </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Notes</label>
            <Textarea placeholder="Any specific requirements, dietary needs, or celebrations?" className="h-32" />
          </div>

          <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90 py-6 text-lg font-serif rounded-none" disabled={loading}>
            {loading ? "Submitting..." : "Submit Inquiry"}
          </Button>

        </form>
      </main>
      <Footer />
    </div>
  );
}
