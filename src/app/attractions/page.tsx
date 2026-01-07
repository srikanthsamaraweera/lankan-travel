import type { Metadata } from "next";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(
  () => import("../../../public/components/InteractiveMaps"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[800px] w-full animate-pulse rounded-3xl bg-gray-100" />
    ),
  },
);

export const metadata: Metadata = {
  title: "Sri Lanka Attractions Map | Lankan Travel",
  description:
    "Explore Sri Lanka's top beaches, cultural sites, and wildlife parks on an interactive map.",
};

export default function AttractionsPage() {
  return (
    <div className="min-h-screen bg-[#F7FAFD]">
      <section className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
        <div className="mb-10 space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Attractions
          </p>
          <h1 className="font-[var(--font-heading)] text-4xl leading-tight text-foreground sm:text-5xl">
            Sri Lanka on an interactive map
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-[var(--muted)]">
            Pinpoint the cultural icons, beach towns, and wildlife parks that make Sri Lanka special.
            Use the map to plan routes and jump into guides for each highlight.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          <span className="rounded-full bg-white px-4 py-2 shadow-sm shadow-black/5">
            Beaches
          </span>
          <span className="rounded-full bg-white px-4 py-2 shadow-sm shadow-black/5">
            Culture
          </span>
          <span className="rounded-full bg-white px-4 py-2 shadow-sm shadow-black/5">
            Wildlife & parks
          </span>
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border border-[var(--border-soft)] bg-white/90 p-5 text-sm text-[var(--muted)] shadow-sm shadow-black/5 sm:grid-cols-2 sm:gap-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl p-2 bg-[var(--accent)]/10 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)] shadow-sm">
              Go
            </span>
            <p className="leading-6">
              Tap any pin then choose “Directions from Colombo Airport” to open Google Maps with the
              route prefilled from Bandaranaike International (CMB) to that spot.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl p-2 bg-[var(--accent)]/10 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)] shadow-sm">
              Zoom
            </span>
            <p className="leading-6">
              Use the + / − controls on the map to zoom into neighborhoods or out for a full-island
              overview; drag to pan to nearby highlights.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-white/95 shadow-lg shadow-black/5">
          <div className="border-b border-[var(--border-soft)] bg-[#F7FAFD]/70 px-6 py-4 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                  Interactive Map
                </p>
                <p className="text-sm text-[var(--muted)]">
                  Click pins to open quick descriptions and jump to related guides.
                </p>
              </div>
              <a
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] !text-white shadow-md shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
                href="/"
              >
                Back to stories
                <span aria-hidden className="text-sm">
                  &rarr;
                </span>
              </a>
            </div>
          </div>
          <div className="p-4 lg:p-6">
            <InteractiveMap />
          </div>
        </div>
      </section>
    </div>
  );
}
