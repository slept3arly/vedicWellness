"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { secureAdminAction } from "@/lib/security/secureAdminAction";
import { createCompany, updateCompany } from "@/lib/db/company";
import { slugify } from "@/lib/validators/product";
import { prisma } from "@/lib/db/prisma";

const refresh = () => {
  revalidatePath("/admin/companies");
  revalidatePath("/products");
  revalidateTag("products", "max");
};

export const createCompanyAction = secureAdminAction(async (_admin, formData: FormData) => {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Company name is required.");
  const base = slugify(name);
  if (!base) throw new Error("Company name must contain letters or numbers.");
  let slug = base;
  let suffix = 2;
  while (await prisma.company.findUnique({ where: { slug } })) slug = `${base}-${suffix++}`;
  await createCompany({ name, slug });
  refresh();
  redirect("/admin/companies?status=created");
});

export const updateCompanyAction = secureAdminAction(async (_admin, formData: FormData) => {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) throw new Error("Company name is required.");
  await updateCompany(id, { name });
  refresh();
  redirect("/admin/companies?status=updated");
});

export const toggleCompanyAction = secureAdminAction(async (_admin, formData: FormData) => {
  const id = String(formData.get("id") ?? "");
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) throw new Error("Company not found.");
  await updateCompany(id, { active: !company.active });
  refresh();
  redirect("/admin/companies?status=toggled");
});
