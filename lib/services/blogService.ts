import {
  createBlogDB,
  updateBlogDB,
  deleteBlogDB,
  getBlogById,
} from "@/lib/db/blog";

import { unstable_cache } from "next/cache";
import { parseBlogForm } from "@/lib/validators/blog";
import { deleteFromR2, getR2KeyFromPublicUrl } from "@/lib/storage/r2/delete";
import { auditWithContext } from "@/lib/observability/auditWithContext";
import {
  getPublicBlogsDB,
  getPublicBlogBySlugDB,
  getPublicBlogMetadataDB,
  getAllPublishedBlogSlugs
} from "@/lib/db/blog";

export async function getAllPublishedBlogSlugsService() {
  return getAllPublishedBlogSlugs();
}

export async function createBlogService(formData: FormData, adminId: string) {
  const data = parseBlogForm(formData);

  const blog = await createBlogDB({
    ...data,
    publishedAt: data.published ? new Date() : null,
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_CREATE",
    entityType: "BLOG",
    entityId: blog.id,
    metadata: { title: data.title, slug: data.slug, published: data.published },
  });

  return blog.id;
}

export async function updateBlogService(formData: FormData, adminId: string) {
  const data = parseBlogForm(formData);
  if (!data.id) throw new Error("Missing blog id");

  const current = await getBlogById(data.id);

  const publishedAt =
    data.published && !current?.publishedAt
      ? new Date()
      : current?.publishedAt;

  await updateBlogDB(data.id, {
    ...data,
    publishedAt: data.published ? publishedAt : null,
  });

  if (
    current?.thumbnailUrl &&
    data.thumbnailUrl &&
    current.thumbnailUrl !== data.thumbnailUrl
  ) {
    const key = getR2KeyFromPublicUrl(current.thumbnailUrl);
    if (key) await deleteFromR2(key);
  }

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "BLOG",
    entityId: data.id,
    metadata: {
      title: data.title,
      slug: data.slug,
      published: data.published,
      thumbnailChanged: current?.thumbnailUrl !== data.thumbnailUrl,
    },
  });
}

export async function deleteBlogService(id: string, adminId: string) {
  const current = await getBlogById(id);

  await deleteBlogDB(id);

  if (current?.thumbnailUrl) {
    const key = getR2KeyFromPublicUrl(current.thumbnailUrl);
    if (key) await deleteFromR2(key);
  }

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_DELETE",
    entityType: "BLOG",
    entityId: id,
    metadata: {
      title: current?.title ?? null,
      slug: current?.slug ?? null,
      hadThumbnail: Boolean(current?.thumbnailUrl),
    },
  });
}

export async function toggleBlogPublishedService(
  id: string,
  published: boolean,
  adminId: string
) {
  await updateBlogDB(id, { published: !published });

  await auditWithContext({
    actorId: adminId,
    action: !published ? "ADMIN_PUBLISH" : "ADMIN_UNPUBLISH",
    entityType: "BLOG",
    entityId: id,
    metadata: { from: published, to: !published },
  });
}
/* ------------------------------------------------------------------ */
/* Public Services (Cached) */
/* ------------------------------------------------------------------ */

const BLOG_LIST_TAG = "blogs";

export const getPublicBlogsService = unstable_cache(
  async () => {
    return getPublicBlogsDB();
  },
  ["public-blogs"],
  {
    tags: [BLOG_LIST_TAG],
    revalidate: 60, // fallback ISR safety (1 min)
  }
);

export const getPublicBlogBySlugService = (slug: string) =>
  unstable_cache(
    async () => {
      return getPublicBlogBySlugDB(slug);
    },
    [`blog-${slug}`],
    {
      tags: [`blog:${slug}`, BLOG_LIST_TAG],
      revalidate: 60,
    }
  )();

export const getPublicBlogMetadataService = (slug: string) =>
  unstable_cache(
    async () => {
      return getPublicBlogMetadataDB(slug);
    },
    [`blog-meta-${slug}`],
    {
      tags: [`blog:${slug}`],
      revalidate: 60,
    }
  )();
