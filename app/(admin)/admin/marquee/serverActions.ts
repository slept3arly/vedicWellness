"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { secureAdminAction } from "@/lib/security/secureAdminAction";

import {
  createMarqueeService,
  updateMarqueeService,
  toggleMarqueeService,
  deleteMarqueeService,
  getAdminMarqueeService
} from "@/lib/services/marqueeService";

import { parseMarqueeId } from "@/lib/validators/marquee";

export const createMarqueeItem = secureAdminAction(
  async (admin, formData: FormData) => {
    await createMarqueeService(formData, admin.id);

    revalidatePath("/admin/marquee");
    revalidatePath("/");
    redirect("/admin/marquee");
  }
);

export const updateMarqueeItem = secureAdminAction(
  async (admin, formData: FormData) => {
    await updateMarqueeService(formData, admin.id);

    revalidatePath("/admin/marquee");
    revalidatePath("/");
    redirect("/admin/marquee");
  }
);

export const toggleMarqueeItem = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseMarqueeId(formData);

    await toggleMarqueeService(id, admin.id);

    revalidatePath("/admin/marquee");
    revalidatePath("/");
  }
);

export const deleteMarqueeItem = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseMarqueeId(formData);

    await deleteMarqueeService(id, admin.id);

    revalidatePath("/admin/marquee");
    revalidatePath("/");
  }
);

export async function getAdminMarqueeAction(
  page = 1,
  limit = 20,
  q = ""
) {
  return getAdminMarqueeService(page, limit, q);
}