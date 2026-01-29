import "server-only";

import { prisma } from "@/lib/db/prisma";

type CreateLeadInput = {
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;        // ✅ ADD
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
      city: input.city ?? null,       // ✅ SAVE IT
      message: input.message,
      ip: input.ip ?? null,
      userAgent: input.userAgent ?? null,
    },
  });
}
