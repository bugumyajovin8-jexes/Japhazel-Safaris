import { motion } from "framer-motion";
import SmartImage from "@/components/ui/SmartImage";
import { EXPERIENCES } from "@/lib/media";

/**
 * Alternating full-bleed feature rows — the "magazine spread" part of the page.
 * On phones the image always sits above the copy so the reading order is sane.
 */
export default function Experiences() {
  return (
    <section className="bg-secondary/40 py-20 sm:py-24">
      <div className="container mx-auto px-5 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="rule-accent rule-accent-center text-[0.7rem] font-bold uppercase tracking-eyebrow text-accent">
            Signature moments
          </h2>
          <h3 className="mt-5 font-serif font-bold text-primary text-display-sm">
            The days you will still be describing years later
          </h3>
        </div>

        <div className="space-y-16 sm:space-y-24">
          {EXPERIENCES.map((exp, i) => {
            const flipped = i % 2 === 1;
            return (
              <motion.article
                key={exp.slug}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14"
              >
                <div
                  className={`relative lg:col-span-7 ${
                    flipped ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <SmartImage
                    src={exp.wide}
                    alt={exp.alt}
                    tint={exp.tint}
                    wrapperClassName="aspect-[4/3] w-full shadow-2xl sm:aspect-[16/10]"
                    className="transition-transform duration-[1400ms] hover:scale-[1.04]"
                  />
                  {/* Corner brackets echo the brand's sharp-edged styling. */}
                  <span
                    className={`absolute -top-3 h-16 w-16 border-l-2 border-t-2 border-accent hidden md:block ${
                      flipped ? "-right-3 rotate-90" : "-left-3"
                    }`}
                  />
                  <span className="absolute bottom-4 left-4 bg-black/65 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-white backdrop-blur-sm">
                    {exp.place}
                  </span>
                </div>

                <div
                  className={`lg:col-span-5 ${flipped ? "lg:order-1" : "lg:order-2"}`}
                >
                  <p className="font-serif text-5xl font-bold text-accent/25 sm:text-6xl">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h4 className="mt-2 font-serif text-3xl font-bold leading-tight text-primary sm:text-4xl">
                    {exp.title}
                  </h4>
                  <p className="mt-5 leading-relaxed text-muted-foreground">{exp.body}</p>
                  <ul className="mt-6 space-y-2.5">
                    {exp.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm text-primary">
                        <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
