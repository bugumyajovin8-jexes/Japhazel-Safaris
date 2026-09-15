import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TourCard from "@/components/tours/TourCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { TOURS_HEADER } from "@/lib/media";
import heroVideo from "@assets/generated_videos/victoria_falls_waterfall_aerial.mp4";
import { useQuery } from "@tanstack/react-query";
import { toursApi } from "@/lib/api";

export default function Tours() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([8000]);
  
  const { data: tours = [], isLoading } = useQuery({
    queryKey: ["tours"],
    queryFn: toursApi.getAll,
  });

  const filteredTours = tours.filter(
    (tour) =>
      (tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      tour.price <= priceRange[0]
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      <PageHeader
        eyebrow="Curated experiences"
        title="Our Safari Packages"
        subtitle="Twelve routes we run ourselves — every one adjustable, none of them off a shelf."
        video={heroVideo}
        image={TOURS_HEADER.wide}
        tint={TOURS_HEADER.tint}
      />

      <main className="container mx-auto flex-grow px-5 py-14 md:px-6 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4 space-y-8">
            <div className="p-6 border border-border bg-card">
              <h3 className="font-serif font-bold text-xl mb-6">Filter Tours</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Destination or Tour..." 
                      className="pl-9 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      data-testid="input-search"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Max Price</label>
                    <span className="text-sm text-muted-foreground">${priceRange[0]}</span>
                  </div>
                  <Slider 
                    defaultValue={[8000]} 
                    max={8000} 
                    min={1000} 
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("");
                    setPriceRange([8000]);
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Tours Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredTours.length} of {tours.length} tours
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">Loading tours...</div>
            ) : filteredTours.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tours found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map((tour, i) => (
                  <TourCard key={tour.id} tour={tour} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
