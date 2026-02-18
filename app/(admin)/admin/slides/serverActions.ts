"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { secureAdminAction } from "@/lib/security/secureAdminAction";
import { prisma } from "@/lib/db/prisma";

export const createSlide = secureAdminAction(
  async (admin, formData: FormData) => {
    const imageDesktopUrl = String(formData.get("imageDesktopUrl") ?? "");
    const imageMobileUrl = String(formData.get("imageMobileUrl") ?? "");

    const placementKey = String(formData.get("placementKey") ?? "");
    const order = Number(formData.get("order") ?? 0);
    const isActive = formData.get("isActive") === "on";

    const startAtRaw = formData.get("startAt");
    const endAtRaw = formData.get("endAt");

    const startAt = startAtRaw ? new Date(String(startAtRaw)) : null;
    const endAt = endAtRaw ? new Date(String(endAtRaw)) : null;

    if (!imageDesktopUrl || !imageMobileUrl) {
      throw new Error("Both desktop and mobile images are required.");
    }

    const slide = await prisma.slide.create({
      data: {
        imageDesktopUrl,
        imageMobileUrl,
      },
    });

    await prisma.slidePlacement.create({
      data: {
        slideId: slide.id,
        placementKey: placementKey as any,
        order,
        isActive,
        startAt,
        endAt,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/slides");

    redirect("/admin/slides");
  }
);

export const deleteSlide = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");

    await prisma.slide.delete({
      where: { id },
    });

    revalidatePath("/admin/slides");
    revalidatePath("/");
  }
);

export const updateSlide = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");

    const imageDesktopUrl = String(formData.get("imageDesktopUrl") ?? "");
    const imageMobileUrl = String(formData.get("imageMobileUrl") ?? "");

    const placementKey = String(formData.get("placementKey") ?? "");
    const order = Number(formData.get("order") ?? 0);
    const isActive = formData.get("isActive") === "on";

    const startAtRaw = formData.get("startAt");
    const endAtRaw = formData.get("endAt");

    const startAt = startAtRaw ? new Date(String(startAtRaw)) : null;
    const endAt = endAtRaw ? new Date(String(endAtRaw)) : null;

    // Update slide images
    await prisma.slide.update({
      where: { id },
      data: {
        imageDesktopUrl,
        imageMobileUrl,
      },
    });

    // Update placement (single for now)
    await prisma.slidePlacement.updateMany({
      where: { slideId: id },
      data: {
        placementKey: placementKey as any,
        order,
        isActive,
        startAt,
        endAt,
      },
    });

    revalidatePath("/admin/slides");
    revalidatePath("/");

    redirect("/admin/slides");
  }
);
