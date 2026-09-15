import { useEffect, useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import { galleryApi } from "@/lib/api";
import { GALLERY, GALLERY_HEADER, type Photo } from "@/lib/media";

export default function Gallery() {
  const { data: dbImages = [], isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: galleryApi.getAll,
  });

  // Rows the client uploaded lead the grid; the bundled library fills it out
  // behind them, so the page is full whether or not a database is attached.
  const photos: Photo[] = useMemo(() => {
    const fromDb: Photo[] = dbImages.map((img, i) => ({
      slug: `db-${img.id ?? i}`,
      src: img.url,
      wide: img.url,
      thumb: img.url,
      alt: img.caption || "Safari photograph",
      caption: img.caption || "",
      category: img.category || "general",
      tint: "hsl(120 12% 18%)",
      ratio: 1.5,
    }));
    const seen = new Set(fromDb.map((p) => p.src));
    return [...fromDb, ...GALLERY.filter((p) => !seen.has(p.src))];
  }, [dbImages]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    photos.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return [
      { key: "all", label: "All", count: photos.length },
      ...[...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([key, count]) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          count,
        })),
    ];
  }, [photos]);

  const [filter, setFilter] = useState("all");
  const visible = useMemo(
    () => (filter === "all" ? photos : photos.filter((p) => p.category === filter)),
    [photos, filter],
  );

  const [lightbox, setLightbox] = useState<number | null>(null);
  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (d: number) =>
      setLightbox((i) => (i === null ? i : (i + d + visible.length) % visible.length)),
    [visible.length],
  );

  // Keyboard control + scroll lock while the lightbox is open.
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, close, step]);

  const current = lightbox === null ? null : visible[lightbox];

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />

      <PageHeader
        eyebrow="Portfolio"
        title="The Gallery"
        subtitle="Moments our guests and guides captured in the wild — unretouched, unhurried."
        image={GALLERY_HEADER.wide}
        tint={GALLERY_HEADER.tint}
      />

      <main className="container mx-auto flex-grow px-5 py-14 md:px-6 sm:py-20">
        {/* Category filter rail */}
        <div className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setFilter(c.key);
                setLightbox(null);
              }}
              className={`shrink-0 border px-4 py-2 text-[0.68rem] font-bold uppercase tracking-widest transition-colors ${
                filter === c.key
                  ? "border-accent bg-accent text-white"
                  : "border-border text-muted-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {c.label}
              <span className="ml-2 opacity-60">{c.count}</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="columns-2 gap-4 lg:columns-3 masonry">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="mb-4 w-full animate-pulse bg-muted"
                style={{ height: 180 + ((i * 47) % 160) }}
              />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="py-20 text-center italic text-muted-foreground">
            No photographs in this category yet.
          </p>
        ) : (
          <div className="columns-2 gap-4 lg:columns-3 xl:columns-4 masonry">
            {visible.map((photo, i) => (
              <button
                key={photo.slug + i}
                onClick={() => setLightbox(i)}
                className="group relative block w-full overflow-hidden text-left"
                aria-label={`Open ${photo.caption || photo.alt}`}
              >
                <SmartImage
                  src={photo.src}
                  alt={photo.alt}
                  tint={photo.tint}
                  wrapperClassName="w-full"
                  style={{ aspectRatio: String(photo.ratio) }}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-[0.6rem] font-bold uppercase tracking-eyebrow text-accent">
                    {photo.category}
                  </span>
                  {photo.caption && (
                    <p className="mt-0.5 font-serif text-base font-bold text-white">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* ---------- Lightbox ---------- */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={current.caption || current.alt}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full border border-white/25 p-2.5 text-white transition-colors hover:border-accent hover:text-accent"
            >
              <X className="h-5 w-5" />
            </button>

            {visible.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous photo"
                  className="absolute left-2 z-10 rounded-full border border-white/25 p-2.5 text-white transition-colors hover:border-accent hover:text-accent sm:left-6"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next photo"
                  className="absolute right-2 z-10 rounded-full border border-white/25 p-2.5 text-white transition-colors hover:border-accent hover:text-accent sm:right-6"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <motion.figure
              key={current.slug}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-h-full w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={current.wide}
                alt={current.alt}
                className="mx-auto max-h-[78vh] w-auto max-w-full object-contain"
              />
              <figcaption className="mt-4 text-center">
                <span className="text-[0.62rem] font-bold uppercase tracking-eyebrow text-accent">
                  {current.category}
                </span>
                {current.caption && (
                  <p className="mt-1 font-serif text-xl text-white">{current.caption}</p>
                )}
                <p className="mt-1 text-xs text-white/40">
                  {(lightbox ?? 0) + 1} / {visible.length}
                </p>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
