import { motion } from "framer-motion";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Full-bleed still. Ignored when `video` is supplied. */
  image?: string;
  video?: string;
  /** Average colour of the art, painted underneath so nothing flashes white. */
  tint?: string;
}

/**
 * Shared inner-page masthead. Slightly shorter than the home hero so the page's
 * own content starts above the fold on a laptop, and it uses svh units so mobile
 * browser chrome does not clip the title.
 */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  image,
  video,
  tint = "#141a13",
}: PageHeaderProps) {
  return (
    <header
      className="relative flex h-[46svh] min-h-[340px] items-center justify-center overflow-hidden text-white sm:h-[56svh]"
      style={{ backgroundColor: tint }}
    >
      {video ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={image}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      <div className="absolute inset-0 scrim-hero" />

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 px-5 pt-16 text-center md:px-6"
      >
        {eyebrow && (
          <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-eyebrow text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif font-bold text-display-sm text-shadow-soft">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/85 text-shadow-soft sm:text-lg">
            {subtitle}
          </p>
        )}
      </motion.div>
    </header>
  );
}
