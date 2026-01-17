"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { assertSameOriginAction } from "@/lib/security/csrf";
import { auditLog } from "@/lib/observability/audit";

async function getRequestContext() {
  const h = await headers();
  return {
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: h.get("user-agent") ?? null,
  };
}

export async function createMarqueeItem(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const text = String(formData.get("text") || "").trim();
  const orderRaw = String(formData.get("order") || "0");
  const isActive = formData.get("isActive") === "on";

  const item = await prisma.marqueeItem.create({
    data: {
      text,
      order: Number(orderRaw),
      isActive,
    },
    select: { id: true },
  });

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_CREATE",
    entityType: "OTHER",
    entityId: item.id,
    ip,
    userAgent,
    metadata: { kind: "MARQUEE_ITEM", text, order: Number(orderRaw), isActive },
  });

  revalidatePath("/admin/marquee");
  revalidatePath("/");
  redirect("/admin/marquee");
}

export async function deleteMarqueeItem(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id")).trim();

  const item = await prisma.marqueeItem.findUnique({ where: { id } });

  await prisma.marqueeItem.delete({ where: { id } });

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_DELETE",
    entityType: "OTHER",
    entityId: id,
    ip,
    userAgent,
    metadata: {
      kind: "MARQUEE_ITEM",
      text: item?.text ?? null,
      order: item?.order ?? null,
      wasActive: item?.isActive ?? null,
    },
  });

  revalidatePath("/admin/marquee");
  revalidatePath("/");
}

export async function toggleMarqueeItem(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id")).trim();

  const item = await prisma.marqueeItem.findUnique({ where: { id } });
  if (!item) return;

  await prisma.marqueeItem.update({
    where: { id },
    data: { isActive: !item.isActive },
  });

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_UPDATE",
    entityType: "OTHER",
    entityId: id,
    ip,
    userAgent,
    metadata: {
      kind: "MARQUEE_ITEM",
      field: "isActive",
      from: item.isActive,
      to: !item.isActive,
    },
  });

  revalidatePath("/admin/marquee");
  revalidatePath("/");
}

export async function updateMarqueeItem(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id")).trim();
  const text = String(formData.get("text") || "").trim();
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

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_UPDATE",
    entityType: "OTHER",
    entityId: id,
    ip,
    userAgent,
    metadata: { kind: "MARQUEE_ITEM", text, order: Number(orderRaw), isActive },
  });

  revalidatePath("/admin/marquee");
  revalidatePath("/");
  redirect("/admin/marquee");
}
