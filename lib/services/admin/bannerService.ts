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
    metadata: {
      kind: "PROMOTION_BANNER",
      type: data.type,
      title: data.title,
      isActive: data.isActive,
      startAt: data.startAt,
      endAt: data.endAt,
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

  await updateBannerDB(data.id, data);

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "BANNER",
    entityId: data.id,
    metadata: {
      kind: "PROMOTION_BANNER",
      type: data.type,
      title: data.title,
      isActive: data.isActive,
      startAt: data.startAt,
      endAt: data.endAt,
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
    metadata: {
      kind: "PROMOTION_BANNER",
      field: "isActive",
      from: banner.isActive,
      to: nextValue,
      title: banner.title,
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
    metadata: {
      kind: "PROMOTION_BANNER",
      title: banner?.title ?? null,
      wasActive: banner?.isActive ?? null,
      type: banner?.type ?? null,
    },
  });
}