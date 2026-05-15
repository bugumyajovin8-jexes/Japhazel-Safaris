import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold">
              Japhazel<span className="text-accent">.</span>
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed">
              Crafting unforgettable African journeys that blend luxury, adventure, and conservation. Experience the wild like never before.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 hover:bg-accent hover:text-white transition-colors rounded-full">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-accent hover:text-white transition-colors rounded-full">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-accent hover:text-white transition-colors rounded-full">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-accent hover:text-white transition-colors rounded-full">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 text-accent">Explore</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="hover:text-accent transition-colors cursor-pointer">About Us</Link></li>
              <li><Link href="/destinations" className="hover:text-accent transition-colors cursor-pointer">Destinations</Link></li>
              <li><Link href="/tours" className="hover:text-accent transition-colors cursor-pointer">Safari Packages</Link></li>
              <li><Link href="/gallery" className="hover:text-accent transition-colors cursor-pointer">Gallery</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors cursor-pointer">Travel Blog</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 text-accent">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-1" />
                <span>123 Safari Way, Arusha,<br />Tanzania</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>+255 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span>hello@japhazelsafaris.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 text-accent">Newsletter</h3>
            <p className="mb-4 text-primary-foreground/80">Subscribe for exclusive offers and travel inspiration.</p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Email Address" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent"
              />
              <Button type="submit" className="w-full bg-accent text-white hover:bg-accent/90 rounded-none">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Japhazel Safaris. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
