import Image from "next/image";
import PaginationClient from "./PaginationClient";
import HeroSlider from "./HeroSlider";
import BackToTopButton from "./BackToTopButton";

export const dynamic = "force-dynamic";

type WPPost = {
  id: number;
  date: string;
  link: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  _embedded?: {
    ["wp:featuredmedia"]?: Array<{
      source_url?: string;
      alt_text?: string;
      media_details?: {
        sizes?: Record<string, { source_url?: string }>;
      };
    }>;
  };
};

export type TravelPost = {
  id: number;
  title: string;
  link: string;
  summary: string;
  dateLabel: string;
  imageUrl?: string;
  imageAlt?: string;
};

type TravelFeed = {
  posts: TravelPost[];
  totalPages: number;
  pageUsed: number;
  totalPosts: number;
};

type SearchParams = { [key: string]: string | string[] | undefined };

const faqItems = [
  {
    question: "What is the best time to visit Sri Lanka?",
    answer:
      "Sri Lanka is a year-round destination, but it depends on where you go. For the South and West coasts (Galle, Mirissa, Colombo), the best time is December to March. If you are heading to the East Coast (Arugam Bay, Trincomalee), aim for May to September.",
  },
  {
    question: "Do I need a visa to enter Sri Lanka?",
    answer:
      "Yes, most travelers need an ETA (Electronic Travel Authorization). You should apply online via the official eta.gov.lk portal before you arrive. It usually takes 24-48 hours to process.",
  },
  {
    question: "How many days do I need for a Sri Lanka trip?",
    answer:
      "We recommend a minimum of 10 to 14 days. This gives you enough time to explore the Cultural Triangle (Sigiriya/Dambulla), take the scenic train to Ella, and relax on the southern beaches without rushing.",
  },
  {
    question: "Is Sri Lanka safe for tourists right now?",
    answer:
      "Yes, Sri Lanka is generally very safe for tourists. Like any destination, exercise standard precautions, but the tourist areas are welcoming and secure.",
  },
];

const POSTS_PER_PAGE = 18;
const API_ENDPOINT = "https://lankan.org/wp-json/wp/v2/posts";

async function getTravelPosts(
  page: number,
  perPage = POSTS_PER_PAGE,
): Promise<TravelFeed> {
  try {
    const safePage = Math.max(1, page);
    const response = await fetch(buildUrl(safePage, perPage), {
      // Keep server-rendered, but refresh every 15 minutes to stay current.
      cache: "no-store",
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      if (response.status === 400 && safePage > 1) {
        // If the requested page is now out of range, refetch the first page.
        return getTravelPosts(1, perPage);
      }
      throw new Error(`Failed to fetch travel posts (${response.status})`);
    }

    const totalPages = parseTotalPages(response.headers);
    const totalPosts = parseTotalPosts(response.headers);
    const boundedPage =
      totalPages > 0 ? Math.min(safePage, totalPages) : safePage;

    // If the requested page exceeds the current total page count, refetch the last page.
    if (boundedPage !== safePage) {
      return getTravelPosts(boundedPage, perPage);
    }

    const data: WPPost[] = await response.json();
    const posts = data
      .map(mapPostToCard)
      .filter((post): post is TravelPost => !!post);

    return { posts, totalPages, pageUsed: boundedPage, totalPosts };
  } catch (error) {
    console.warn("[lankan-travel] Unable to load posts", error);
    return { posts: [], totalPages: 1, pageUsed: 1, totalPosts: 0 };
  }
}

function buildUrl(page: number, perPage = POSTS_PER_PAGE) {
  return `${API_ENDPOINT}?categories=67&per_page=${perPage}&_embed=1&page=${page}`;
}

function parseTotalPages(headers: Headers) {
  return Number.parseInt(headers.get("X-WP-TotalPages") ?? "1", 10) || 1;
}

function parseTotalPosts(headers: Headers) {
  return Number.parseInt(headers.get("X-WP-Total") ?? "0", 10) || 0;
}

function mapPostToCard(post: WPPost): TravelPost | null {
  if (!post?.id || !post.link) return null;

  const title = toPlainText(post.title?.rendered ?? "").trim() || "Untitled post";
  const summary = truncateWords(
    toPlainText(post.excerpt?.rendered || post.content?.rendered || ""),
    46,
  );
  const image = extractImage(post);

  return {
    id: post.id,
    title,
    link: post.link,
    summary,
    dateLabel: formatDate(post.date),
    imageUrl: image?.url,
    imageAlt: image?.alt || title,
  };
}

function extractImage(post: WPPost) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;

  const sizes = media.media_details?.sizes ?? {};
  const preferredSize =
    sizes?.medium_large?.source_url ||
    sizes?.large?.source_url ||
    sizes?.medium?.source_url;

  return {
    url: preferredSize || media.source_url,
    alt: media.alt_text,
  };
}

