"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";

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

export async function createUser(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "VIEWER") as
    | "ADMIN"
    | "EDITOR"
    | "VIEWER";

  if (!email || !password) throw new Error("Missing email/password");

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: role as any,
    },
    select: { id: true, email: true, role: true },
  });

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_CREATE",
    entityType: "USER",
    entityId: user.id,
    ip,
    userAgent,
    metadata: { email: user.email, role: user.role },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUserRole(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const role = String(formData.get("role") ?? "VIEWER") as
    | "ADMIN"
    | "EDITOR"
    | "VIEWER";

  const old = await prisma.user.findUnique({ where: { id } });

  await prisma.user.update({
    where: { id },
    data: { role: role as any },
  });

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ROLE_CHANGE",
    entityType: "USER",
    entityId: id,
    ip,
    userAgent,
    metadata: { from: old?.role ?? null, to: role },
  });

  revalidatePath("/admin/users");
}

export async function updateUser(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "VIEWER") as
    | "ADMIN"
    | "EDITOR"
    | "VIEWER";

  const old = await prisma.user.findUnique({ where: { id } });

  const data: any = { email, role };
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({
    where: { id },
    data,
  });

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_UPDATE",
    entityType: "USER",
    entityId: id,
    ip,
    userAgent,
    metadata: {
      from: { email: old?.email ?? null, role: old?.role ?? null },
      to: { email, role },
      passwordChanged: Boolean(password),
    },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  const user = await prisma.user.findUnique({ where: { id } });
  await prisma.user.delete({ where: { id } });

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_DELETE",
    entityType: "USER",
    entityId: id,
    ip,
    userAgent,
    metadata: { email: user?.email ?? null, role: user?.role ?? null },
  });

  revalidatePath("/admin/users");
}
