"use client";

import { useEffect, useRef, useState } from "react";

type CountUpCardProps = {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
};

function CountUpCard({
  value,
  suffix = "",
  label,
  duration = 1800,
}: CountUpCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setDisplay(0);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value, duration]);

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white p-8 text-center shadow-[0_10px_30px_rgba(11,57,84,0.06)]"
    >
      <div className="text-4xl font-black tabular-nums text-[#800517] sm:text-5xl">
        {display}
        {suffix}
      </div>
      <div className="mt-2 text-zinc-600">{label}</div>
    </div>
  );
}

function StaticStatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-[0_10px_30px_rgba(11,57,84,0.06)]">
      <div className="text-4xl font-black text-[#800517] sm:text-5xl">{value}</div>
      <div className="mt-2 text-zinc-600">{label}</div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="bg-zinc-100">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-3">
        <CountUpCard value={1000} suffix="+" label="Products available" />
        <CountUpCard value={50} suffix="+" label="Specialized categories" />
        <StaticStatCard value="UAE-wide" label="Customer support" />
      </div>
    </section>
  );
}
