"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { secureAdminAction } from "@/lib/security/secureAdminAction";

import {
  createSlideService,
  updateSlideService,
  deleteSlideService,
  getAdminSlidesService,
} from "@/lib/services/slideService";

/* ===============================
   CREATE SLIDE
================================ */

export const createSlide = secureAdminAction(
  async (admin, formData: FormData) => {
    await createSlideService(formData, admin.id);

    revalidatePath("/");
    revalidatePath("/admin/slides");

    redirect("/admin/slides");
  }
);

/* ===============================
   UPDATE SLIDE
================================ */

export const updateSlide = secureAdminAction(
  async (admin, formData: FormData) => {
    await updateSlideService(formData, admin.id);

    revalidatePath("/");
    revalidatePath("/admin/slides");

    redirect("/admin/slides");
  }
);

/* ===============================
   DELETE SLIDE
================================ */

export const deleteSlide = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");

    await deleteSlideService(id, admin.id);

    revalidatePath("/");
    revalidatePath("/admin/slides");
  }
);

/* ===============================
   ADMIN SLIDES LIST (READ)
================================ */

export async function getAdminSlidesAction(
  page = 1,
  limit = 20
) {
  return getAdminSlidesService(page, limit);
}