import { Link } from "wouter";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SmartImage from "@/components/ui/SmartImage";
import { Tour } from "@/lib/data";

interface TourCardProps {
  tour: Tour;
  index?: number;
}

export default function TourCard({ tour, index = 0 }: TourCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.07 }}
      className="group flex h-full flex-col bg-card shadow-lg transition-shadow duration-300 hover:shadow-2xl"
    >
      <Link href={`/tours/${tour.id}`} className="relative block overflow-hidden">
        <SmartImage
          src={tour.image}
          alt={tour.title}
          wrapperClassName="h-60 w-full sm:h-64"
          className="transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-70" />

        <span className="absolute right-4 top-4 bg-white/95 px-3 py-1 text-sm font-bold text-primary shadow backdrop-blur-sm">
          ${tour.price.toLocaleString()}
          <span className="text-[0.65rem] font-medium text-muted-foreground"> /pp</span>
        </span>

        <span className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-white">
          <MapPin className="h-3 w-3 text-accent" />
          {tour.location}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-accent" />
          {tour.duration}
        </div>

        <h3 className="font-serif text-xl font-bold leading-snug transition-colors group-hover:text-accent">
          <Link href={`/tours/${tour.id}`}>{tour.title}</Link>
        </h3>

        <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {tour.description}
        </p>

        {tour.highlights?.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {tour.highlights.slice(0, 2).map((h) => (
              <li
                key={h}
                className="border border-border px-2 py-0.5 text-[0.62rem] uppercase tracking-wider text-muted-foreground"
              >
                {h}
              </li>
            ))}
          </ul>
        )}

        <Link href={`/tours/${tour.id}`} className="mt-6 block">
          <Button
            variant="outline"
            className="w-full rounded-none border-primary/20 transition-colors group-hover:border-primary hover:bg-primary hover:text-white"
          >
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.article>
  );
}
