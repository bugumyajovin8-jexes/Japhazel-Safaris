import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmartImage from "@/components/ui/SmartImage";
import { BIG_FIVE } from "@/lib/media";

/**
 * Big Five showcase. Desktop gets a large stage with a thumbnail rail;
 * phones get a horizontally swipeable row of full cards instead, which is far
 * easier to use than a stage-plus-rail squeezed into 375px.
 */
export default function BigFive() {
  const [active, setActive] = useState(0);
  const animal = BIG_FIVE[active];

  return (
    <section className="relative overflow-hidden bg-[#141a13] py-20 text-white sm:py-24">
      {/* Faint texture so the dark band is not a flat slab. */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.15]" />

      <div className="container relative mx-auto px-5 md:px-6">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="rule-accent rule-accent-center text-[0.7rem] font-bold uppercase tracking-eyebrow text-accent">
            The Big Five
          </h2>
          <h3 className="mt-5 font-serif font-bold text-display-sm">
            Meet the icons of the bush
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Lion, leopard, elephant, rhino and buffalo. Our guides track all five — and
            know when to switch the engine off and simply let you watch.
          </p>
        </div>

        {/* ---------- Desktop: stage + rail ---------- */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={animal.slug}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <SmartImage
                    src={animal.wide}
                    alt={animal.alt}
                    tint={animal.tint}
                    wrapperClassName="h-[520px] w-full"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="col-span-2 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={animal.slug + "-copy"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.45 }}
                >
                  <p className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-accent">
                    {animal.latin}
                  </p>
                  <h4 className="mt-2 font-serif text-5xl font-bold">{animal.name}</h4>
                  <p className="mt-5 leading-relaxed text-white/75">{animal.blurb}</p>
                  <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-white/10 pt-6">
                    <div>
                      <dt className="text-[0.62rem] uppercase tracking-widest text-white/50">
                        Best seen in
                      </dt>
                      <dd className="mt-1 font-serif text-lg">{animal.bestIn}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.62rem] uppercase tracking-widest text-white/50">
                        Sighting odds
                      </dt>
                      <dd className="mt-1 font-serif text-lg text-accent">{animal.odds}</dd>
                    </div>
                  </dl>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex gap-3">
                {BIG_FIVE.map((a, i) => (
                  <button
                    key={a.slug}
                    onClick={() => setActive(i)}
                    aria-label={a.name}
                    aria-current={i === active}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden transition-all duration-300 ${
                      i === active
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-[#141a13]"
                        : "opacity-55 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={a.thumb}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Mobile / tablet: swipeable cards ---------- */}
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:hidden">
          {BIG_FIVE.map((a) => (
            <article
              key={a.slug}
              className="w-[78vw] max-w-sm shrink-0 snap-center sm:w-[60vw]"
            >
              <div className="relative">
                <SmartImage
                  src={a.src}
                  alt={a.alt}
                  tint={a.tint}
                  wrapperClassName="h-[300px] w-full sm:h-[360px]"
                />
                <div className="pointer-events-none absolute inset-0 scrim-card" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-eyebrow text-accent">
                    {a.latin}
                  </p>
                  <h4 className="mt-1 font-serif text-2xl font-bold text-shadow-soft">
                    {a.name}
                  </h4>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{a.blurb}</p>
              <p className="mt-3 text-xs uppercase tracking-widest text-white/45">
                Best seen in <span className="text-accent">{a.bestIn}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
