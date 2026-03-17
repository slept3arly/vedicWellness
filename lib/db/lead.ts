import "server-only";
import { prisma } from "@/lib/db/prisma";

type CreateLeadInput = {
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  message: string;
  ip?: string | null;
  userAgent?: string | null;
};

export async function createLead(input: CreateLeadInput) {
  return prisma.lead.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      city: input.city ?? null,
      message: input.message,
      ip: input.ip ?? null,
      userAgent: input.userAgent ?? null,
    },
  });
}

export async function updateLead(id: string, data: any) {
  return prisma.lead.update({
    where: { id },
    data,
  });
}

export async function deleteLeadDB(id: string) {
  return prisma.lead.delete({ where: { id } });
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({ where: { id } });
}

/* ✅ Admin paginated read */
export async function getAdminLeads(
  page = 1,
  limit = 25,
  q = ""
) {
  const skip = (page - 1) * limit;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { city: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [data, total] = await prisma.$transaction([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,

      // 🔥 IMPORTANT: avoid over-fetching
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        status: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.lead.count({
      where,
    }),
  ]);

  return {
    data,
    total,
    page,
    limit,
  };
}

export async function getSalesUsers() {
  return prisma.user.findMany({
    where: { role: "SALES" },
    select: {
      id: true,
      email: true,
      name: true,
    },
    orderBy: { createdAt: "asc" },
  });
}
