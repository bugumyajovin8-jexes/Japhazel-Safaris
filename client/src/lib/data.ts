// Re-export Tour type from shared schema for consistency
export type { Tour } from "@shared/schema";

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  trip?: string;
  text: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah & James Jenkins",
    location: "United Kingdom",
    trip: "Serengeti & Zanzibar, 12 days",
    text: "We asked for a honeymoon and got something closer to a private expedition. Joseph found us a leopard on day two and then simply switched the engine off and let us watch it for an hour.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Singapore",
    trip: "Masai Mara migration, 8 days",
    text: "This was my fourth safari and the first where I never once felt like a tourist in a queue. Our vehicle was ours. We left camp when we wanted and came back when we wanted.",
    rating: 5,
  },
  {
    id: 3,
    name: "Olivia Martinez",
    location: "Spain",
    trip: "Amboseli & Ngorongoro, 10 days",
    text: "The balloon flight over the Serengeti is the single best thing I have ever done. But what I remember most is Hazel calling to check on us the evening our flight was delayed.",
    rating: 5,
  },
];
