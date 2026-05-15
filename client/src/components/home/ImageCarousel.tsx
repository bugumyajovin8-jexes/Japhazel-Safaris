import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { galleryApi } from "@/lib/api";

export default function ImageCarousel() {
  const { data: gallery = [], isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: galleryApi.getAll,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (isLoading) return null;
  if (gallery.length === 0) return null;

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-2">Gallery</h2>
          <h3 className="text-4xl font-serif font-bold text-primary">Life on Safari</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={scrollPrev} className="rounded-full border-primary/20 hover:bg-primary hover:text-white">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollNext} className="rounded-full border-primary/20 hover:bg-primary hover:text-white">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="pl-4 md:pl-6">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {gallery.map((item, index) => (
              <div className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 relative group cursor-pointer" key={item.id || index}>
                <div className="aspect-[4/3] overflow-hidden rounded-sm">
                  <img
                    src={item.url}
                    alt={item.caption || "Safari memory"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider mb-1 block">
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                    {item.caption && <h4 className="text-xl font-serif font-bold text-white">{item.caption}</h4>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
