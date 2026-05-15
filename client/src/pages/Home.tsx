import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedTours from "@/components/home/FeaturedTours";
import ImageCarousel from "@/components/home/ImageCarousel";
import { testimonials } from "@/lib/data";
import { Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import lodgeImage from "@assets/generated_images/luxury_safari_lodge_interior.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        {/* About Teaser */}
        <section className="py-24 bg-secondary/30 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-accent hidden md:block" />
                <img 
                  src={lodgeImage} 
                  alt="Luxury Lodge" 
                  className="w-full h-[500px] object-cover shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-accent hidden md:block" />
              </div>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-2">Who We Are</h2>
                  <h3 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Redefining Luxury Travel in Africa</h3>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Japhazel Safaris was born from a passion for the untamed beauty of Africa. We believe in creating journeys that are not just vacations, but transformative experiences.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Expert Local Guides",
                    "Sustainable Tourism",
                    "Luxury Accommodations",
                    "Customized Itineraries"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      <span className="font-medium text-primary">{item}</span>
                    </div>
                  ))}
                </div>
                
                <button className="text-primary font-bold border-b-2 border-accent pb-1 hover:text-accent transition-colors uppercase tracking-widest text-sm">
                  Read Our Story
                </button>
              </div>
            </div>
          </div>
        </section>

        <FeaturedTours />

        <ImageCarousel />

        {/* Testimonials */}
        <section className="py-24 bg-primary text-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-2">Testimonials</h2>
              <h3 className="text-4xl font-serif font-bold">What Our Guests Say</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white/5 p-8 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-colors">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-lg italic mb-6 text-white/90">"{testimonial.text}"</p>
                  <div>
                    <h4 className="font-bold font-serif text-xl">{testimonial.name}</h4>
                    <p className="text-sm text-accent">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-accent text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready for your Adventure?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Let us help you plan the safari of a lifetime. Book now and get exclusive seasonal offers.</p>
            <Button size="lg" variant="secondary" className="text-primary font-bold rounded-none px-10 py-6">
              Start Planning
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
