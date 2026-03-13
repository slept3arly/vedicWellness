"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { secureAdminAction } from "@/lib/security/secureAdminAction";

import {
  createBannerService,
  updateBannerService,
  deleteBannerService,
  toggleBannerService,
} from "@/lib/services/bannerService";

const BANNER_TAG = "banner";

export const createBanner = secureAdminAction(
  async (admin, formData: FormData) => {
    await createBannerService(formData, admin.id);

    revalidateTag(BANNER_TAG, "max");

    redirect("/admin/banners");
  }
);

export const updateBanner = secureAdminAction(
  async (admin, formData: FormData) => {
    await updateBannerService(formData, admin.id);

    revalidateTag(BANNER_TAG, "max");

    redirect("/admin/banners");
  }
);

export const deleteBanner = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");

    await deleteBannerService(formData, admin.id);

    revalidateTag(BANNER_TAG, "max");

    redirect("/admin/banners");
  }
);

export const toggleBanner = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");

    await toggleBannerService(id, admin.id);

    revalidateTag(BANNER_TAG, "max");

    redirect("/admin/banners");
  }
);