import { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";

import { getAllPublishedProductSlugsService } from "@/lib/services/productService";
import { getAllPublishedBlogSlugsService } from "@/lib/services/public/blogService";

export const dynamic = "force-static";

const BLOG_TAG = "blogs";
const PRODUCT_TAG = "products";

const getCachedSitemapData = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://vedic-wellness.vercel.app";

    const now = new Date();

    const blogs = await getAllPublishedBlogSlugsService();
    const products = await getAllPublishedProductSlugsService();

    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/`,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        changeFrequency: "monthly",
        priority: 0.6,
      },
      {
        url: `${baseUrl}/contact`,
        changeFrequency: "monthly",
        priority: 0.6,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        changeFrequency: "yearly",
        priority: 0.5,
      },
      {
        url: `${baseUrl}/terms-conditions`,
        changeFrequency: "yearly",
        priority: 0.5,
      },
      {
        url: `${baseUrl}/login`,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${baseUrl}/signup`,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${baseUrl}/products`,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blogs`,
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