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
      <div className="rounded-3xl border border-[var(--border-soft)] bg-white/80 p-10 shadow-lg">
        <p className="text-lg font-semibold text-foreground">
          Travel inspiration is on the way
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
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
    <div className="relative overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-white/80 shadow-2xl shadow-[var(--accent)]/10 ring-1 ring-white/60 backdrop-blur pb-5">
      <div className="relative h-[620px] sm:h-[580px] md:h-[540px]">
        {slides.map((post, index) => (
          <article
            key={post.id}
            className={`absolute inset-0 grid h-full items-stretch gap-6 pb-24 sm:pb-20 transition-all duration-700 ease-out ${index === activeIndex
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
              }`}
            aria-hidden={index !== activeIndex}
          >
            <div className="grid h-full gap-6 md:grid-cols-2">
              <div className="flex min-h-full flex-col gap-4 px-6 py-8 sm:px-10 sm:py-12">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--accent)]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                  Latest stories
                  {post.dateLabel && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                      <span className="text-xs font-medium text-[var(--muted)]">
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
                  <h2 className="font-[var(--font-heading)] text-3xl leading-tight text-foreground transition-colors duration-200 group-hover:text-[var(--accent)] sm:text-4xl">
                    {post.title}
                  </h2>
                </a>

                <p
                  className="max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.summary}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-1 mb-10 sm:mb-12">
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] hover:text-white"
                    style={{ color: "#fff" }}
                  >
                    Read more
                    <span aria-hidden className="text-base">
                      &rarr;
                    </span>
                  </a>

                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-4 overflow-hidden rounded-2xl   ">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.imageAlt || post.title}
                      fill
                      className="object-scale-down"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                      quality={100}
                      priority

                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] text-xl font-bold uppercase tracking-[0.25em] text-white">
                      Travel
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {hasMultipleSlides && (
        <div className="absolute bottom-5 left-0 right-0 flex items-center justify-between px-6 sm:bottom-7 sm:px-8">
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goTo(index)}
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
              onClick={togglePause}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${isPaused
                ? "border-[var(--border-soft)] bg-white text-[var(--accent)] shadow-sm hover:-translate-y-0.5 hover:border-transparent hover:bg-[var(--accent)]/10"
                : "border-[var(--border-soft)] bg-white/90 text-[var(--muted)] shadow-sm hover:-translate-y-0.5 hover:border-transparent hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
                }`}
              aria-pressed={isPaused}
              aria-label={isPaused ? "Play slides" : "Pause slides"}
            >
              {isPaused ? "▶" : "❚❚"}
            </button>
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
