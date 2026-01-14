import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma"; // adjust

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://yourdomain.com";

  const blogs = await prisma.blog.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const products = await prisma.product.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/blogs`, lastModified: new Date() },
    { url: `${baseUrl}/products`, lastModified: new Date() },

    ...blogs.map((b) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: b.updatedAt ?? new Date(),
    })),

    ...products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: new Date(),
    })),
  ];
}
