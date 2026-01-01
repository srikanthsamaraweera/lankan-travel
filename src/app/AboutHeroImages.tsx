"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type AboutHeroImagesProps = {
  images: string[];
};

const SLIDE_INTERVAL_MS = 6000;

export default function AboutHeroImages({ images }: AboutHeroImagesProps) {
  const slideImages = useMemo(
    () =>
      images?.length
        ? images
        : [
            "/aboutslider/elephant_babies.jpg",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
          ],
    [images],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [slideImages.length]);

  useEffect(() => {
    if (slideImages.length <= 1) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideImages.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [slideImages.length]);

  const goTo = (index: number) => setActiveIndex(index);
  const handlePrev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + slideImages.length) % slideImages.length,
    );
  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % slideImages.length);

  return (
    <div className="relative h-72 overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl shadow-black/30 sm:h-80 md:h-96 lg:h-[420px]">
      {slideImages.map((image, index) => (
        <div
          key={image + index.toString()}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            index === activeIndex
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-hidden={index !== activeIndex}
        >
          <Image
            src={image}
            alt="Sri Lanka travel"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 520px"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
            aria-hidden
          />
        </div>
      ))}

      {slideImages.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-4 sm:px-5">
          <div className="flex gap-2">
            {slideImages.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition-all duration-200 ${
                  activeIndex === index
                    ? "w-7 bg-[var(--accent)] shadow-sm shadow-[var(--accent)]/30"
                    : "w-2.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/70 text-[#040E27] shadow-sm transition hover:-translate-y-0.5 hover:border-white/50 hover:bg-white"
              aria-label="Previous image"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-[var(--accent)] text-white shadow-sm shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
              aria-label="Next image"
            >
              &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
