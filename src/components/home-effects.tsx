"use client";

import { useEffect } from "react";

export function HomeEffects() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(
      ".home-page > section:not(:first-of-type)",
    );

    const reveal = (section: HTMLElement) => {
      section.classList.remove("reveal-pending");
      section.classList.add("reveal-visible");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach((section) => reveal(section));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 10% 0px" },
    );

    sections.forEach((section) => {
      section.classList.add("reveal-pending");
      const rect = section.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.95 &&
        rect.bottom > window.innerHeight * 0.05;

      if (inView) {
        reveal(section);
      } else {
        observer.observe(section);
      }
    });

    const fallback = window.setTimeout(() => {
      sections.forEach((section) => {
        if (!section.classList.contains("reveal-visible")) {
          reveal(section);
        }
      });
    }, 2000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
