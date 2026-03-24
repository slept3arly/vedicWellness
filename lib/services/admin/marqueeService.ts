import {
  createMarqueeDB,
  updateMarqueeDB,
  deleteMarqueeDB,
  getMarqueeById,
} from "@/lib/db/marquee";

import { auditWithContext } from "@/lib/observability/auditWithContext";

/* ──────────────────────────────── */
/* Types */
/* ──────────────────────────────── */

export type MarqueeInput = {
  id?: string;
  text: string;
  order: number;
  isActive: boolean;
};

/* ──────────────────────────────── */
/* Create */
/* ──────────────────────────────── */

export async function createMarqueeService(
  data: MarqueeInput,
  adminId: string
) {
  const item = await createMarqueeDB({
    text: data.text,
    order: data.order,
    isActive: data.isActive,
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_CREATE",
    entityType: "MARQUEE",
    entityId: item.id,
    metadata: {
      kind: "MARQUEE_ITEM",
      text: data.text,
      order: data.order,
      isActive: data.isActive,
    },
  });

  return item.id;
}

/* ──────────────────────────────── */
/* Update */
/* ──────────────────────────────── */

export async function updateMarqueeService(
  data: MarqueeInput,
  adminId: string
) {
  if (!data.id) {
    throw new Error("Missing marquee item id");
  }

  await updateMarqueeDB(data.id, {
    text: data.text,
    order: data.order,
    isActive: data.isActive,
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "MARQUEE",
    entityId: data.id,
    metadata: {
      kind: "MARQUEE_ITEM",
      text: data.text,
      order: data.order,
      isActive: data.isActive,
    },
  });
}

/* ──────────────────────────────── */
/* Toggle */
/* ──────────────────────────────── */

export async function toggleMarqueeService(
  id: string,
  adminId: string
) {
  const item = await getMarqueeById(id);
  if (!item) return;

  const next = !item.isActive;

  await updateMarqueeDB(id, { isActive: next });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "MARQUEE",
    entityId: id,
    metadata: {
      kind: "MARQUEE_ITEM",
      text: item.text,
      field: "isActive",
      from: item.isActive,
      to: next,
    },
  });
}

/* ──────────────────────────────── */
/* Delete */
/* ──────────────────────────────── */

export async function deleteMarqueeService(
  id: string,
  adminId: string
) {
  const item = await getMarqueeById(id);

  await deleteMarqueeDB(id);

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_DELETE",
    entityType: "MARQUEE",
    entityId: id,
    metadata: {
      kind: "MARQUEE_ITEM",
      text: item?.text ?? null,
      order: item?.order ?? null,
      wasActive: item?.isActive ?? null,
    },
  });
}