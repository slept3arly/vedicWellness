import {
  getPublicBlogsDB,
  getPublicBlogBySlugDB,
  getRelatedBlogsDB,
  getAllPublishedBlogSlugs,
} from "@/lib/db/blog";

import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/constants";
import { normalizePagination } from "@/lib/db/pagination";

/* ========================================================= */
/* STATIC PARAMS */
/* ========================================================= */

export async function getAllPublishedBlogSlugsService() {
  return getAllPublishedBlogSlugs();
}

/* ========================================================= */
/* BLOG LIST */
/* ========================================================= */

export const getPublicBlogsService = (page = 1) => {
  const normalizedPage = normalizePagination(page, 15, 15).page;

  return unstable_cache(
    async () => getPublicBlogsDB(normalizedPage, 15),
    ["public-blogs", String(normalizedPage)],
    {
      tags: [CACHE_TAGS.BLOGS, CACHE_TAGS.GLOBAL],
      revalidate: false,
    }
  )();
};

/* ========================================================= */
/* BLOG BY SLUG */
/* ========================================================= */

export const getPublicBlogBySlugService = (slug: string) =>
  unstable_cache(
    async () => {
      return getPublicBlogBySlugDB(slug);
    },
    [`blog-${slug}`],
    {
      tags: [`blog:${slug}`, CACHE_TAGS.BLOGS, CACHE_TAGS.GLOBAL],
      revalidate: false,
    }
  )();

/* ========================================================= */
/* RELATED BLOGS */
/* ========================================================= */

export const getRelatedBlogsService = (
  slug: string,
  tags: string[]
) =>
  unstable_cache(
    async () => {
      return getRelatedBlogsDB(slug, tags);
    },
    [`related-${slug}-${[...tags].sort().join("-")}`],
    {
      tags: [`blog:${slug}`, CACHE_TAGS.BLOGS, CACHE_TAGS.GLOBAL],
      revalidate: false,
    }
  )();
