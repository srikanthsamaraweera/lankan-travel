import Image from "next/image";
import PaginationClient from "./PaginationClient";
import HeroSlider from "./HeroSlider";

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
    showHero ? getTravelPosts(1, 3) : Promise.resolve(emptyFeed),
    getTravelPosts(requestedPage),
  ]);

  const { posts: heroPosts } = heroFeed;
  const { posts, totalPages, pageUsed, totalPosts } = mainFeed;
  const activePage = Math.min(Math.max(1, pageUsed), totalPages || 1);

  return (
    <div className="min-h-screen !bg-[#F7FAFD]">

      {activePage == 1 && <section className="w-full bg-[#040E27] text-white">
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
                  Travel Sri Lanka: Places to Visit, Experiences, and Travel Ideas
                </h1>
                <p className="max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
                  Explore destinations, activities, and travel experiences across Sri Lanka - from hill country escapes and cultural landmarks to beaches, wildlife, and scenic journeys.
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
      </section>}

      <section
        className={`relative isolate overflow-hidden px-6 lg:px-10 ${
          activePage === 1 ? "pb-16 pt-12 sm:pt-16" : "pb-0 pt-0 sm:pt-0"
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
    </div>
  );
}
