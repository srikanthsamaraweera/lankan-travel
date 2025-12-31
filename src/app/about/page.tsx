export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white/40">
      <section className="relative isolate overflow-hidden px-6 pb-20 pt-14 sm:pt-16 lg:px-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="absolute -right-10 bottom-4 h-64 w-64 rounded-full bg-[var(--accent-strong)]/10 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="relative mx-auto max-w-4xl space-y-10">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              About
            </span>
            <h1 className="font-[var(--font-heading)] text-4xl leading-tight text-foreground sm:text-5xl">
              About Srilankan.vacations
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              A Travel Discovery Platform for Exploring Sri Lanka
            </p>
          </div>

          <div className="space-y-6 rounded-3xl border border-[var(--border-soft)] bg-white/90 p-8 shadow-md shadow-[var(--accent)]/5 backdrop-blur">
            <p >
              SriLankan.travel is a destination discovery and travel inspiration platform created for people planning a visit to Sri Lanka. The site is designed to help travelers understand what to expect, where to go, and what experiences define the island before they arrive.
            </p>
            <p >
              From misty hill country landscapes and scenic train journeys to coastal towns, cultural landmarks, wildlife encounters, and everyday travel experiences, SriLankan.travel offers an accessible starting point for discovering Sri Lanka as a travel destination.

            </p>
            <h1 className="text-2xl">What We Do?</h1>
            <p >
              SriLankan.travel focuses on showcasing destinations, activities, and travel experiences across Sri Lanka in a clear, visually engaging, and easy-to-explore format. Rather than long-form narratives, the platform emphasizes concise destination overviews and experience highlights that support trip planning and inspiration.

            </p>
            <p>The goal is simple:
              to help travelers make informed decisions about where to visit, what to see, and how to experience Sri Lanka in a meaningful way.</p>
            <h1 className="text-2xl">Who This Site Is For</h1>
            <p >
              SriLankan.travel is built for:
            </p>
            <ul className="list-disc list-outside space-y-2 pl-5">
              <li>First-time visitors planning their Sri Lanka itinerary</li>
              <li>Returning travelers looking for new places and experiences</li>
              <li>Independent travelers seeking inspiration and clarity</li>
              <li>Anyone researching Sri Lanka as a travel destination</li>
            </ul>
            <p>Whether you're planning a short holiday or a longer journey across the island, the platform is designed to help you explore possibilities and shape your travel plans with confidence.</p>
            <h1 className="text-2xl">Our Approach to Travel Content</h1>
            <p>
              Content on SriLankan.travel is curated and structured around real travel experiences and destinations. Each section aims to provide context — what a place is like, why travelers visit, and what kind of experience to expect — rather than exhaustive guides or booking-focused content.
            </p>
            <p>
              We prioritize:
            </p>
            <ul className="list-disc list-outside space-y-2 pl-5">
              <li>Clear destination context</li>
              <li>Practical travel inspiration</li>
              <li>Visually driven exploration</li>
              <li>Easy navigation across regions and experiences</li>
            </ul>
            <p >
              This approach keeps the site useful, approachable, and relevant for modern travelers.
            </p>
            <p>
              SriLankan.travel is a travel-focused project developed as part of the broader Lankan.org ecosystem.
            </p><p>
              While Lankan.org publishes in-depth articles and stories across multiple topics, SriLankan.travel serves a more focused purpose — presenting Sri Lanka through the lens of travel discovery and destination exploration. The platform complements the broader content network by organizing travel-related insights into a format designed specifically for trip planning and inspiration.
            </p>
            <h1 className="text-2xl">
              Our Editorial Values
            </h1>
            <p>SriLankan.travel is guided by a commitment to:</p>
            <ul className="list-disc list-outside space-y-2 pl-5">
              <li>Accuracy and relevance</li>
              <li>Respect for local culture and landscapes</li>
              <li>Honest representation of travel experiences</li>
              <li>Content that supports real-world travel decisions</li>
            </ul>
            <p>
              We aim to reflect Sri Lanka as it is experienced by travelers - diverse, vibrant, and layered - while making it easier for visitors to understand and explore.
            </p>
            <h1 className="text-2xl">Our Purpose</h1>
            <p>SriLankan.travel exists to make planning a trip to Sri Lanka clearer, more inspiring, and more approachable. By highlighting destinations and experiences across the island, the platform helps travelers move from curiosity to confident planning — offering a meaningful introduction to Sri Lanka’s places, culture, and travel experiences.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
