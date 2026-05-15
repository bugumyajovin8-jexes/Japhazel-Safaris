import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { toursApi, bookingsApi } from "@/lib/api";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Booking() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const tourIdParam = searchParams.get("tourId");
  const tourId = tourIdParam ? parseInt(tourIdParam) : null;
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date>();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    guests: 1,
    specialRequests: "",
  });

  // Fetch the selected tour
  const { data: selectedTour, isLoading: tourLoading } = useQuery({
    queryKey: ["tour", tourId],
    queryFn: () => tourId ? toursApi.getById(tourId) : Promise.resolve(null),
    enabled: !!tourId,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      setStep(3);
      toast({
        title: "Booking Confirmed",
        description: "A confirmation email has been sent to you.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message,
      });
    },
  });

  const handleSubmitBooking = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (!tourId || !date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a tour and travel date.",
      });
      return;
    }

    createBookingMutation.mutate({
      tourId,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      numberOfGuests: formData.guests,
      travelDate: format(date, "yyyy-MM-dd"),
      specialRequests: formData.specialRequests || null,
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <div className="bg-primary py-20 text-white text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Secure Booking</h1>
        <p className="max-w-xl mx-auto opacity-80">Finalize your adventure with Japhazel Safaris.</p>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Summary */}
          <div className="md:col-span-1 space-y-6">
             <div className="bg-muted/30 p-6 border border-border">
               <h3 className="font-serif font-bold text-lg mb-4">Booking Summary</h3>
               {tourLoading ? (
                 <div className="flex items-center justify-center py-8">
                   <Loader2 className="h-6 w-6 animate-spin" />
                 </div>
               ) : selectedTour ? (
                 <div className="space-y-4">
                   <img src={selectedTour.image} alt={selectedTour.title} className="w-full h-32 object-cover rounded-sm" />
                   <div>
                     <p className="font-bold">{selectedTour.title}</p>
                     <p className="text-sm text-muted-foreground">{selectedTour.duration} • {selectedTour.location}</p>
                   </div>
                   <div className="border-t pt-4 flex justify-between font-bold text-primary">
                     <span>Total</span>
                     <span>${selectedTour.price}</span>
                   </div>
                 </div>
               ) : (
                 <p className="text-sm text-muted-foreground">No tour selected. Please go back and choose a package.</p>
               )}
             </div>
          </div>

          {/* Form Content */}
          <div className="md:col-span-2">
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                 <h2 className="text-2xl font-serif font-bold mb-6">1. Traveler Information</h2>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input 
                        required 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        data-testid="input-booking-first-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input 
                        required 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        data-testid="input-booking-last-name"
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      required 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      data-testid="input-booking-email"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input 
                      required 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      data-testid="input-booking-phone"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Guests</label>
                    <Input 
                      required 
                      type="number" 
                      min="1"
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value) || 1})}
                      data-testid="input-booking-guests"
                    />
                 </div>
                 
                 <div className="space-y-2">
                  <label className="text-sm font-medium mb-2 block">Travel Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                        data-testid="button-booking-date"
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
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Special Requests (Optional)</label>
                  <Textarea 
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                    placeholder="Any dietary requirements, accessibility needs, or special occasions..."
                    rows={3}
                    data-testid="textarea-booking-requests"
                  />
                </div>

                 <div className="space-y-3 mt-6">
                   <Button 
                     type="submit" 
                     className="w-full bg-primary text-white hover:bg-primary/90 py-6 rounded-none"
                     disabled={!selectedTour || !date}
                     data-testid="button-continue-payment"
                   >
                     Continue to Payment
                   </Button>
                   
                   <div className="relative">
                     <div className="absolute inset-0 flex items-center">
                       <span className="w-full border-t" />
                     </div>
                     <div className="relative flex justify-center text-xs uppercase">
                       <span className="bg-background px-2 text-muted-foreground">or</span>
                     </div>
                   </div>

                   <Button 
                     type="button"
                     variant="outline"
                     className="w-full py-6 rounded-none border-accent text-accent hover:bg-accent/10"
                     disabled={!selectedTour || !date || !formData.firstName || !formData.lastName || !formData.email || !formData.phone || createBookingMutation.isPending}
                     onClick={handleSubmitBooking}
                     data-testid="button-book-pay-later"
                   >
                     {createBookingMutation.isPending ? (
                       <>
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         Submitting...
                       </>
                     ) : (
                       "Book Now, Pay Later"
                     )}
                   </Button>
                   <p className="text-xs text-center text-muted-foreground">
                     Reserve your spot now and arrange payment directly with our team
                   </p>
                 </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmitBooking} className="space-y-6">
                <h2 className="text-2xl font-serif font-bold mb-6">2. Payment Details</h2>
                <div className="p-4 border border-accent/20 bg-accent/5 rounded-md mb-6">
                  <p className="text-sm text-muted-foreground">Secure payment processing via Flutterwave (Simulated)</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card Number</label>
                    <Input placeholder="0000 0000 0000 0000" data-testid="input-card-number" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expiry</label>
                      <Input placeholder="MM/YY" data-testid="input-card-expiry" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CVC</label>
                      <Input placeholder="123" data-testid="input-card-cvc" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)} 
                    className="flex-1 py-6 rounded-none"
                    data-testid="button-back"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-accent text-white hover:bg-accent/90 py-6 rounded-none"
                    disabled={createBookingMutation.isPending}
                    data-testid="button-pay-now"
                  >
                    {createBookingMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Pay Now"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-12">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-serif font-bold mb-4">Booking Successful!</h2>
                <p className="text-muted-foreground mb-8">Thank you for booking with Japhazel Safaris. We can't wait to see you.</p>
                <Button 
                  onClick={() => setLocation("/")} 
                  className="bg-primary text-white hover:bg-primary/90 px-8 rounded-none"
                  data-testid="button-return-home"
                >
                  Return Home
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
