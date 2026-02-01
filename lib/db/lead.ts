import "server-only";
import { prisma } from "@/lib/db/prisma";
import { LeadStatus } from "@prisma/client";

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

/* ✅ Admin reads */

export async function getAdminLeads() {
  return prisma.lead.findMany({
    include: { owner: true },
    orderBy: { createdAt: "desc" },
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
