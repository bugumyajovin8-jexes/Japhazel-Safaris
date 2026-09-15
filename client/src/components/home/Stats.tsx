import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 15, suffix: "+", label: "Years guiding Africa" },
  { value: 2400, suffix: "+", label: "Guests hosted" },
  { value: 32, suffix: "", label: "Parks & reserves" },
  { value: 98, suffix: "%", label: "Would travel again" },
];

/** Counts from 0 to `to` once the band scrolls into view. */
function useCountUp(to: number, run: boolean) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    const start = performance.now();
    const dur = 1600;
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      // ease-out cubic so the number settles rather than stopping dead
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, run]);

  return n;
}

function Stat({ value, suffix, label, run }: (typeof STATS)[number] & { run: boolean }) {
  const n = useCountUp(value, run);
  return (
    <div className="text-center">
      <p className="font-serif text-4xl font-bold text-accent sm:text-5xl lg:text-6xl">
        {n.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-white/70 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-primary py-14 text-white sm:py-16">
      <div className="container mx-auto grid grid-cols-2 gap-x-6 gap-y-10 px-5 md:grid-cols-4 md:px-6">
        {STATS.map((s) => (
          <Stat key={s.label} {...s} run={seen} />
        ))}
      </div>
    </section>
  );
}
