import { Link } from "wouter";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Destinations from "@/components/home/Destinations";
import FeaturedTours from "@/components/home/FeaturedTours";
import BigFive from "@/components/home/BigFive";
import Experiences from "@/components/home/Experiences";
import ImageCarousel from "@/components/home/ImageCarousel";
import Testimonials from "@/components/home/Testimonials";
import Stats from "@/components/home/Stats";
import SmartImage from "@/components/ui/SmartImage";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { ABOUT_TEASER, CTA_BACKDROP } from "@/lib/media";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        <Hero />

        {/* ---------- Intro / who we are ---------- */}
        <section id="discover" className="relative overflow-hidden bg-secondary/30 py-20 sm:py-24">
          <div className="container mx-auto px-5 md:px-6">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative order-2 lg:order-1"
              >
                <span className="absolute -left-4 -top-4 hidden h-24 w-24 border-l-4 border-t-4 border-accent md:block" />
                <SmartImage
                  src={ABOUT_TEASER.wide}
                  alt={ABOUT_TEASER.alt}
                  tint={ABOUT_TEASER.tint}
                  wrapperClassName="aspect-[4/3] w-full shadow-2xl sm:aspect-[4/3] lg:aspect-[3/4] lg:max-h-[560px]"
                />
                <span className="absolute -bottom-4 -right-4 hidden h-24 w-24 border-b-4 border-r-4 border-accent md:block" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="order-1 space-y-7 lg:order-2"
              >
                <div>
                  <h2 className="rule-accent text-[0.7rem] font-bold uppercase tracking-eyebrow text-accent">
                    Who we are
                  </h2>
                  <h3 className="mt-5 font-serif font-bold text-primary text-display-sm">
                    Redefining luxury travel in Africa
                  </h3>
                </div>

                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Japhazel Safaris was born from a passion for the untamed beauty of
                  Africa. We build journeys that are not vacations but turning points —
                  private vehicles, unhurried mornings, and guides who have spent their
                  lives reading this landscape.
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    "Expert local guides",
                    "Sustainable tourism",
                    "Luxury accommodation",
                    "Fully customised itineraries",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                      <span className="text-sm font-medium text-primary">{item}</span>
                    </div>
                  ))}
                </div>

                <Link href="/about">
                  <button className="border-b-2 border-accent pb-1 text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-accent">
                    Read our story
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <Destinations />

        <FeaturedTours />

        <BigFive />

        <Experiences />

        <Stats />

        <ImageCarousel />

        <Testimonials />

        {/* ---------- Closing CTA ---------- */}
        <section className="relative overflow-hidden py-24 text-center text-white sm:py-32">
          <img
            src={CTA_BACKDROP.wide}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="container relative z-10 mx-auto max-w-3xl px-5 md:px-6"
          >
            <h2 className="text-[0.7rem] font-bold uppercase tracking-eyebrow text-accent">
              Ready when you are
            </h2>
            <h3 className="mt-5 font-serif font-bold text-display-sm text-shadow-soft">
              Let&rsquo;s plan the trip you keep talking about
            </h3>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/85 sm:text-lg">
              Tell us roughly when, roughly how long, and what you most want to see. We
              will send a first-draft itinerary within two working days — no obligation.
            </p>
            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link href="/planning">
                <Button
                  size="lg"
                  className="w-full rounded-none bg-accent px-9 py-6 text-base font-semibold tracking-wide text-white shadow-xl transition-transform hover:-translate-y-0.5 hover:bg-accent/90 sm:w-auto"
                >
                  Start Planning
                </Button>
              </Link>
              <Link href="/tours">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-none border-white/70 bg-white/5 px-9 py-6 text-base font-semibold tracking-wide text-white backdrop-blur-sm transition-transform hover:-translate-y-0.5 hover:bg-white hover:text-primary sm:w-auto"
                >
                  Browse Packages
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
