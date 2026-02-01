import {
  createMarqueeDB,
  updateMarqueeDB,
  deleteMarqueeDB,
  getMarqueeById,
} from "@/lib/db/marquee";

import { parseMarqueeForm } from "@/lib/validators/marquee";
import { auditWithContext } from "@/lib/observability/auditWithContext";

export async function createMarqueeService(
  formData: FormData,
  adminId: string
) {
  const data = parseMarqueeForm(formData);

  const item = await createMarqueeDB(data);

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

export async function updateMarqueeService(
  formData: FormData,
  adminId: string
) {
  const data = parseMarqueeForm(formData);
  if (!data.id) throw new Error("Missing marquee item id");

  await updateMarqueeDB(data.id, data);

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

export async function toggleMarqueeService(id: string, adminId: string) {
  const item = await getMarqueeById(id);
  if (!item) return;

  await updateMarqueeDB(id, { isActive: !item.isActive });

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
      to: !item.isActive,
    },
  });
}

export async function deleteMarqueeService(id: string, adminId: string) {
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
