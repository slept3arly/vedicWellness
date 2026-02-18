"use client";

import Link from "next/link";
import Image from "next/image";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminActionButton from "@/components/admin/AdminActionButton";
import { deleteSlide } from "./serverActions";

export default function SlidesClient({ slides }: { slides: any[] }) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Slides</h1>

        <Link href="/admin/slides/new">
          <AdminButton>+ Add Slide</AdminButton>
        </Link>
      </div>

      <div className="space-y-4">
        {slides.map((s) => (
          <AdminCard
            key={s.id}
            className="flex flex-col md:flex-row gap-6 items-start"
          >
            <div className="w-32 h-20 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800">
              <Image
                src={s.imageDesktopUrl}
                alt=""
                width={160}
                height={100}
                className="object-cover"
              />
            </div>

            <div className="flex-1 space-y-2">
              {s.placements.map((p: any) => (
                <div key={p.id} className="text-sm">
                  {p.placementKey} | Order: {p.order}
                </div>
              ))}
            </div>

            <div className="flex gap-2 w-full md:w-auto">

              <Link href={`/admin/slides/edit/${s.id}`}>
                <AdminButton className="w-full md:w-auto">
                  Edit
                </AdminButton>
              </Link>

              <form
                action={deleteSlide}
                onSubmit={(e) => {
                  if (!confirm("Delete this slide permanently?")) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="id" value={s.id} />
                <AdminActionButton variant="danger">
                  Delete
                </AdminActionButton>
              </form>

            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
