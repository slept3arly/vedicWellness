import { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";

import { getPublicBlogsService } from "@/lib/services/blogService";
import { getAllPublishedProductSlugsService } from "@/lib/services/productService";

export const dynamic = "force-static";

const BLOG_TAG = "blogs";
const PRODUCT_TAG = "products";

const getCachedSitemapData = unstable_cache(
  async () => {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://vedic-wellness.vercel.app";

    const now = new Date();

    const blogs = await getPublicBlogsService();
    const products = await getAllPublishedProductSlugsService();

    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.5,
      },
      {
        url: `${baseUrl}/terms-conditions`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.5,
      },
      {
        url: `${baseUrl}/login`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${baseUrl}/signup`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blogs`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: b.updatedAt ?? now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt ?? now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...blogRoutes, ...productRoutes];
  },
  ["sitemap"],
  {
    tags: [BLOG_TAG, PRODUCT_TAG],
  }
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getCachedSitemapData();
}