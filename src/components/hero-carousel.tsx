"use client";

import { getMediaUrl } from "@/lib/media";
import { useEffect, useRef, useState } from "react";

const slides = [
  { src: "/uploads/2025/10/banner-2.mp4", alt: "Power Tools" },
  { src: "/uploads/2025/10/banner-5.mp4", alt: "Measuring Tools" },
  { src: "/uploads/2025/10/HANDTOOLS-V2.mp4", alt: "Hand Tools" },
  { src: "/uploads/2025/10/banner-3.mp4", alt: "Electrical Accessories" },
] as const;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, []);

  const show = (index: number) =>
    setActive((index + slides.length) % slides.length);

  return (
    <section
      aria-label="Featured product highlights"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance =
          (event.changedTouches[0]?.clientX ?? touchStart.current) -
          touchStart.current;
        if (Math.abs(distance) > 45) show(active + (distance < 0 ? 1 : -1));
        touchStart.current = null;
      }}
      className="hero-stage relative w-full overflow-hidden bg-white"
    >
      <div className="relative mx-auto aspect-[2.15/1] w-full max-w-[1920px] sm:aspect-[2.45/1] lg:aspect-[2.75/1]">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-16 bg-gradient-to-t from-black/35 to-transparent" />

        {slides.map((slide, index) => {
          const isActive = active === index;
          const mediaSrc = getMediaUrl(slide.src);
          return (
            <div
              key={slide.src}
              aria-hidden={!isActive}
              className={`absolute inset-0 flex items-start justify-center bg-white transition-opacity duration-700 ease-out ${
                isActive
                  ? "z-10 opacity-100"
                  : "pointer-events-none z-0 opacity-0"
              }`}
            >
              {isActive ? (
                <video
                  key={mediaSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={slide.alt}
                  className="h-full w-full object-contain object-top"
                >
                  <source src={mediaSrc} type="video/mp4" />
                </video>
              ) : null}
            </div>
          );
        })}

        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center gap-2.5 px-3 pb-3 sm:pb-4">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${index + 1}: ${slide.alt}`}
              onClick={() => show(index)}
              className={`h-2.5 rounded-full border border-white/80 transition-all ${
                active === index
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => show(active - 1)}
          className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-2xl text-white backdrop-blur-sm transition hover:scale-105 hover:bg-white/40 hover:text-black sm:left-4 sm:h-12 sm:w-12 sm:text-3xl"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => show(active + 1)}
          className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-2xl text-white backdrop-blur-sm transition hover:scale-105 hover:bg-white/40 hover:text-black sm:right-4 sm:h-12 sm:w-12 sm:text-3xl"
        >
          ›
        </button>
      </div>
    </section>
  );
}
