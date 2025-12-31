"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const SLIDE_INTERVAL_MS = 6500;

type AboutSliderProps = {
  images: string[];
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1528214096798-37891f23454c?auto=format&fit=crop&w=1400&q=80",
];

export default function AboutSlider({ images }: AboutSliderProps) {
  const slideImages = useMemo(
    () => (images?.length ? images : fallbackImages),
    [images],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = slideImages.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const handlePrev = () =>
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % totalSlides);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-white/90 shadow-xl shadow-[var(--accent)]/10 backdrop-blur">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent)]/6 via-white to-white"
        aria-hidden
      />

      <div className="relative h-[480px] sm:h-[500px] md:h-[460px]">
        <div className="grid h-full gap-6 md:grid-cols-2">
          <div className="relative">
            <div className="absolute inset-4 overflow-hidden rounded-2xl bg-black/5 shadow-lg shadow-black/10">
              {slideImages.map((image, index) => (
                <div
                  key={image + index.toString()}
                  className={`absolute inset-0 transition-opacity duration-700 ease-out ${index === activeIndex
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                    }`}
                  aria-hidden={index !== activeIndex}
                >
                  <Image
                    src={image}
                    alt="About slider"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    priority
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"
                    aria-hidden
                  />
                </div>
              ))}

            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 px-6 py-8 sm:px-10 sm:py-12">


            <h2 className="font-[var(--font-heading)] text-3xl leading-tight text-foreground sm:text-4xl">
              About Srilankan.vacations
            </h2>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Coastlines - Hill Country - Culture - Journeys
            </p>
            <p className="max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
              A Travel Discovery Platform for Exploring Sri Lanka
            </p>
          </div>
        </div>
      </div>

      {totalSlides > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-6 sm:px-8">
          <div className="flex gap-2">
            {slideImages.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-200 ${activeIndex === index
                    ? "w-7 bg-[var(--accent)] shadow-sm shadow-[var(--accent)]/30"
                    : "w-2.5 bg-[var(--muted)]/30 hover:bg-[var(--muted)]/50"
                  }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-soft)] bg-white/90 text-[var(--muted)] shadow-sm transition hover:-translate-y-0.5 hover:border-transparent hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
              aria-label="Previous slide"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--accent)] text-white shadow-sm shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
              aria-label="Next slide"
            >
              &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
