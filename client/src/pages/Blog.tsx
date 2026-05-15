import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import heroImage from "@assets/generated_images/hero_image_of_african_landscape_with_elephants_at_sunset.png";
import lionImage from "@assets/generated_images/close_up_of_a_lion.png";

const posts = [
  {
    id: 1,
    title: "The Best Time to Visit the Serengeti",
    excerpt: "Planning your safari? Discover why the dry season might be your best bet for wildlife viewing.",
    date: "Dec 12, 2024",
    author: "Sarah J.",
    image: heroImage,
    category: "Travel Tips"
  },
  {
    id: 2,
    title: "5 Luxury Lodges You Must Experience",
    excerpt: "From tented camps to private villas, here are the most exclusive stays in East Africa.",
    date: "Nov 28, 2024",
    author: "Michael K.",
    image: lionImage,
    category: "Accommodation"
  },
  {
    id: 3,
    title: "Packing for Your First Safari",
    excerpt: "Don't forget the essentials. Here is a comprehensive guide on what to bring.",
    date: "Oct 15, 2024",
    author: "Elena R.",
    image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800",
    category: "Guides"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="relative h-[40vh] flex items-center justify-center bg-black text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">Travel Journal</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">Stories, tips, and inspiration from the bush.</p>
        </div>
      </div>

      <main className="flex-grow py-20 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="group bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold uppercase px-3 py-1">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {post.author}
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {post.excerpt}
                </p>
                <Button variant="link" className="p-0 text-accent font-bold hover:no-underline hover:text-primary">
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
