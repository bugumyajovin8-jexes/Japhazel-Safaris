import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Play, Pause } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";
import { HERO_SLIDES, type HeroSlide } from "@/lib/media";

import waterfallVideo from "@assets/generated_videos/victoria_falls_waterfall_aerial.mp4";
import beachVideo from "@assets/generated_videos/zanzibar_beach_aerial.mp4";

/** Locally bundled footage, keyed so the media library can reference it by name. */
const LOCAL_VIDEOS: Record<string, string> = {
  "victoria-falls": waterfallVideo,
  "zanzibar-beach": beachVideo,
};

const SLIDE_MS = 7000;

function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  if (!m?.[1]) return null;
  return `https://www.youtube.com/embed/${m[1]}?autoplay=1&mute=1&loop=1&playlist=${m[1]}&controls=0&showinfo=0&modestbranding=1&fs=0&iv_load_policy=3&rel=0`;
}

function determineMediaType(url: string): "video" | "image" {
  if (getYouTubeEmbedUrl(url)) return "video";
  const u = url.toLowerCase();
  if (u.match(/\.(mp4|webm|ogg|mov)(\?|$)/) || u.includes("mixkit")) return "video";
  return "image";
}

/**
 * Phones get the still-image slides only: autoplaying several megabytes of
 * video on cellular is slow, drains battery, and iOS often refuses to start it
 * anyway. The stills carry a Ken Burns push so the section still feels alive.
 */
