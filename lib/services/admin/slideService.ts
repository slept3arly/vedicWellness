import {
  createSlideDB,
  replaceSlidePlacementsDB,
  updateSlideDB,
  deleteSlideDB,
  getSlideById, // 🔥 ensure this exists in DB
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
    entityLabel: `Slide: ${slide.id}`,
    metadata: {
      type: "CREATE",
      snapshot: {
        imageDesktopUrl: data.imageDesktopUrl,
        imageMobileUrl: data.imageMobileUrl,
        placementsCount: data.placements.length,
      },
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
  const before = await getSlideById(id);
  if (!before) throw new Error("Slide not found");

  await updateSlideDB(id, {
    imageDesktopUrl: data.imageDesktopUrl,
    imageMobileUrl: data.imageMobileUrl,
  });

  await replaceSlidePlacementsDB(id, data.placements);

  const changes = [];

  if (before.imageDesktopUrl !== data.imageDesktopUrl) {
    changes.push({
      field: "imageDesktopUrl",
      from: before.imageDesktopUrl,
      to: data.imageDesktopUrl,
    });
  }

  if (before.imageMobileUrl !== data.imageMobileUrl) {
    changes.push({
      field: "imageMobileUrl",
      from: before.imageMobileUrl,
      to: data.imageMobileUrl,
    });
  }

  if (before.placements?.length !== data.placements.length) {
    changes.push({
      field: "placementsCount",
      from: before.placements?.length ?? 0,
      to: data.placements.length,
    });
  }

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "SLIDE",
    entityId: id,
    entityLabel: `Slide: ${id}`,
    metadata: {
      type: "UPDATE",
      changes,
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
  const before = await getSlideById(id);

  await deleteSlideDB(id);

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_DELETE",
    entityType: "SLIDE",
    entityId: id,
    entityLabel: `Slide: ${id}`,
    metadata: {
      type: "DELETE",
      snapshot: {
        imageDesktopUrl: before?.imageDesktopUrl ?? null,
        imageMobileUrl: before?.imageMobileUrl ?? null,
        placementsCount: before?.placements?.length ?? 0,
      },
    },
  });
}