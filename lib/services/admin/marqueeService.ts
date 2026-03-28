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
    entityLabel: `Marquee: ${data.text}`,
    metadata: {
      type: "CREATE",
      snapshot: {
        text: data.text,
        order: data.order,
        isActive: data.isActive,
      },
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

  const before = await getMarqueeById(data.id);
  if (!before) return;

  await updateMarqueeDB(data.id, {
    text: data.text,
    order: data.order,
    isActive: data.isActive,
  });

  const changes = [];

  if (before.text !== data.text) {
    changes.push({ field: "text", from: before.text, to: data.text });
  }

  if (before.order !== data.order) {
    changes.push({ field: "order", from: before.order, to: data.order });
  }

  if (before.isActive !== data.isActive) {
    changes.push({
      field: "isActive",
      from: before.isActive,
      to: data.isActive,
    });
  }

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "MARQUEE",
    entityId: data.id,
    entityLabel: `Marquee: ${before.text}`,
    metadata: {
      type: "UPDATE",
      changes,
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
    entityLabel: `Marquee: ${item.text}`,
    metadata: {
      type: "UPDATE",
      changes: [
        {
          field: "isActive",
          from: item.isActive,
          to: next,
        },
      ],
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
    entityLabel: `Marquee: ${item?.text ?? "Unknown"}`,
    metadata: {
      type: "DELETE",
      snapshot: {
        text: item?.text ?? null,
        order: item?.order ?? null,
        isActive: item?.isActive ?? null,
      },
    },
  });
}