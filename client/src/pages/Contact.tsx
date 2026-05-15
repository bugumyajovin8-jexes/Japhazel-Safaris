import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail } from "lucide-react";
import heroVideo from "@assets/generated_videos/victoria_falls_waterfall_aerial.mp4";
import { useMutation } from "@tanstack/react-query";
import { contactApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });

  const sendMessageMutation = useMutation({
    mutationFn: contactApi.create,
    onSuccess: () => {
      toast({ title: "Message Sent", description: "Thank you for reaching out. We will get back to you soon!" });
      setFormData({ name: "", email: "", phoneNumber: "", subject: "", message: "" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {/* Header with Video */}
      <div className="relative h-[40vh] flex items-center justify-center bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">Start planning your dream safari today.</p>
        </div>
      </div>

      <main className="flex-grow py-20 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-2">Contact Us</h2>
            <h3 className="text-4xl font-serif font-bold text-primary mb-8">We'd love to hear from you</h3>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-full text-accent">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Visit Us</h4>
                  <p className="text-muted-foreground">123 Safari Way, Arusha<br/>Tanzania, East Africa</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-full text-accent">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Call Us</h4>
                  <p className="text-muted-foreground">+255 123 456 789<br/>Mon - Fri, 8am - 6pm EAT</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-full text-accent">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Email Us</h4>
                  <p className="text-muted-foreground">hello@japhazelsafaris.com<br/>bookings@japhazelsafaris.com</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 h-64 w-full rounded-lg flex items-center justify-center text-muted-foreground">
              Map Placeholder
            </div>
          </div>

          {/* Form */}
          <div className="bg-card p-8 shadow-lg border border-border">
            <h3 className="text-2xl font-serif font-bold mb-6">Send a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input 
                    placeholder="+1 234 567 890" 
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input 
                  type="email" 
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input 
                  placeholder="Inquiry about Serengeti Tour" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  placeholder="Tell us about your travel plans..." 
                  className="min-h-[150px]" 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary text-white hover:bg-primary/90 py-6 rounded-none text-lg"
                disabled={sendMessageMutation.isPending}
              >
                {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
