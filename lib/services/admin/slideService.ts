import {
  createSlideDB,
  replaceSlidePlacementsDB,
  updateSlideDB,
  deleteSlideDB,
  SlidePlacementInput,
} from "@/lib/db/slide";
import { auditWithContext } from "@/lib/observability/auditWithContext";

/* ===============================
   TYPES
================================ */

export type SlideInput = {
  imageDesktopUrl: string;
  imageMobileUrl: string;
  placements: SlidePlacementInput[];
};

/* ===============================
   CREATE
================================ */

export async function createSlideService(
  data: SlideInput,
  adminId: string
) {
  if (!data.imageDesktopUrl || !data.imageMobileUrl) {
    throw new Error("Both desktop and mobile images are required.");
  }

  const slide = await createSlideDB({
    imageDesktopUrl: data.imageDesktopUrl,
    imageMobileUrl: data.imageMobileUrl,
  });

  if (data.placements.length > 0) {
    await replaceSlidePlacementsDB(slide.id, data.placements);
  }

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_CREATE",
    entityType: "SLIDE",
    entityId: slide.id,
    metadata: {
      placements: data.placements.length,
    },
  });

  return slide.id;
}

/* ===============================
   UPDATE
================================ */

export async function updateSlideService(
  id: string,
  data: SlideInput,
  adminId: string
) {
  await updateSlideDB(id, {
    imageDesktopUrl: data.imageDesktopUrl,
    imageMobileUrl: data.imageMobileUrl,
  });

  await replaceSlidePlacementsDB(id, data.placements);

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "SLIDE",
    entityId: id,
    metadata: {
      placements: data.placements.length,
    },
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