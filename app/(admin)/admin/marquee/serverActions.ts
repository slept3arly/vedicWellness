"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { secureAdminAction } from "@/lib/security/secureAdminAction";

import {
  createMarqueeService,
  updateMarqueeService,
  toggleMarqueeService,
  deleteMarqueeService,
} from "@/lib/services/admin/marqueeService";

import {
  parseMarqueeForm,
  parseMarqueeId,
} from "@/lib/validators/marquee";

import { CACHE_TAGS } from "@/lib/constants";

/* ──────────────────────────────── */
/* Create */
/* ──────────────────────────────── */

export const createMarqueeItem = secureAdminAction(
  async (admin, formData: FormData) => {
    const data = parseMarqueeForm(formData);

    await createMarqueeService(data, admin.id);

    revalidateTag(CACHE_TAGS.MARQUEES, "max");
    redirect("/admin/marquee");
  }
);

/* ──────────────────────────────── */
/* Update */
/* ──────────────────────────────── */

export const updateMarqueeItem = secureAdminAction(
  async (admin, formData: FormData) => {
    const data = parseMarqueeForm(formData);

    await updateMarqueeService(data, admin.id);

    revalidateTag(CACHE_TAGS.MARQUEES, "max");
    redirect("/admin/marquee");
  }
);

/* ──────────────────────────────── */
/* Toggle */
/* ──────────────────────────────── */

export const toggleMarqueeItem = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseMarqueeId(formData);

    await toggleMarqueeService(id, admin.id);

    revalidateTag(CACHE_TAGS.MARQUEES, "max");
  }
);

/* ──────────────────────────────── */
/* Delete */
/* ──────────────────────────────── */

export const deleteMarqueeItem = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseMarqueeId(formData);

    await deleteMarqueeService(id, admin.id);

    revalidateTag(CACHE_TAGS.MARQUEES, "max");
  }
);