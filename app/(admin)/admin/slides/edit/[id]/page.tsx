import { getAdminSlideById } from "@/lib/db/slide";
import SlideEditForm from "./SlidesEditForm";

export default async function EditSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const slide = await getAdminSlideById(id);

  if (!slide) {
    return <div style={{ padding: 24 }}>Slide not found</div>;
  }

  return <SlideEditForm slide={slide} />;
}