import "server-only";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export function getActiveCompanies() {
  return prisma.company.findMany({ where: { active: true }, orderBy: { name: "asc" } });
}

export async function getAllCompanies() {
  const [companies, counts] = await Promise.all([
    prisma.company.findMany({ orderBy: { name: "asc" } }),
    prisma.$queryRaw<Array<{ companyId: string; count: number }>>(Prisma.sql`SELECT "companyId", COUNT(*)::int AS "count" FROM "Product" GROUP BY "companyId"`),
  ]);
  const countByCompany = new Map(counts.map((item) => [item.companyId, item.count]));
  return companies.map((company) => ({ ...company, productCount: countByCompany.get(company.id) ?? 0 }));
}

export function createCompany(data: { name: string; slug: string }) {
  return prisma.company.create({ data });
}

export function updateCompany(id: string, data: { name?: string; slug?: string; active?: boolean }) {
  return prisma.company.update({ where: { id }, data });
}
