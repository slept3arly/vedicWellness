import AdminMarqueeClient from "./AdminMarqueeClient";
import { getAdminMarqueeItems } from "@/lib/db/marquee";

export default async function AdminMarqueePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  // 1. Await the searchParams for Next.js 15 compatibility
  const params = await searchParams;
  const q = params.q || "";
  const page = Number(params.page) || 1;

  // 2. Fetch fresh data based on current URL state
  const items = await getAdminMarqueeItems(page, 20, q);

  return (
    <AdminMarqueeClient
      // 3. The key forces the client component to reset its internal state 
      // when the search query or page changes.
      
      items={items}
      q={q}
      page={page}
    />
  );
}