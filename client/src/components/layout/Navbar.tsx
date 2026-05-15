import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImage from "@assets/lion_1765365690581.jpeg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Destinations", href: "/destinations" },
    { name: "Packages & Tours", href: "/tours" },
    { name: "Gallery", href: "/gallery" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-300 border-b border-transparent",
        scrolled || location !== "/"
          ? "bg-background/95 backdrop-blur-md border-border/40 py-2 shadow-sm"
          : "bg-transparent py-4 text-white"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-accent/20 group-hover:border-accent transition-colors">
              <img 
                src={logoImage} 
                alt="Japhazel Safaris Logo" 
                className="h-full w-full object-cover scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold tracking-tight leading-none">
                Japhazel
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-accent font-medium">
                Safari
              </span>
            </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors cursor-pointer",
                location === link.href ? "text-accent" : ""
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="hover:bg-accent/10 hover:text-accent">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/booking">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-serif rounded-none px-6">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b border-border p-4 flex flex-col gap-4 lg:hidden animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-lg font-serif font-medium py-2 border-b border-border/40 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
                {link.name}
            </Link>
          ))}
          <Link href="/booking">
            <Button className="w-full bg-primary text-primary-foreground mt-4">Book Now</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