function toPlainText(html: string) {
  const withoutTags = html.replace(/<[^>]+>/g, " ");
  return decodeEntities(withoutTags).replace(/\s+/g, " ").trim();
}

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) =>
      String.fromCharCode(Number.parseInt(code, 10)),
    );
}

function truncateWords(text: string, wordLimit: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= wordLimit) return text;
  return `${words.slice(0, wordLimit).join(" ")}...`;
}

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

function getCurrentPage(pageParam: string | string[] | undefined) {
  const value = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const requestedPage = getCurrentPage(resolvedSearchParams?.page);
  const showHero = requestedPage === 1;

  const emptyFeed: TravelFeed = {
    posts: [],
    totalPages: 0,
    pageUsed: 1,
    totalPosts: 0,
  };

  const [heroFeed, mainFeed] = await Promise.all([
    showHero ? getTravelPosts(1, 5) : Promise.resolve(emptyFeed),
    getTravelPosts(requestedPage),
  ]);

  const { posts: heroPosts } = heroFeed;
  const { posts, totalPages, pageUsed, totalPosts } = mainFeed;
  const activePage = Math.min(Math.max(1, pageUsed), totalPages || 1);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen !bg-[#F7FAFD]">

      {activePage == 1 && <section className="relative w-full bg-[#040E27] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
          <div className="grid items-center gap-10 md:grid-cols-[7fr_3fr]">
            <div className="space-y-6" id="main-top-desc">
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
                <h1 className="font-[var(--font-heading)] text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                  Discover the Wonder of Asia: Your Ultimate Sri Lanka Travel Guide
                </h1>
                <p className="max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
                  Welcome to travel.lankan.org, your premier resource for exploring the "Pearl of the Indian Ocean." Whether you are planning a two-week itinerary through the misty tea hills of Ella or looking for the best surf spots in Arugam Bay, our curated guide covers every corner of this tropical paradise. As a dedicated travel hub, we move beyond the headlines to bring you practical, on-the-ground advice for your 2026 adventure.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <span className="rounded-full bg-[var(--accent)]/80 px-4 py-2 font-medium text-white shadow-sm shadow-black/20">
                  {totalPosts > 0
                    ? `${totalPosts} stories available`
                    : "Travel feed"}
                </span>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative h-72 overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl shadow-black/30 sm:h-80 md:h-96 lg:h-[420px]">
                <Image
                  src="/aboutslider/elephant_babies.jpg"
                  alt="Elephant calves walking together"
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
            </div>
          </div>
        </div>
        <a
          href="#feature-hero"
          className="group absolute right-4  inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-white shadow-lg shadow-black/40 transition hover:translate-x-1 hover:border-[var(--accent)] hover:bg-[var(--accent)]/20 sm:top-1/2 sm:-translate-y-1/2 sm:flex-col sm:gap-1 sm:px-3 sm:py-3"
        >
          <span className="text-[10px] uppercase tracking-[0.28em] sm:hidden">
            Scroll
          </span>
          <span className="text-2xl leading-none scroll-teaser__arrow group-hover:text-[var(--accent)]">
            &darr;
          </span>
        </a>
      </section>}

      {activePage === 1 && (<section className="relative overflow-hidden bg-white/80 py-16 text-black">
        <div
          className="pointer-events-none absolute inset-0 "
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-20 top-10 h-48 w-48 rounded-full bg-[var(--accent)]/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                Plan with confidence
              </p>
              <h2 className="font-[var(--font-heading)] text-3xl leading-tight text-foreground sm:text-4xl">
                Sri Lanka, curated for curious travelers
              </h2>
              <p className="text-base leading-relaxed text-[var(--muted)]">
                Sri Lanka is a land of staggering diversity. From misty tea hills to coral-fringed
                beaches, we gather the intel that lets you move like a local with less guesswork and
                more memorable journeys.
              </p>
              <p className="text-base leading-relaxed text-[var(--muted)]">
                Planning a trip can be overwhelming, but we keep it simple. Browse our latest stories,
                expert reviews, and hidden gems below to start crafting your dream vacation.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#feature-hero"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold !text-white shadow-lg shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
                >
                  Browse stories
                  <span aria-hidden className="text-base">&rarr;</span>
                </a>
                <a
                  href="#main-top-desc"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/70 px-5 py-3 text-sm font-semibold text-[var(--accent)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-white"
                >
                  See why to visit
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-white/90 p-5 shadow-lg shadow-black/5 transition hover:-translate-y-1 hover:border-[var(--accent)]/40">
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-[var(--accent-strong)]/10 opacity-0 transition duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="relative flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10 text-sm font-semibold text-[var(--accent)]">
                    01
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-[var(--font-heading)] text-lg text-foreground">
                      Cultural Heritage
                    </h3>
                    <p className="text-sm leading-6 text-[var(--muted)]">
                      Explore the ancient kings&apos; land in the Cultural Triangle, from Sigiriya to
                      the sacred temples of Kandy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-white/90 p-5 shadow-lg shadow-black/5 transition hover:-translate-y-1 hover:border-[var(--accent)]/40">
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-[var(--accent-strong)]/10 opacity-0 transition duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="relative flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10 text-sm font-semibold text-[var(--accent)]">
                    02
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-[var(--font-heading)] text-lg text-foreground">
                      Pristine Beaches
                    </h3>
                    <p className="text-sm leading-6 text-[var(--muted)]">
                      Swim, surf, and unwind from Mirissa&apos;s golden south to the untouched sands of
                      the East Coast.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-white/90 p-5 shadow-lg shadow-black/5 transition hover:-translate-y-1 hover:border-[var(--accent)]/40">
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-[var(--accent-strong)]/10 opacity-0 transition duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="relative flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10 text-sm font-semibold text-[var(--accent)]">
                    03
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-[var(--font-heading)] text-lg text-foreground">
                      Wildlife Safaris
                    </h3>
                    <p className="text-sm leading-6 text-[var(--muted)]">
                      Spot leopards in Yala and witness the great elephant gathering with practical
                      timing tips.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-white/90 p-5 shadow-lg shadow-black/5 transition hover:-translate-y-1 hover:border-[var(--accent)]/40">
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-[var(--accent-strong)]/10 opacity-0 transition duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="relative flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10 text-sm font-semibold text-[var(--accent)]">
                    04
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-[var(--font-heading)] text-lg text-foreground">
                      Travel Logistics
                    </h3>
                    <p className="text-sm leading-6 text-[var(--muted)]">
                      Up-to-date guidance on visas, airport transfers, and the iconic Kandy to Ella
                      train journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>)}

      <section
        id="feature-hero"
        className={`relative isolate overflow-hidden px-6 lg:px-10 ${activePage === 1 ? "pb-16 pt-12 sm:pt-16" : "pb-0 pt-0 sm:pt-0"
          }`}
      >
        <div className="relative mx-auto max-w-6xl space-y-10">
          {showHero && <HeroSlider posts={heroPosts} />}
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 lg:px-10 pt-12">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border-soft)] bg-white/90 p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-foreground">
              Travel stories are loading
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              We couldn&apos;t reach lankan.org right now. Please refresh in a moment.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {activePage != 1 && <PaginationClient currentPage={activePage} totalPages={totalPages} />}
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group relative overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-white/95 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.imageAlt || post.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                        priority={false}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] text-lg font-semibold uppercase tracking-[0.2em] text-white">
                        Travel
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 via-black/40 to-transparent px-5 py-3 text-xs text-white">
                      <span className="font-medium">Travel</span>
                      {post.dateLabel && (
                        <span className="text-white/80">{post.dateLabel}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex h-full flex-col gap-3 p-6">
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-[var(--font-heading)] text-xl leading-7 text-foreground transition-colors hover:text-[var(--accent)]"
                    >
                      {post.title}
                    </a>
                    <p className="text-sm leading-6 text-[var(--muted)]">
                      {post.summary}
                    </p>
                    <div className="flex pt-2">
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] hover:text-white"
                        style={{ color: "#fff" }}
                      >
                        Read more
                        <span aria-hidden className="text-base">&rarr;</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <PaginationClient currentPage={activePage} totalPages={totalPages} />
          </div>
        )}
      </main>
      <section id="usefulLinks" className="bg-white/80 py-14">
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-white/95 shadow-md shadow-black/5">
            <div className="border-b border-[var(--border-soft)] bg-[#F7FAFD]/80 px-6 py-5 lg:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                Official Travel Resources
              </p>
              <h3 className="font-[var(--font-heading)] text-2xl text-foreground">
                Essential links for safe, reliable trip planning
              </h3>
              <p className="text-sm text-[var(--muted)]">
                Trusted government and tourism sites, opened in a new tab so you stay on travel.lankan.org.
              </p>
            </div>
            <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 lg:px-10 lg:py-8">
              <a
                href="https://eta.gov.lk"
                target="_blank"
                rel="noreferrer noopener"
                className="group flex flex-col gap-2 rounded-2xl border border-[var(--border-soft)] bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:shadow-lg"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  Visa / ETA
                </span>
                <span className="font-[var(--font-heading)] text-lg text-foreground">
                  Electronic Travel Authorization (eta.gov.lk)
                </span>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  The only official visa application site for Sri Lanka. Avoid third-party fees and scams.
                </p>
                <span className="text-sm font-semibold text-[var(--accent)] transition group-hover:translate-x-1">
                  Open resource &rarr;
                </span>
              </a>

              <a
                href="https://www.srilanka.travel"
                target="_blank"
                rel="noreferrer noopener"
                className="group flex flex-col gap-2 rounded-2xl border border-[var(--border-soft)] bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:shadow-lg"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  Official Tourism
                </span>
                <span className="font-[var(--font-heading)] text-lg text-foreground">
                  Sri Lanka Tourism Promotion Bureau
                </span>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  Government-run inspiration and advisories for planning routes, events, and regional highlights.
                </p>
                <span className="text-sm font-semibold text-[var(--accent)] transition group-hover:translate-x-1">
                  Open resource &rarr;
                </span>
              </a>

              <a
                href="https://www.immigration.gov.lk"
                target="_blank"
                rel="noreferrer noopener"
                className="group flex flex-col gap-2 rounded-2xl border border-[var(--border-soft)] bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:shadow-lg"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  Immigration
                </span>
                <span className="font-[var(--font-heading)] text-lg text-foreground">
                  Department of Immigration
                </span>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  Official updates on entry rules, extensions, and compliance for travelers and expats.
                </p>
                <span className="text-sm font-semibold text-[var(--accent)] transition group-hover:translate-x-1">
                  Open resource &rarr;
                </span>
              </a>

              <a
                href="https://seatreservation.railway.gov.lk"
                target="_blank"
                rel="noreferrer noopener"
                className="group flex flex-col gap-2 rounded-2xl border border-[var(--border-soft)] bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:shadow-lg"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  Transport
                </span>
                <span className="font-[var(--font-heading)] text-lg text-foreground">
                  Railway Reservations
                </span>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  Direct seat bookings on the official Sri Lanka Railways system for routes like Kandy-Ella.
                </p>
                <span className="text-sm font-semibold text-[var(--accent)] transition group-hover:translate-x-1">
                  Open resource &rarr;
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="faqSection" className="relative overflow-hidden bg-[#040E27] py-16 text-white">
        <div
          className="pointer-events-none absolute inset-0 "
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <span className="inline-flex flex-wrap items-center gap-2 rounded-full bg-[var(--accent)]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm shadow-black/20">
            FAQ / Travel Basics
          </span>
          <div className="flex flex-col gap-3">


            <h3 className="font-[var(--font-heading)] text-3xl leading-tight sm:text-4xl">
              Answers to the most asked Sri Lanka travel questions
            </h3>
            <p className="text-sm text-white/80">
              Quick guidance on timing, visas, trip length, and safety—kept concise for easy planning.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {faqItems.map((item, index) => (
              <div
                key={item.question}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-[var(--accent)]/40"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-[var(--accent)]/10 opacity-0 transition duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="relative flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-2">
                    <h4 className="font-[var(--font-heading)] text-lg leading-snug text-white">
                      {item.question}
                    </h4>
                    <p className="text-sm leading-6 text-white/80">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </section>
      <BackToTopButton />
    </div>
  );
}
