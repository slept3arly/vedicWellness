import { prisma } from "@/lib/db/prisma";
import SlidesClient from "./SlidesClient";

export default async function AdminSlidesPage() {
  const slides = await prisma.slide.findMany({
    include: {
      placements: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <SlidesClient slides={slides} />;
}
