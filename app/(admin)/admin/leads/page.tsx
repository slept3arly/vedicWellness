import AdminLeadsClient from "./AdminLeadsClient";
import { getAdminLeads } from "@/lib/db/lead";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { LeadStatus } from "@prisma/client";

const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    from?: string;
    to?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;
  const from =
    params.from && DATE_INPUT_PATTERN.test(params.from) ? params.from : "";
  const to = params.to && DATE_INPUT_PATTERN.test(params.to) ? params.to : "";
  const status = Object.values(LeadStatus).includes(params.status as LeadStatus)
    ? (params.status as LeadStatus)
    : undefined;

  const { data: leads, total } = await getAdminLeads(
    page,
    ADMIN_PAGE_SIZE,
    q,
    {
      from,
      to,
      status,
    }
  );

  return (
    <AdminLeadsClient
      leads={leads}
      total={total}
      page={page}
      q={q}
      from={from}
      to={to}
      status={status ?? ""}
      statusOptions={Object.values(LeadStatus)}
    />
  );
}
