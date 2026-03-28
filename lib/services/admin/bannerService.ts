import {
  createBannerDB,
  updateBannerDB,
  deleteBannerDB,
  getBannerById,
} from "@/lib/db/banner";

import { auditWithContext } from "@/lib/observability/auditWithContext";

/* ========================================================= */
/* TYPES */
/* ========================================================= */

export type BannerInput = {
  id?: string;
  type: "IMAGE_ONLY" | "TEXT";
  title?: string | null;
  message?: string | null;
  imageUrl?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  isActive: boolean;
  startAt?: Date | null;
  endAt?: Date | null;
};

/* ========================================================= */
/* CREATE */
/* ========================================================= */

export async function createBannerService(
  data: BannerInput,
  adminId: string
) {
  const banner = await createBannerDB(data);

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_CREATE",
    entityType: "BANNER",
    entityId: banner.id,
    entityLabel: `Banner: ${data.title ?? "Untitled"}`,
    metadata: {
      type: "CREATE",
      snapshot: {
        bannerType: data.type,
        title: data.title,
        isActive: data.isActive,
        startAt: data.startAt,
        endAt: data.endAt,
      },
    },
  });

  return banner.id;
}

/* ========================================================= */
/* UPDATE */
/* ========================================================= */

export async function updateBannerService(
  data: BannerInput,
  adminId: string
) {
  if (!data.id) {
    throw new Error("Missing banner id");
  }

  const before = await getBannerById(data.id);
  if (!before) throw new Error("Banner not found");

  await updateBannerDB(data.id, data);

  const changes = [];

  if (before.title !== data.title) {
    changes.push({ field: "title", from: before.title, to: data.title });
  }

  if (before.type !== data.type) {
    changes.push({ field: "type", from: before.type, to: data.type });
  }

  if (before.isActive !== data.isActive) {
    changes.push({
      field: "isActive",
      from: before.isActive,
      to: data.isActive,
    });
  }

  if (before.startAt?.toISOString() !== data.startAt?.toISOString()) {
    changes.push({
      field: "startAt",
      from: before.startAt,
      to: data.startAt,
    });
  }

  if (before.endAt?.toISOString() !== data.endAt?.toISOString()) {
    changes.push({
      field: "endAt",
      from: before.endAt,
      to: data.endAt,
    });
  }

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "BANNER",
    entityId: data.id,
    entityLabel: `Banner: ${before.title ?? "Untitled"}`,
    metadata: {
      type: "UPDATE",
      changes,
    },
  });

  return data.id;
}

/* ========================================================= */
/* TOGGLE ACTIVE */
/* ========================================================= */

export async function toggleBannerService(
  id: string,
  adminId: string
) {
  const banner = await getBannerById(id);
  if (!banner) return;

  const nextValue = !banner.isActive;

  await updateBannerDB(id, { isActive: nextValue });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "BANNER",
    entityId: id,
    entityLabel: `Banner: ${banner.title ?? "Untitled"}`,
    metadata: {
      type: "UPDATE",
      changes: [
        {
          field: "isActive",
          from: banner.isActive,
          to: nextValue,
        },
      ],
    },
  });
}

/* ========================================================= */
/* DELETE */
/* ========================================================= */

export async function deleteBannerService(
  id: string,
  adminId: string
) {
  const banner = await getBannerById(id);

  await deleteBannerDB(id);

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_DELETE",
    entityType: "BANNER",
    entityId: id,
    entityLabel: `Banner: ${banner?.title ?? "Untitled"}`,
    metadata: {
      type: "DELETE",
      snapshot: {
        title: banner?.title ?? null,
        isActive: banner?.isActive ?? null,
        type: banner?.type ?? null,
      },
    },
  });
}