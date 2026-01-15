"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function createMarqueeItem(formData: FormData) {
  await requireAdmin();

  const text = String(formData.get("text") || "");
  const orderRaw = String(formData.get("order") || "0");
  const isActive = formData.get("isActive") === "on";

  await prisma.marqueeItem.create({
    data: {
      text,
      order: Number(orderRaw),
      isActive,
    },
  });

  revalidatePath("/admin/marquee");
  revalidatePath("/");
  redirect("/admin/marquee");
}

export async function deleteMarqueeItem(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.marqueeItem.delete({ where: { id } });

  revalidatePath("/admin/marquee");
  revalidatePath("/");
}

export async function toggleMarqueeItem(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));

  const item = await prisma.marqueeItem.findUnique({ where: { id } });
  if (!item) return;

  await prisma.marqueeItem.update({
    where: { id },
    data: { isActive: !item.isActive },
  });

  revalidatePath("/admin/marquee");
  revalidatePath("/");
}

export async function updateMarqueeItem(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const text = String(formData.get("text") || "");
  const orderRaw = String(formData.get("order") || "0");
  const isActive = formData.get("isActive") === "on";

  await prisma.marqueeItem.update({
    where: { id },
    data: {
      text,
      order: Number(orderRaw),
      isActive,
    },
  });

  revalidatePath("/admin/marquee");
  revalidatePath("/");
  redirect("/admin/marquee");
}
