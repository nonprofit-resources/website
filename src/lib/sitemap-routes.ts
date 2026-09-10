import { serviceHref, servicesSeed } from "./services-seed";
import blogPosts from "./blog-posts.generated.json";
import newsPosts from "./news-posts.generated.json";
import guidesPosts from "./guides-posts.generated.json";
import { SITE_URL } from "./utils";

export const SITEMAP_ORIGIN = SITE_URL;

/** Canonical public content routes — excludes /account /auth /staff /api. */
const STATIC_ROUTES = [
  "/",
  "/compare",
  "/submit",
  "/support",
  "/privacy",
  "/terms",
  "/attributions",
  "/brand",
  "/blog",
  "/news",
  "/guides",
  "/services",
] as const;

type PostList = { posts?: { slug?: string }[] };

function postRoutes(prefix: string, data: PostList) {
  return (data.posts ?? []).map((p) => p.slug).filter(Boolean).map((slug) => `${prefix}/${slug}`);
}

/** Indexable absolute paths (path-only). */
export function getSitemapRoutes(): string[] {
  const services = servicesSeed.map((s) => serviceHref(s));
  return [
    ...new Set([
      ...STATIC_ROUTES,
      ...postRoutes("/blog", blogPosts as PostList),
      ...postRoutes("/news", newsPosts as PostList),
      ...postRoutes("/guides", guidesPosts as PostList),
      ...services,
    ]),
  ];
}
