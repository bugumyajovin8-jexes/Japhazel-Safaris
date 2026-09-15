import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImage from "@assets/lion_1765365690581.jpeg";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Destinations", href: "/destinations" },
  { name: "Tours", href: "/tours" },
  { name: "Gallery", href: "/gallery" },
  { name: "About", href: "/about" },
  { name: "Journal", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the drawer on navigation and lock the page behind it while open.
  useEffect(() => setIsOpen(false), [location]);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = isOpen ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Transparent only over the home hero; every other page needs a solid bar.
  const solid = scrolled || location !== "/" || isOpen;

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        solid
          ? "border-border/40 bg-background/95 py-2 shadow-sm backdrop-blur-md"
          : "border-transparent bg-gradient-to-b from-black/45 to-transparent py-3 text-white",
      )}
    >
      <div className="container mx-auto flex items-center justify-between gap-4 px-5 md:px-6">
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <div
            className={cn(
              "relative overflow-hidden rounded-full border-2 border-accent/25 transition-all duration-300 group-hover:border-accent",
              solid ? "h-11 w-11" : "h-12 w-12 lg:h-14 lg:w-14",
            )}
          >
            <img
              src={logoImage}
              alt=""
              className="h-full w-full scale-110 object-cover"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg font-bold tracking-tight xl:text-xl">
              Japhazel
            </span>
            <span className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-accent">
              Safari
            </span>
          </div>
        </Link>

        {/* Desktop nav — xl only, so the 1024–1280px band uses the drawer
            instead of cramming seven links plus two buttons into the bar. */}
        <div className="hidden items-center gap-5 xl:flex 2xl:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.13em] transition-colors hover:text-accent",
                location === link.href && "text-accent",
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="tel:+255123456789"
            aria-label="Call us"
            className={cn(
              "hidden items-center gap-2 text-xs font-semibold transition-colors hover:text-accent md:flex",
              solid ? "text-primary" : "text-white",
            )}
          >
            <Phone className="h-4 w-4 text-accent" />
            <span className="hidden 2xl:inline">+255 123 456 789</span>
          </a>

          <Link href="/admin" className="hidden sm:block">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Admin"
              className="hover:bg-accent/10 hover:text-accent"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/booking">
            <Button className="rounded-none bg-primary px-4 font-serif text-sm text-primary-foreground hover:bg-primary/90 sm:px-6">
              Book Now
            </Button>
          </Link>

          <button
            className={cn(
              "-mr-1 p-2 xl:hidden",
              solid ? "text-primary" : "text-white",
            )}
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      {isOpen && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100svh-4rem)] overflow-y-auto border-b border-border bg-background shadow-xl xl:hidden">
          <div className="container mx-auto flex flex-col px-5 py-3 md:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "border-b border-border/40 py-3.5 font-serif text-lg font-medium text-primary transition-colors hover:text-accent",
                  location === link.href && "text-accent",
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <a
              href="tel:+255123456789"
              className="flex items-center gap-2.5 py-4 text-sm font-semibold text-primary"
            >
              <Phone className="h-4 w-4 text-accent" />
              +255 123 456 789
            </a>

            <Link href="/planning" onClick={() => setIsOpen(false)}>
              <Button className="mb-4 w-full rounded-none bg-accent py-6 text-base text-white hover:bg-accent/90">
                Design My Trip
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
