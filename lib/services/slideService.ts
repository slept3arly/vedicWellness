import {
  createSlideDB,
  createSlidePlacementDB,
  updateSlideDB,
  updateSlidePlacementDB,
  deleteSlideDB,
  getAdminSlides,
} from "@/lib/db/slide";

import { auditWithContext } from "@/lib/observability/auditWithContext";

/* ===============================
   CREATE
================================ */
export async function createSlideService(
  formData: FormData,
  adminId: string
) {
  const imageDesktopUrl = String(formData.get("imageDesktopUrl") ?? "");
  const imageMobileUrl = String(formData.get("imageMobileUrl") ?? "");

  const placementKey = String(formData.get("placementKey") ?? "");
  const order = Number(formData.get("order") ?? 0);
  const isActive = formData.get("isActive") === "on";

  const startAtRaw = formData.get("startAt");
  const endAtRaw = formData.get("endAt");

  const startAt = startAtRaw ? new Date(String(startAtRaw)) : null;
  const endAt = endAtRaw ? new Date(String(endAtRaw)) : null;

  if (!imageDesktopUrl || !imageMobileUrl) {
    throw new Error("Both desktop and mobile images are required.");
  }

  const slide = await createSlideDB({
    imageDesktopUrl,
    imageMobileUrl,
  });

  await createSlidePlacementDB({
    slideId: slide.id,
    placementKey: placementKey as any,
    order,
    isActive,
    startAt,
    endAt,
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_CREATE",
    entityType: "SLIDE",
    entityId: slide.id,
    metadata: { placementKey, isActive },
  });

  return slide.id;
}

/* ===============================
   UPDATE
================================ */
export async function updateSlideService(
  formData: FormData,
  adminId: string
) {
  const id = String(formData.get("id") ?? "");

  const imageDesktopUrl = String(formData.get("imageDesktopUrl") ?? "");
  const imageMobileUrl = String(formData.get("imageMobileUrl") ?? "");

  const placementKey = String(formData.get("placementKey") ?? "");
  const order = Number(formData.get("order") ?? 0);
  const isActive = formData.get("isActive") === "on";

  const startAtRaw = formData.get("startAt");
  const endAtRaw = formData.get("endAt");

  const startAt = startAtRaw ? new Date(String(startAtRaw)) : null;
  const endAt = endAtRaw ? new Date(String(endAtRaw)) : null;

  await updateSlideDB(id, {
    imageDesktopUrl,
    imageMobileUrl,
  });

  await updateSlidePlacementDB(id, {
    placementKey: placementKey as any,
    order,
    isActive,
    startAt,
    endAt,
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "SLIDE",
    entityId: id,
    metadata: { placementKey, isActive },
  });
}

/* ===============================
   DELETE
================================ */
export async function deleteSlideService(
  id: string,
  adminId: string
) {
  await deleteSlideDB(id);

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_DELETE",
    entityType: "SLIDE",
    entityId: id,
  });
}

/* ===============================
   ADMIN LIST
================================ */
export async function getAdminSlidesService(
  page = 1,
  limit = 20
) {
  const result = await getAdminSlides(page, limit);

  return {
    slides: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}