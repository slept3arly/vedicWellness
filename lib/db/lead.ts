import "server-only";
import { buildWhere } from "@/lib/db/search";
import { buildCreatedAtRangeFilter } from "@/lib/db/adminFilters";
import { prisma } from "@/lib/db/prisma";
import { LeadStatus, Prisma } from "@prisma/client";
import type { SearchConfig } from "@/lib/db/search";

type CreateLeadInput = {
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  message: string;
  ip?: string | null;
  userAgent?: string | null;
};

const leadSearchConfig: SearchConfig = {
  text: ["name", "email", "phone", "city", "message"],
  enum: [
    {
      path: "status",
      values: Object.values(LeadStatus),
    },
  ],
  relation: ["owner.email"],
  exact: ["email", "phone"],
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

export async function updateLead(
  id: string,
  data: Prisma.LeadUpdateInput
) {
  return prisma.lead.update({
    where: { id },
    data,
  });
}

export async function deleteLeadDB(id: string) {
  return prisma.lead.delete({
    where: { id },
  });
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
  });
}

/* Admin paginated read */
export async function getAdminLeads(
  page = 1,
  limit = 25,
  q = "",
  filters: {
    from?: string;
    to?: string;
    status?: LeadStatus;
  } = {}
) {
  const skip = (page - 1) * limit;
  const searchWhere = buildWhere(q, leadSearchConfig) as Prisma.LeadWhereInput;
  const filterConditions: Prisma.LeadWhereInput[] = [];
  const createdAt = buildCreatedAtRangeFilter(filters);

  if (createdAt) {
    filterConditions.push({ createdAt });
  }

  if (filters.status) {
    filterConditions.push({ status: filters.status });
  }

  const where =
    filterConditions.length > 0
      ? {
          AND: [searchWhere, ...filterConditions],
        }
      : searchWhere;

  const [data, total] = await prisma.$transaction([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        message: true,
        status: true,
        createdAt: true,
        ownerId: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
  };
}

export async function getAdminLeadById(id: string) {
  if (!id) {
    throw new Error("Lead ID is required");
  }

  return prisma.lead.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      city: true,
      message: true,
      status: true,
      createdAt: true,
      claimedAt: true,
      ownerId: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
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

/* ===============================
   ADMIN SALES USERS
================================ */

export async function getAdminSalesUsers() {
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
