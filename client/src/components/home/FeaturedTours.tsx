import { Link } from "wouter";
import TourCard from "@/components/tours/TourCard";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { toursApi } from "@/lib/api";

export default function FeaturedTours() {
  const { data: tours = [], isLoading } = useQuery({
    queryKey: ["tours"],
    queryFn: toursApi.getAll,
  });

  // Show first 4 tours
  const featuredTours = tours.slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center text-muted-foreground">Loading tours...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-2">Curated Experiences</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-primary">Signature Safaris</h3>
          </div>
          <Link href="/tours">
            <Button variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-white">
              View All Packages
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
