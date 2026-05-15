import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";

// Import the high-quality video assets
import waterfallVideo from "@assets/generated_videos/victoria_falls_waterfall_aerial.mp4";
import beachVideo from "@assets/generated_videos/zanzibar_beach_aerial.mp4";

// Elephant and Kilimanjaro Cinematic Video (Representing the 'Killer Video')
const ELEPHANT_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-elephants-walking-in-the-savannah-441-large.mp4";
const ELEPHANT_POSTER = "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=2000";

const defaultSlides = [
  { url: ELEPHANT_VIDEO, type: "video", label: "Amboseli Elephants", poster: ELEPHANT_POSTER },
  { url: waterfallVideo, type: "video", label: "Victoria Falls", poster: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=2000" },
  { url: beachVideo, type: "video", label: "Zanzibar Islands", poster: "https://images.unsplash.com/photo-1538964173425-93884d739596?auto=format&fit=crop&q=80&w=2000" },
];

function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  if (videoIdMatch && videoIdMatch[1]) {
    // Return embedded youtube url with autoplay, muted, looped, without controls
    return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${videoIdMatch[1]}&controls=0&showinfo=0&modestbranding=1&fs=0&iv_load_policy=3&rel=0`;
  }
  return null;
}

function determineMediaType(url: string) {
  if (getYouTubeEmbedUrl(url)) return "video";
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.match(/\.(mp4|webm|ogg|mov)$/i) || lowerUrl.includes("mixkit")) return "video";
  return "image";
}

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: settingsData } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.getAll,
  });

  const customMediaStr = settingsData?.["hero_media_urls"] ?? settingsData?.["hero_video"];
  
  let slides = defaultSlides;
  if (customMediaStr && customMediaStr.trim().length > 0) {
    const urls = customMediaStr.split(",").map(s => s.trim()).filter(Boolean);
    if (urls.length > 0) {
      slides = urls.map((url, index) => ({
        url,
        type: determineMediaType(url),
        label: `Slide ${index + 1}`,
        poster: ""
      }));
    }
  }

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 10000); // 10 seconds for a more cinematic stay on each video
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIndex] || slides[0];
  const youtubeUrl = getYouTubeEmbedUrl(currentSlide.url);

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Fallback Background Image (Prevents black flash) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${currentSlide.poster || ELEPHANT_POSTER})` }}
      />
      <div className="absolute inset-0 bg-black/20 z-0" /> {/* Dim fallback image */}

      {/* Background Slideshow */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          {youtubeUrl ? (
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <iframe
                src={youtubeUrl}
                className="w-[150vw] h-[150vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          ) : currentSlide.type === "video" ? (
            <video
              key={`video-${currentIndex}-${currentSlide.url}`}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={currentSlide.poster} 
              className="w-full h-full object-cover scale-[1.02]"
            >
              <source 
                key={`source-${currentIndex}-${currentSlide.url}`} 
                src={currentSlide.url} 
                type="video/mp4" 
              />
            </video>
          ) : (
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear" }}
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${currentSlide.url})` }}
            />
          )}
          
          <div className="absolute inset-0 bg-black/30" /> 
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />
        </motion.div>
      </AnimatePresence>

      <div className="container relative z-10 px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-lg md:text-xl font-medium uppercase tracking-[0.2em] mb-4 text-accent drop-shadow-md">
            Discover the Untamed
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
            Japhazel <br className="md:hidden" /> Safaris
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 mb-10 font-light drop-shadow-md">
            Experience the soul of Africa through bespoke luxury journeys curated for the adventurous spirit.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="bg-accent text-white hover:bg-accent/90 rounded-none px-8 py-6 text-lg shadow-lg">
                Explore Tours
              </Button>
            </Link>
            <Link href="/planning">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary rounded-none px-8 py-6 text-lg shadow-lg backdrop-blur-sm">
                Plan Your Trip
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Video Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.length > 1 && slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-accent scale-125" : "bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white z-10 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ArrowDown className="h-8 w-8 opacity-80" />
      </motion.div>
    </div>
  );
}
