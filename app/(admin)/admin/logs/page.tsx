import AdminLogsClient from "./AdminLogsClient";
import { getAdminLogsAction } from "./serverActions";

export default async function AdminLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const page = Number(params.page) || 1;

  const { logs, total } = await getAdminLogsAction(page, 25);

  return (
    <AdminLogsClient
      logs={logs}
      total={total}
      page={page}
    />
  );
}