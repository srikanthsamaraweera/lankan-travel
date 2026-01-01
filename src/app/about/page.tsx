import path from "path";
import { promises as fs } from "fs";
import AboutSlider from "../AboutSlider";
import AboutHeroImages from "../AboutHeroImages";

export const dynamic = "force-dynamic";

async function getAboutSliderImages() {
  const dir = path.join(process.cwd(), "public", "aboutslider");
  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter(
        (entry) =>
          entry.isFile() &&
          allowed.has(path.extname(entry.name).toLowerCase()),
      )
      .map((entry) => `/aboutslider/${entry.name}`);
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const aboutImages = await getAboutSliderImages();

  return (
    <main className="min-h-screen bg-[#F7FAFD] ">
      <section className="w-full bg-[#040E27] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
          <div className="grid items-center gap-10 md:grid-cols-[7fr_3fr]">
            <div className="space-y-6 xs:w-[100%] w-[80%]" id="main-top-desc">
              <span className="inline-flex flex-wrap items-center gap-2 rounded-full bg-[var(--accent)]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm shadow-black/20">
                Srilankan.vacations by
                <br className="hidden max-[349px]:block" />
                <a
                  href="https://www.lankan.org"
                  className="text-white underline underline-offset-4 !text-white hover:text-white focus:text-white"
                >
                  Lankan.org
                </a>
              </span>
              <div className="space-y-4">
                <h1 className="font-[var(--font-heading)] xs:text-4xl text-3xl leading-tight text-white sm:text-5xl lg:text-6xl">
                  About Srilankan.vacations
                </h1>
                <p className="max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
                  A Travel Discovery Platform for Exploring Sri Lanka
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <span className="rounded-full bg-[var(--accent)]/80 px-4 py-2 font-medium text-white shadow-sm shadow-black/20">
                  Coastlines - Hill Country - Culture - Journeys
                </span>
              </div>
            </div>

            <div className="relative hidden md:block">
              <AboutHeroImages images={aboutImages} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden px-6 pb-20 pt-14 sm:pt-16 lg:px-10">
        <div className="relative mx-auto max-w-5xl space-y-10">




          <div className="space-y-6 rounded-3xl border border-[var(--border-soft)] bg-white/90 md:p-20 p-8 shadow-md shadow-[var(--accent)]/5 backdrop-blur">
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
            <p>SriLankan.travel exists to make planning a trip to Sri Lanka clearer, more inspiring, and more approachable. By highlighting destinations and experiences across the island, the platform helps travelers move from curiosity to confident planning - offering a meaningful introduction to Sri Lanka's places, culture, and travel experiences.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
