import { prisma } from "@/lib/db/prisma";
import SlideEditForm from "./SlidesEditForm";

export default async function EditSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ MUST await in Next 16

  const slide = await prisma.slide.findUnique({
    where: { id },
    include: { placements: true },
  });

  if (!slide) {
    return <div style={{ padding: 24 }}>Slide not found</div>;
  }

  return <SlideEditForm slide={slide} />;
}
