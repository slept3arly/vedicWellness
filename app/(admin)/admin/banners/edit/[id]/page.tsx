import { getAdminBannerById } from "@/lib/db/banner";
import BannerEditForm from "./BannerEditForm";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const banner = await getAdminBannerById(id);

  if (!banner) return <div>Banner not found.</div>;

  return <BannerEditForm banner={banner} />;
}