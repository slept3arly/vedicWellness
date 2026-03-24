"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

import { secureAdminAction } from "@/lib/security/secureAdminAction";

import {
  createBannerService,
  updateBannerService,
  deleteBannerService,
  toggleBannerService,
} from "@/lib/services/admin/bannerService";

import {
  parseBannerForm,
  parseBannerId,
} from "@/lib/validators/banner";

import { BANNER_TAG } from "@/lib/constants";

/* ========================================================= */
/* CREATE */
/* ========================================================= */

export const createBanner = secureAdminAction(
  async (admin, formData: FormData) => {
    const data = parseBannerForm(formData);

    await createBannerService(data, admin.id);

    revalidateTag(BANNER_TAG, "max");

    redirect("/admin/banners");
  }
);

/* ========================================================= */
/* UPDATE */
/* ========================================================= */

export const updateBanner = secureAdminAction(
  async (admin, formData: FormData) => {
    const data = parseBannerForm(formData);

    await updateBannerService(data, admin.id);

    revalidateTag(BANNER_TAG, "max");

    redirect("/admin/banners");
  }
);

/* ========================================================= */
/* DELETE */
/* ========================================================= */

export const deleteBanner = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseBannerId(formData);

    await deleteBannerService(id, admin.id);

    revalidateTag(BANNER_TAG, "max");

    redirect("/admin/banners");
  }
);

/* ========================================================= */
/* TOGGLE */
/* ========================================================= */

export const toggleBanner = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseBannerId(formData);

    await toggleBannerService(id, admin.id);

    revalidateTag(BANNER_TAG, "max");

    redirect("/admin/banners");
  }
);