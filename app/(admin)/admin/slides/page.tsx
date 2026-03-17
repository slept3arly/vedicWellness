import { getAdminSlidesService } from "@/lib/services/slideService";
import SlidesClient from "./SlidesClient";

export default async function AdminSlidesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10; // You can adjust this

  const { slides, total } = await getAdminSlidesService(page, limit);

  return <SlidesClient slides={slides} total={total} page={page} limit={limit} />;
}