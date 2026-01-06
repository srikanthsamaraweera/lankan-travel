export const metadata = {
  title: "Contact Us | Lankan Travel",
  description:
    "Get in touch with Lankan Travel. Ask about itineraries, visas, or partnership opportunities.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="mb-10 space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Contact
          </p>
          <h1 className="font-[var(--font-heading)] text-4xl leading-tight text-foreground sm:text-5xl">
            Let&apos;s plan your Sri Lanka journey
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--muted)]">
            Drop us a line with your travel questions—visas, routes, stays, or partnerships. We reply
            within 1-2 business days.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-white/95 shadow-lg shadow-black/5">
          <div className="border-b border-[var(--border-soft)]  px-6 py-5 lg:px-10">
            <h2 className="font-[var(--font-heading)] text-2xl text-foreground">Send us a message</h2>
            <p className="text-sm text-[var(--muted)]">
              We use Formspree to securely collect your message.
            </p>
          </div>
          <form
            action="https://formspree.io/f/mwvpdgnk"
            method="POST"
            className="grid gap-6 px-6 py-8 lg:px-10"
          >
            <label className="space-y-2 text-sm font-semibold text-foreground">
              <span>Your email</span>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-2xl border border-[var(--border-soft)] bg-white px-4 py-3 text-[var(--foreground)] shadow-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30"
              />
            </label>

            <label className="space-y-2 text-sm font-semibold text-foreground">
              <span>Your message</span>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full rounded-2xl border border-[var(--border-soft)] bg-white px-4 py-3 text-[var(--foreground)] shadow-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30"
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[var(--muted)]">
                By sending, you agree we may respond to your email about travel.lankan.org inquiries.
              </p>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
              >
                Send message
                <span aria-hidden className="text-base">&rarr;</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
