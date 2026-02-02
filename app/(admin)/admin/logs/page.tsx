import { getRecentAuditLogs } from "@/lib/db/audit";
import AdminLogsClient from "./AdminLogsClient";

export default async function AdminLogsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = Number(searchParams?.page ?? 1);

  const { logs, userMap } = await getRecentAuditLogs(page);

  return <AdminLogsClient logs={logs} userMap={userMap} />;
}
