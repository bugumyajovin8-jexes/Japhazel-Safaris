import heroImage from "@assets/generated_images/hero_image_of_african_landscape_with_elephants_at_sunset.png";
import lionImage from "@assets/generated_images/close_up_of_a_lion.png";
import lodgeImage from "@assets/generated_images/luxury_safari_lodge_interior.png";
import migrationImage from "@assets/generated_images/zebras_migrating.png";

// Re-export Tour type from shared schema for consistency
export type { Tour } from "@shared/schema";

export const testimonials = [
  {
    id: 1,
    name: "Sarah & James Jenkins",
    location: "United Kingdom",
    text: "Japhazel Safaris curated the most magical honeymoon for us. Every detail was perfect, from the lodges to the guides.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Singapore",
    text: "I've been on many safaris, but this was on another level. The exclusivity and attention to detail were unmatched.",
    rating: 5,
  },
  {
    id: 3,
    name: "Olivia Martinez",
    location: "Spain",
    text: "The wildlife, the landscapes, the service – everything exceeded expectations. Truly a once-in-a-lifetime experience.",
    rating: 5,
  },
];
