import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { DESTINATIONS } from "@/lib/media";

/**
 * Editorial destination grid: one hero-sized tile followed by a mosaic.
 * Collapses to a single column on phones so every photo still reads large.
 */
export default function Destinations() {
  const [lead, ...rest] = DESTINATIONS;

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="container mx-auto px-5 md:px-6">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="rule-accent text-[0.7rem] font-bold uppercase tracking-eyebrow text-accent">
              Where we go
            </h2>
            <h3 className="mt-5 font-serif font-bold text-primary text-display-sm">
              Six landscapes, one continent
            </h3>
          </div>
          <p className="max-w-md text-muted-foreground">
            From the migration plains of the Serengeti to the reefs off Zanzibar — every
            itinerary is stitched together from the places we know personally.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
          {lead && (
            <DestinationTile
              destination={lead}
              index={0}
              className="lg:col-span-2 lg:row-span-2"
              heightClass="h-[300px] sm:h-[420px] lg:h-full lg:min-h-[560px]"
              big
            />
          )}
          {rest.slice(0, 2).map((d, i) => (
            <DestinationTile
              key={d.slug}
              destination={d}
              index={i + 1}
              heightClass="h-[220px] sm:h-[280px] lg:h-full lg:min-h-[272px]"
            />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(2).map((d, i) => (
            <DestinationTile
              key={d.slug}
              destination={d}
              index={i + 3}
              heightClass="h-[220px] sm:h-[260px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DestinationTile({
  destination,
  index,
  className = "",
  heightClass,
  big = false,
}: {
  destination: (typeof DESTINATIONS)[number];
  index: number;
  className?: string;
  heightClass: string;
  big?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: Math.min(index, 4) * 0.07 }}
      className={className}
    >
      <Link
        href={destination.href}
        className="group relative block h-full overflow-hidden"
      >
        <SmartImage
          src={big ? destination.wide : destination.src}
          alt={destination.alt}
          tint={destination.tint}
          priority={big}
          wrapperClassName={`w-full ${heightClass}`}
          className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
        />

        <div className="pointer-events-none absolute inset-0 scrim-card" />

        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
          <p className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-accent">
            {destination.country}
          </p>
          <h4
            className={`mt-1.5 font-serif font-bold text-shadow-soft ${
              big ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
            }`}
          >
            {destination.name}
          </h4>
          <p
            className={`mt-2 max-w-md text-sm text-white/80 ${
              big ? "" : "hidden sm:block"
            }`}
          >
            {destination.blurb}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-widest text-white/0 transition-colors duration-300 group-hover:text-accent">
            View trips <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* Gold hairline that draws in on hover. */}
        <span className="pointer-events-none absolute inset-0 border-2 border-accent/0 transition-colors duration-500 group-hover:border-accent/70" />
      </Link>
    </motion.div>
  );
}
