import {
  getPublicBlogsDB,
  getPublicBlogBySlugDB,
  getRelatedBlogsDB,
  getAllPublishedBlogSlugs,
} from "@/lib/db/blog";

import { unstable_cache } from "next/cache";
import { BLOG_LIST_TAG } from "@/lib/constants";

/* ========================================================= */
/* STATIC PARAMS */
/* ========================================================= */

export async function getAllPublishedBlogSlugsService() {
  return getAllPublishedBlogSlugs();
}

/* ========================================================= */
/* BLOG LIST */
/* ========================================================= */

export const getPublicBlogsService = unstable_cache(
  async () => {
    return getPublicBlogsDB();
  },
  ["public-blogs"],
  {
    tags: [BLOG_LIST_TAG],
    revalidate: false,
  }
);

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
      tags: [`blog:${slug}`, BLOG_LIST_TAG],
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
      tags: [`blog:${slug}`, BLOG_LIST_TAG],
      revalidate: false,
    }
  )();