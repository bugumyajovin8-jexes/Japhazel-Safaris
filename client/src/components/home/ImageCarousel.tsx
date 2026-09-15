import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { galleryApi } from "@/lib/api";
import SmartImage from "@/components/ui/SmartImage";
import { GALLERY, type Photo } from "@/lib/media";

/**
 * "Life on Safari" rail. Prefers gallery rows the client has uploaded through
 * the admin, and falls back to the bundled library so the section is never
 * empty — including on a fresh install with no database behind it.
 */
export default function ImageCarousel() {
  const { data: dbGallery = [], isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: galleryApi.getAll,
  });

  const slides: Photo[] = useMemo(() => {
    const fromDb: Photo[] = dbGallery.map((item, i) => ({
      slug: `db-${item.id ?? i}`,
      src: item.url,
      wide: item.url,
      thumb: item.url,
      alt: item.caption || "Safari photograph",
      caption: item.caption || "",
      category: item.category || "general",
      tint: "hsl(120 12% 18%)",
      ratio: 1.5,
    }));
    const seen = new Set(fromDb.map((p) => p.src));
    return [...fromDb, ...GALLERY.filter((p) => !seen.has(p.src))].slice(0, 18);
  }, [dbGallery]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 3800, stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (isLoading || slides.length === 0) return null;

  return (
    <section className="overflow-hidden bg-background py-20 sm:py-24">
      <div className="container mx-auto mb-10 flex flex-col gap-5 px-5 md:px-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="rule-accent text-[0.7rem] font-bold uppercase tracking-eyebrow text-accent">
            Gallery
          </h2>
          <h3 className="mt-5 font-serif font-bold text-primary text-display-sm">
            Life on safari
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/gallery">
            <Button
              variant="link"
              className="hidden p-0 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent sm:inline-flex"
            >
              See all photos <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              aria-label="Previous photos"
              className="rounded-full border-primary/20 hover:bg-primary hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              aria-label="Next photos"
              className="rounded-full border-primary/20 hover:bg-primary hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pl-5 md:pl-6">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {slides.map((item, index) => (
              <figure
                key={item.slug + index}
                className="group relative min-w-0 flex-[0_0_82%] cursor-pointer sm:flex-[0_0_52%] lg:flex-[0_0_31%]"
              >
                <SmartImage
                  src={item.src}
                  alt={item.alt}
                  tint={item.tint}
                  wrapperClassName="aspect-[4/3] w-full"
                  className="transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 scrim-card opacity-90" />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="mb-1 block text-[0.62rem] font-bold uppercase tracking-eyebrow text-accent">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                  {item.caption && (
                    <h4 className="font-serif text-lg font-bold text-white text-shadow-soft sm:text-xl">
                      {item.caption}
                    </h4>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8 px-5 sm:hidden">
        <Link href="/gallery">
          <Button
            variant="outline"
            className="w-full rounded-none border-primary text-primary hover:bg-primary hover:text-white"
          >
            See all photos
          </Button>
        </Link>
      </div>
    </section>
  );
}
