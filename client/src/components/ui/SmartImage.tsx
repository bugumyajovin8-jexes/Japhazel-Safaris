import { useState } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "onLoad"> {
  src: string;
  alt: string;
  /** Average colour of the photo — painted while the file downloads so nothing flashes white. */
  tint?: string;
  /** Skip lazy-loading for above-the-fold art. */
  priority?: boolean;
  /** Extra classes for the positioned wrapper (the <img> itself fills it). */
  wrapperClassName?: string;
}

/**
 * Photography wrapper used everywhere on the marketing pages.
 * Holds a tinted box while the image streams in, then blur-reveals it, so long
 * image-heavy pages never collapse or flash as the user scrolls.
 */
export default function SmartImage({
  src,
  alt,
  tint = "hsl(120 12% 18%)",
  priority = false,
  className,
  wrapperClassName,
  ...rest
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden", wrapperClassName)}
      style={{ backgroundColor: tint }}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full object-cover",
          loaded ? "animate-img-reveal" : "opacity-0",
          className,
        )}
        {...rest}
      />
    </div>
  );
}
