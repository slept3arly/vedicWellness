import {
  createBannerDB,
  updateBannerDB,
  deleteBannerDB,
  getBannerById,
  getActiveBanner,
  getAdminBanners
} from "@/lib/db/banner";

import {
  parseBannerForm,
  parseBannerId,
} from "@/lib/validators/banner";

import { unstable_cache, revalidateTag } from "next/cache";
import { auditWithContext } from "@/lib/observability/auditWithContext";

/* ========================================================= */
/* CONSTANTS */
/* ========================================================= */

const BANNER_TAG = "banner";

/* ========================================================= */
/* ADMIN SERVICES (WRITES) */
/* ========================================================= */

export async function getAdminBannersService(
  page = 1,
  limit = 20,
  q = ""
) {
  const result = await getAdminBanners(page, limit, q);

  return {
    banners: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}

export async function createBannerService(
  formData: FormData,
  adminId: string
) {
  const data = parseBannerForm(formData);

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

  /* ⭐ invalidate banner cache */
  revalidateTag(BANNER_TAG, "max");

  return banner.id;
}

export async function updateBannerService(
  formData: FormData,
  adminId: string
) {
  const data = parseBannerForm(formData);

  if (!data.id) throw new Error("Missing banner id");

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

  /* ⭐ invalidate banner cache */
  revalidateTag(BANNER_TAG, "max");
}

export async function toggleBannerService(
  id: string,
  adminId: string
) {
  const banner = await getBannerById(id);
  if (!banner) return;

  await updateBannerDB(id, { isActive: !banner.isActive });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "BANNER",
    entityId: id,
    metadata: {
      kind: "PROMOTION_BANNER",
      title: banner.title,
      field: "isActive",
      from: banner.isActive,
      to: !banner.isActive,
    },
  });

  /* ⭐ invalidate banner cache */
  revalidateTag(BANNER_TAG, "max");
}

export async function deleteBannerService(
  formData: FormData,
  adminId: string
) {
  const id = parseBannerId(formData);

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

  /* ⭐ invalidate banner cache */
  revalidateTag(BANNER_TAG, "max");
}

/* ========================================================= */
/* PUBLIC SERVICES (CACHED) */
/* ========================================================= */

/* ⭐ ACTIVE BANNER */
export const getActiveBannerService = unstable_cache(
  async () => {
    return getActiveBanner();
  },
  ["active-banner"],
  {
    tags: [BANNER_TAG],
    revalidate: 86400, // 5 minutes
  }
);