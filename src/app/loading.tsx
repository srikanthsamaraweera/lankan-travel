export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-white via-[var(--background)] to-white px-6 text-center">
      <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border-soft)] bg-white/80 px-4 py-3 text-sm font-semibold text-[var(--accent)] shadow-sm">
        <span className="h-3 w-3 animate-ping rounded-full bg-[var(--accent-strong)]" />
        Fetching new travel stories...
      </div>
      <p className="max-w-md text-sm text-[var(--muted)]">
        Hang tight while we pull the latest highlights from Lankan.org.
      </p>
    </div>
  );
}
