import {
  createBlogDB,
  updateBlogDB,
  deleteBlogDB,
  getBlogById,
} from "@/lib/db/blog";

import { auditWithContext } from "@/lib/observability/auditWithContext";
import { deleteFromR2, getR2KeyFromPublicUrl } from "@/lib/storage/r2/delete";

/* ========================================================= */
/* TYPES */
/* ========================================================= */

export type BlogInput = {
  id?: string;

  title: string;
  slug: string;

  description?: string | null;
  content?: string | null;

  thumbnailUrl?: string | null;

  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;

  author: string;
  category?: string | null;

  tags: string[];

  published: boolean;
};

/* ========================================================= */
/* CREATE */
/* ========================================================= */

export async function createBlogService(
  data: BlogInput,
  adminId: string
) {
  const blog = await createBlogDB({
    ...data,
    publishedAt: data.published ? new Date() : null,
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_CREATE",
    entityType: "BLOG",
    entityId: blog.id,
    metadata: {
      title: data.title,
      slug: data.slug,
      published: data.published,
    },
  });

  return blog.id;
}

/* ========================================================= */
/* UPDATE */
/* ========================================================= */

export async function updateBlogService(
  data: BlogInput,
  adminId: string
) {
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

/* ========================================================= */
/* DELETE */
/* ========================================================= */

export async function deleteBlogService(
  id: string,
  adminId: string
) {
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

/* ========================================================= */
/* TOGGLE */
/* ========================================================= */

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