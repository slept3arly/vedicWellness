import { Prisma } from "@prisma/client";

type AdminDateRangeFilters = {
  from?: string;
  to?: string;
};

const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function buildDateBoundary(value: string, boundary: "start" | "end") {
  const time =
    boundary === "start" ? "00:00:00.000Z" : "23:59:59.999Z";

  return new Date(`${value}T${time}`);
}

function isValidDateInput(value?: string) {
  if (!value || !DATE_INPUT_PATTERN.test(value)) {
    return false;
  }

  return !Number.isNaN(buildDateBoundary(value, "start").getTime());
}

export function buildCreatedAtRangeFilter({
  from,
  to,
}: AdminDateRangeFilters): Prisma.DateTimeFilter | undefined {
  const createdAt: Prisma.DateTimeFilter = {};

  if (isValidDateInput(from) && from) {
    createdAt.gte = buildDateBoundary(from, "start");
  }

  if (isValidDateInput(to) && to) {
    createdAt.lte = buildDateBoundary(to, "end");
  }

  return Object.keys(createdAt).length > 0 ? createdAt : undefined;
}
