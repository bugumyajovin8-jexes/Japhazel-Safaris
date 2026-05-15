import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, MapPin, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import { toursApi } from "@/lib/api";

export default function TourDetails() {
  const [match, params] = useRoute<{ id: string }>("/tours/:id");
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();

  const tourId = params?.id ? parseInt(params.id) : null;

  const { data: tour, isLoading } = useQuery({
    queryKey: ["tour", tourId],
    queryFn: () => {
      if (!tourId) throw new Error("No tour ID");
      return toursApi.getById(tourId);
    },
    enabled: !!tourId,
  });

  if (!match) return <NotFound />;
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!tour) return <NotFound />;

  const handleBooking = () => {
    setLocation(`/booking?tourId=${tour.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[60vh] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${tour.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 text-accent uppercase tracking-widest font-bold text-sm mb-2">
              <MapPin className="h-4 w-4" /> {tour.location}
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">{tour.title}</h1>
            <div className="flex flex-wrap gap-6 text-lg">
              <span className="flex items-center gap-2"><Clock className="h-5 w-5 text-accent" /> {tour.duration}</span>
              <span className="flex items-center gap-2"><Users className="h-5 w-5 text-accent" /> Small Group</span>
              <span className="text-2xl font-bold text-accent">${tour.price} <span className="text-sm text-white font-normal">/ per person</span></span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow py-16 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-serif font-bold mb-6 text-primary">Overview</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{tour.description}</p>
            </section>

            <section>
              <h2 className="text-3xl font-serif font-bold mb-6 text-primary">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border border-border bg-card hover:bg-accent/5 transition-colors">
                    <div className="mt-1 p-1 rounded-full bg-accent/20">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-serif font-bold mb-6 text-primary">Itinerary</h2>
              <div className="space-y-4">
                {[
                  { day: 1, title: "Arrival & Welcome", description: "Meet your guide and settle into your luxury accommodation" },
                  { day: 2, title: "Morning Safari", description: "Early morning game drive to spot the Big Five" },
                  { day: 3, title: "Cultural Experience", description: "Visit local communities and learn about their traditions" },
                  { day: 4, title: "Adventure Day", description: "Hot air balloon safari and champagne breakfast" },
                  { day: 5, title: "Departure", description: "Leisurely breakfast and transfer to the airport" },
                ].map((item) => (
                  <div key={item.day} className="flex gap-4 p-6 border border-border bg-card">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                        {item.day}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 border border-border bg-card p-6 shadow-lg">
              <h3 className="font-serif font-bold text-2xl mb-6">Book This Tour</h3>
              
              <div className="space-y-6 mb-6">
                <div>
                  <label className="text-sm font-medium block mb-2">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                        data-testid="button-select-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Price per person</span>
                    <span className="font-bold">${tour.price}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4">
                    <span>Total</span>
                    <span className="text-accent">${tour.price}</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 text-lg"
                onClick={handleBooking}
                data-testid="button-book-now"
              >
                Book Now
              </Button>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Flexible cancellation policy. Reserve now, pay later.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
