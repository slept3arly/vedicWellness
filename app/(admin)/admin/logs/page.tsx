import { getRecentAuditLogs } from "@/lib/db/audit";
import AdminLogsClient from "./AdminLogsClient";

export default async function AdminLogsPage() {
  const { logs, userMap } = await getRecentAuditLogs();

  return <AdminLogsClient logs={logs} userMap={userMap} />;
}
