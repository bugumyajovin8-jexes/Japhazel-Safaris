import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { testimonials } from "@/lib/data";
import { TESTIMONIAL_BACKDROP } from "@/lib/media";

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden py-20 text-white sm:py-24">
      {/* Fixed-feel photographic backdrop, heavily dimmed for contrast. */}
      <img
        src={TESTIMONIAL_BACKDROP.wide}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-primary/90" />
      <div className="absolute inset-0 bg-noise opacity-[0.12]" />

      <div className="container relative z-10 mx-auto px-5 md:px-6">
        <div className="mb-14 text-center">
          <h2 className="rule-accent rule-accent-center text-[0.7rem] font-bold uppercase tracking-eyebrow text-accent">
            Testimonials
          </h2>
          <h3 className="mt-5 font-serif font-bold text-display-sm">
            What our guests say
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="relative border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition-colors hover:border-accent/60 sm:p-8"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-accent/25" />

              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              <blockquote className="mb-6 text-base italic leading-relaxed text-white/90 sm:text-lg">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              <figcaption>
                <p className="font-serif text-lg font-bold sm:text-xl">{t.name}</p>
                <p className="text-sm text-accent">
                  {t.location}
                  {t.trip ? ` · ${t.trip}` : ""}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
