"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { secureAdminAction } from "@/lib/security/secureAdminAction";

import {
  createSlideService,
  updateSlideService,
  deleteSlideService,
  SlideInput,
} from "@/lib/services/admin/slideService";

import { PlacementKey } from "@prisma/client";

/* ===============================
   PARSER
================================ */

function parseSlideForm(formData: FormData): {
  id?: string;
  data: SlideInput;
} {
  const id = formData.get("id")
    ? String(formData.get("id"))
    : undefined;

  const imageDesktopUrl = String(
    formData.get("imageDesktopUrl") ?? ""
  );

  const imageMobileUrl = String(
    formData.get("imageMobileUrl") ?? ""
  );

  const placementKey = String(
    formData.get("placementKey") ?? ""
  ) as PlacementKey;

  const order = Number(formData.get("order") ?? 0);

  const isActive = formData.get("isActive") === "on";

  const startAtRaw = formData.get("startAt");
  const endAtRaw = formData.get("endAt");

  const startAt = startAtRaw
    ? new Date(String(startAtRaw))
    : null;

  const endAt = endAtRaw
    ? new Date(String(endAtRaw))
    : null;

  const placements = [
    {
      placementKey,
      order,
      isActive,
      startAt,
      endAt,
    },
  ];

  return {
    id,
    data: {
      imageDesktopUrl,
      imageMobileUrl,
      placements,
    },
  };
}

/* ===============================
   CREATE
================================ */

export const createSlide = secureAdminAction(
  async (admin, formData: FormData) => {
    const { data } = parseSlideForm(formData);

    await createSlideService(data, admin.id);

    // 🔥 CRITICAL: clear data cache
    revalidateTag("slides", "max");

    // re-render affected pages
    revalidatePath("/");
    revalidatePath("/admin/slides");

    redirect("/admin/slides");
  }
);

/* ===============================
   UPDATE
================================ */

export const updateSlide = secureAdminAction(
  async (admin, formData: FormData) => {
    const { id, data } = parseSlideForm(formData);

    if (!id) {
      throw new Error("Slide ID is required");
    }

    await updateSlideService(id, data, admin.id);

    // 🔥 CRITICAL: clear data cache
    revalidateTag("slides", "max");

    revalidatePath("/");
    revalidatePath("/admin/slides");

    redirect("/admin/slides");
  }
);

/* ===============================
   DELETE
================================ */

export const deleteSlide = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");

    if (!id) {
      throw new Error("Slide ID is required");
    }

    await deleteSlideService(id, admin.id);

    // 🔥 CRITICAL: clear data cache
    revalidateTag("slides", "max");

    revalidatePath("/");
    revalidatePath("/admin/slides");
  }
);