"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { assertSameOriginAction } from "@/lib/security/csrf";

import {
  createMarqueeService,
  updateMarqueeService,
  toggleMarqueeService,
  deleteMarqueeService,
} from "@/lib/services/marqueeService";

import { parseMarqueeId } from "@/lib/validators/marquee";

export async function createMarqueeItem(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  await createMarqueeService(formData, admin.id);

  revalidatePath("/admin/marquee");
  revalidatePath("/");
  redirect("/admin/marquee");
}

export async function updateMarqueeItem(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  await updateMarqueeService(formData, admin.id);

  revalidatePath("/admin/marquee");
  revalidatePath("/");
  redirect("/admin/marquee");
}

export async function toggleMarqueeItem(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = parseMarqueeId(formData);

  await toggleMarqueeService(id, admin.id);

  revalidatePath("/admin/marquee");
  revalidatePath("/");
}

export async function deleteMarqueeItem(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = parseMarqueeId(formData);

  await deleteMarqueeService(id, admin.id);

  revalidatePath("/admin/marquee");
  revalidatePath("/");
}
