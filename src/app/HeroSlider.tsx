"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { TravelPost } from "./page";

const SLIDE_INTERVAL_MS = 6500;

export default function HeroSlider({ posts }: { posts: TravelPost[] }) {
  const slides = useMemo(() => posts.slice(0, 5), [posts]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  if (slides.length === 0) {
    return (
      <div className="rounded-[28px] border-[3px] border-[var(--accent)] bg-[#0c0b09] p-10 shadow-[0_28px_60px_-34px_rgba(0,0,0,0.8)]">
        <p className="text-lg font-semibold text-white">
          Travel inspiration is on the way
        </p>
        <p className="mt-2 text-sm text-white/70">
          We&apos;ll showcase the freshest stories here as soon as they load.
        </p>
      </div>
    );
  }

  const hasMultipleSlides = slides.length > 1;
  const goTo = (index: number) => setActiveIndex(index);
  const handlePrev = () =>
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % slides.length);
  const togglePause = () => setIsPaused((prev) => !prev);

  return (
    <div className="relative overflow-hidden  border-[3px] border-[var(--accent)] bg-[#0c0b09] shadow-[0_32px_80px_-36px_rgba(0,0,0,0.75)]">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(246,196,0,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(246,196,0,0.08),transparent_30%),#0c0b09]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-4 rounded-[24px] border border-white/8"
        aria-hidden
      />

      <div className="relative h-[660px] sm:h-[620px] md:h-[580px]">
        {slides.map((post, index) => (
          <article
            key={post.id}
            className={`absolute inset-0 h-full w-full transition-all duration-700 ease-out ${index === activeIndex
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
              }`}
            aria-hidden={index !== activeIndex}
          >
            <div className="absolute inset-0">
              {post.imageUrl ? (
                <Image
                  src={post.imageUrl}
                  alt={post.imageAlt || post.title}
                  fill
                  className="object-cover brightness-95 [filter:contrast(1.08)_saturate(1.05)] scale-[1.01]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 1000px"
                  quality={100}
                  priority={index === 0}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#1a1207] via-[#0c0b09] to-[#1f180c] text-xl font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                  Travel
                </div>
              )}
              <div
                className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-[#0c0b09]/60"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-45"
                style={{
                  backgroundImage:
                    "linear-gradient(transparent 0, transparent 65%, rgba(0,0,0,0.08) 100%), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E%3C/svg%3E\")",
                }}
                aria-hidden
              />
              <div className="absolute right-10 top-14 hidden origin-top-right -rotate-90 transform items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--accent)] md:flex">
                <span className="h-px w-12 bg-[var(--accent)]" />
                Sri Lankan Vacations
              </div>
            </div>

            <div className="relative z-10 flex h-full flex-col  px-7 pb-32 pt-10 sm:px-10 md:px-14">
              <div className="flex items-center justify-between gap-4 text-white">
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-[var(--accent)]" />
                  <span className=" text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
                    Explorer&apos;s Journal
                  </span>
                </div>

              </div>

              <div className="space-y-5 text-white sm:space-y-6 pt-5">
                <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/75">

                  {post.dateLabel && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-white/60" />
                      <span className="text-[10px] font-medium text-white/70">
                        {post.dateLabel}
                      </span>
                    </>
                  )}
                </div>

                <a
                  href={post.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group"
                >
                  <h2 className="max-w-3xl font-[var(--font-heading)] text-3xl leading-tight text-white drop-shadow-lg transition-all duration-300 group-hover:text-[var(--accent)] sm:text-4xl md:text-5xl">
                    {post.title}
                  </h2>
                </a>



                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black shadow-[0_14px_40px_-20px_rgba(0,0,0,0.7)] hover:!text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
                  >
                    Read the story
                    <span aria-hidden className="text-base">
                      &rarr;
                    </span>
                  </a>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/70">
                    <span className="h-px w-8 bg-white/30" />
                    <span>Lankan.org</span>
                  </div>
                </div>
              </div>


            </div>
          </article>
        ))}
      </div>

      {hasMultipleSlides && (
        <div className="absolute inset-x-0 bottom-0 bg-black/65 px-6 py-5 backdrop-blur-sm sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">

              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => goTo(index)}
                    className={`h-2.5 rounded-full transition-all duration-200 ${activeIndex === index
                      ? "w-10 bg-[var(--accent)] shadow-[0_0_0_4px_rgba(0,0,0,0.25)]"
                      : "w-3 bg-white/25 hover:bg-white/45"
                      }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePause}
                className={`inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold uppercase tracking-[0.15em] transition ${isPaused
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/20 bg-white/5 text-white/80 hover:text-white"
                  }`}
                aria-pressed={isPaused}
                aria-label={isPaused ? "Play slides" : "Pause slides"}
              >
                {isPaused ? "Play" : "Pause"}
              </button>
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-white/20"
                aria-label="Previous slide"
              >
                &larr;
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent)] text-black shadow-sm shadow-[var(--accent)]/40 transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
                aria-label="Next slide"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="pointer-events-none absolute left-1/2 bottom-4 -translate-x-1/2 flex flex-col items-center gap-1 text-white/80 hero-scroll-indicator"
        aria-hidden
      >
        <span className="text-[10px] uppercase tracking-[0.28em]">Scroll</span>
        <span className="text-2xl leading-none">&darr;</span>
      </div>
    </div>
  );
}
