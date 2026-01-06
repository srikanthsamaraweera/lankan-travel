"use client";

import { useEffect, useState } from "react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 320);
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-3 py-3 text-sm font-semibold text-white shadow-xl shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] focus:outline-none focus:ring-2 focus:ring-white/60 sm:px-4 sm:py-3"
      aria-label="Back to top"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-base leading-none sm:h-9 sm:w-9 sm:text-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </span>
      <span className="hidden pr-1 sm:inline">Back to top</span>
    </button>
  );
}
