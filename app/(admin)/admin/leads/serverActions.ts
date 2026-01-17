"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
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

export async function toggleLeadDone(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const done = String(formData.get("done") ?? "false") === "true";

  // toggle
  await prisma.lead.update({
    where: { id },
    data: {
      done: !done,
      doneAt: !done ? new Date() : null,
    } as any,
  });

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_UPDATE",
    entityType: "OTHER",
    entityId: id,
    ip,
    userAgent,
    metadata: { kind: "LEAD", field: "done", from: done, to: !done },
  });

  revalidatePath("/admin/leads");
}

export async function deleteLead(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  const lead = await prisma.lead.findUnique({ where: { id } });
  await prisma.lead.delete({ where: { id } });

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_DELETE",
    entityType: "OTHER",
    entityId: id,
    ip,
    userAgent,
    metadata: {
      kind: "LEAD",
      email: lead?.email ?? null,
      name: lead?.name ?? null,
    },
  });

  revalidatePath("/admin/leads");
}
