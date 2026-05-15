import { Link } from "wouter";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tour } from "@/lib/data";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-lg rounded-none bg-card hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={tour.image} 
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-sm font-bold text-primary">
          ${tour.price.toLocaleString()} / pp
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-accent" />
            {tour.duration}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-accent" />
            {tour.location}
          </div>
        </div>
        <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-accent transition-colors">
          <Link href={`/tours/${tour.id}`}>{tour.title}</Link>
        </h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {tour.description}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={`/tours/${tour.id}`} className="w-full">
          <Button variant="outline" className="w-full rounded-none border-primary/20 hover:bg-primary hover:text-white group-hover:border-primary">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
