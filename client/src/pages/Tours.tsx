import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TourCard from "@/components/tours/TourCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import heroVideo from "@assets/generated_videos/victoria_falls_waterfall_aerial.mp4";
import { useQuery } from "@tanstack/react-query";
import { toursApi } from "@/lib/api";

export default function Tours() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([6000]);
  
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
      
      {/* Page Header with Video */}
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
          <h1 className="text-5xl font-serif font-bold mb-4">Our Packages</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">Choose from our handpicked selection of luxury safaris and adventures.</p>
        </div>
      </div>

      <main className="flex-grow py-16 container mx-auto px-4 md:px-6">
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
                    defaultValue={[6000]} 
                    max={7000} 
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
                    setPriceRange([6000]);
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
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
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