function useStillsOnly() {
  const [stillsOnly, setStillsOnly] = useState(true);

  useEffect(() => {
    const decide = () => {
      const narrow = window.matchMedia("(max-width: 900px)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const conn = (navigator as any).connection;
      const saveData = Boolean(conn?.saveData);
      const slowLink = ["slow-2g", "2g", "3g"].includes(conn?.effectiveType);
      setStillsOnly(narrow || coarse || reduced || saveData || slowLink);
    };
    decide();
    const mq = window.matchMedia("(max-width: 900px)");
    mq.addEventListener("change", decide);
    return () => mq.removeEventListener("change", decide);
  }, []);

  return stillsOnly;
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const stillsOnly = useStillsOnly();
  const touchStartX = useRef<number | null>(null);

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.getAll,
  });

  const slides: HeroSlide[] = useMemo(() => {
    // An admin-supplied list of URLs always wins over the curated default reel.
    const custom = settings?.["hero_media_urls"] ?? settings?.["hero_video"];
    if (custom && custom.trim()) {
      const urls = custom.split(",").map((s) => s.trim()).filter(Boolean);
      if (urls.length) {
        return urls.map((url, i) => ({
          id: `custom-${i}`,
          type: determineMediaType(url),
          src: url,
          poster: url,
          eyebrow: "Japhazel Safaris",
          title: `Slide ${i + 1}`,
          place: "",
        }));
      }
    }
    const reel = HERO_SLIDES.map((s) =>
      s.type === "video" && LOCAL_VIDEOS[s.id] ? { ...s, src: LOCAL_VIDEOS[s.id] } : s,
    );
    return stillsOnly ? reel.filter((s) => s.type === "image") : reel;
  }, [settings, stillsOnly]);

  // Keep the index valid when the slide list changes (e.g. on rotate / resize).
  useEffect(() => {
    setIndex((i) => (i >= slides.length ? 0 : i));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, paused, slides.length]);

  // Warm the next still so the crossfade never lands on an empty frame.
  useEffect(() => {
    const next = slides[(index + 1) % slides.length];
    if (next?.type === "image") {
      const img = new Image();
      img.src = next.src;
    }
  }, [index, slides]);

  const slide = slides[index] ?? slides[0];
  if (!slide) return null;
  const youtubeUrl = slide.type === "video" ? getYouTubeEmbedUrl(slide.src) : null;

  const go = (next: number) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  };

  return (
    <section
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#10140f]"
      aria-roledescription="carousel"
      aria-label="Japhazel Safaris highlights"
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 60) go(index + (dx < 0 ? 1 : -1));
        touchStartX.current = null;
      }}
    >
      {/* Tinted base so the very first paint is never a black flash. */}
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: slide.tint ?? "#10140f" }} />

      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id + index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute inset-0 -z-10 overflow-hidden"
        >
          {youtubeUrl ? (
            <iframe
              src={youtubeUrl}
              title={slide.title}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[160vh] w-[160vw] -translate-x-1/2 -translate-y-1/2"
              allow="autoplay; encrypted-media"
            />
          ) : slide.type === "video" ? (
            <video
              key={slide.src}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={slide.poster}
              style={{ objectPosition: slide.focal ?? "center" }}
              className="h-full w-full scale-[1.03] object-cover"
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          ) : (
            <img
              src={slide.src}
              alt={slide.alt ?? slide.title}
              fetchPriority={index === 0 ? "high" : "auto"}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              style={{ objectPosition: slide.focal ?? "center" }}
              className="h-full w-full origin-center object-cover animate-kenburns"
            />
          )}

          {/* Legibility scrim — keeps the headline readable over any frame. */}
          <div className="absolute inset-0 scrim-hero" />
        </motion.div>
      </AnimatePresence>

      {/* ---- Headline ----
           Deliberately plain elements with a CSS entrance rather than a motion
           component: the base style is the finished state, so the headline is
           on screen even if animations never run. This is the one block on the
           site that must never depend on JavaScript to become visible. */}
      <div className="container relative z-10 px-5 py-28 text-center text-white md:px-6">
        <p
          className="hero-rise mb-5 inline-block whitespace-nowrap bg-black/30 px-3.5 py-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.13em] text-accent backdrop-blur-sm sm:px-4 sm:text-[0.65rem] sm:tracking-eyebrow md:text-xs"
          style={{ animationDelay: "0.1s" }}
        >
          Tanzania · Kenya · Zimbabwe · South Africa
        </p>

        {/* The line break is forced at every size so the gold italic always
            lands on its own line, rather than wrapping mid-phrase on phones. */}
        <h1
          className="hero-rise mx-auto max-w-5xl text-balance font-serif font-bold text-display text-shadow-soft"
          style={{ animationDelay: "0.18s" }}
        >
          The Africa you have
          <br />
          <span className="italic text-accent">always imagined</span>
        </h1>

        <p
          className="hero-rise mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-white/90 text-shadow-soft sm:mt-8 sm:max-w-2xl md:text-xl"
          style={{ animationDelay: "0.32s" }}
        >
          Private guides, unhurried game drives and camps with nobody else in sight —
          tailor-made, from your first call to your last sundowner.
        </p>

        <div
          className="hero-rise mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4"
          style={{ animationDelay: "0.44s" }}
        >
          <Link href="/tours">
            <Button
              size="lg"
              className="w-full rounded-none bg-accent px-9 py-6 text-base font-semibold tracking-wide text-white shadow-xl transition-transform hover:-translate-y-0.5 hover:bg-accent/90 sm:w-auto"
            >
              Explore Safaris
            </Button>
          </Link>
          <Link href="/planning">
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-none border-white/70 bg-white/5 px-9 py-6 text-base font-semibold tracking-wide text-white shadow-xl backdrop-blur-sm transition-transform hover:-translate-y-0.5 hover:bg-white hover:text-primary sm:w-auto"
            >
              Design My Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* ---- Caption for the current frame (desktop) ---- */}
      <div className="pointer-events-none absolute bottom-28 left-0 z-10 hidden w-full px-6 lg:block">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`cap-${slide.id}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.5 }}
              className="max-w-xs border-l-2 border-accent pl-4 text-left text-white"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-eyebrow text-accent">
                {slide.eyebrow}
              </p>
              <p className="mt-1 font-serif text-xl font-bold text-shadow-soft">{slide.title}</p>
              {slide.place && <p className="text-sm text-white/70">{slide.place}</p>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ---- Progress indicators ---- */}
      {slides.length > 1 && (
        <div className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 sm:bottom-20">
          {slides.map((s, i) => (
            <button
              key={s.id + i}
              onClick={() => go(i)}
              aria-label={`Show ${s.title}`}
              aria-current={i === index}
              className="group h-6 w-8 sm:w-12"
            >
              <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/30 transition-colors group-hover:bg-white/60">
                {i === index && !paused && (
                  <span
                    className="absolute inset-0 origin-left bg-accent animate-slide-progress"
                    style={{ animationDuration: `${SLIDE_MS}ms` }}
                  />
                )}
                {i === index && paused && <span className="absolute inset-0 bg-accent" />}
              </span>
            </button>
          ))}

          <button
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
            className="ml-1.5 rounded-full border border-white/30 p-1.5 text-white/80 transition-colors hover:border-accent hover:text-accent"
          >
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </button>
        </div>
      )}

      {/* ---- Scroll cue ---- */}
      <motion.a
        href="#discover"
        aria-label="Scroll to content"
        className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-white/70 transition-colors hover:text-accent"
        animate={{ y: [0, 9, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      >
        <ArrowDown className="h-6 w-6" />
      </motion.a>
    </section>
  );
}
