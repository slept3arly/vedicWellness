import AdminLogsClient from "./AdminLogsClient";
import { getAdminAuditLogs } from "@/lib/db/audit";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default async function AdminLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const page = Number(params.page) || 1;

  const { data: logs, total } = await getAdminAuditLogs(
    page,
    ADMIN_PAGE_SIZE
  );

  return (
    <AdminLogsClient
      logs={logs}
      total={total}
      page={page}
    />
  );
}