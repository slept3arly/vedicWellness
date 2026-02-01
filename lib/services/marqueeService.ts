import {
  createMarqueeDB,
  updateMarqueeDB,
  deleteMarqueeDB,
  getMarqueeById,
} from "@/lib/db/marquee";

import { parseMarqueeForm } from "@/lib/validators/marquee";
import { auditWithContext } from "@/lib/observability/auditWithContext";
import { headers } from "next/headers";

async function getRequestContext() {
  const h = await headers();
  return {
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: h.get("user-agent") ?? null,
  };
}

export async function createMarqueeService(
  formData: FormData,
  adminId: string
) {
  const data = parseMarqueeForm(formData);

  const item = await createMarqueeDB(data);

  const ctx = await getRequestContext();
   await auditWithContext({
    actorId: adminId,
    action: "ADMIN_CREATE",
    entityType: "MARQUEE",
    entityId: item.id,
    ...ctx,
    metadata: {
      kind: "MARQUEE_ITEM",
      text: data.text,
      order: data.order,
      isActive: data.isActive,
    },
  });

  return item.id;
}

export async function updateMarqueeService(
  formData: FormData,
  adminId: string
) {
  const data = parseMarqueeForm(formData);
  if (!data.id) throw new Error("Missing marquee item id");

  await updateMarqueeDB(data.id, data);

  const ctx = await getRequestContext();
   await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "MARQUEE",
    entityId: data.id,
    ...ctx,
    metadata: {
      kind: "MARQUEE_ITEM",
      text: data.text,
      order: data.order,
      isActive: data.isActive,
    },
  });
}

export async function toggleMarqueeService(
  id: string,
  adminId: string
) {
  const item = await getMarqueeById(id);
  if (!item) return;

  await updateMarqueeDB(id, { isActive: !item.isActive });

  const ctx = await getRequestContext();
   await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "MARQUEE",
    entityId: id,
    ...ctx,
    metadata: {
      kind: "MARQUEE_ITEM",
      text: item.text,
      field: "isActive",
      from: item.isActive,
      to: !item.isActive,
    },
  });
}

export async function deleteMarqueeService(
  id: string,
  adminId: string
) {
  const item = await getMarqueeById(id);

  await deleteMarqueeDB(id);

  const ctx = await getRequestContext();
   await auditWithContext({
    actorId: adminId,
    action: "ADMIN_DELETE",
    entityType: "MARQUEE",
    entityId: id,
    ...ctx,
    metadata: {
      kind: "MARQUEE_ITEM",
      text: item?.text ?? null,
      order: item?.order ?? null,
      wasActive: item?.isActive ?? null,
    },
  });
}
