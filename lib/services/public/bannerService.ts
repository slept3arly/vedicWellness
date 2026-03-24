import { unstable_cache } from "next/cache";
import { getActiveBanner } from "@/lib/db/banner";
import { BANNER_TAG } from "@/lib/constants";

/* ========================================================= */
/* PUBLIC: ACTIVE BANNER (CACHED) */
/* ========================================================= */

export const getActiveBannerCached = unstable_cache(
  async () => {
    return getActiveBanner();
  },
  ["active-banner"],
  {
    tags: [BANNER_TAG],

    // 🔥 CRITICAL: no time-based revalidation
    // cache only updates when manually invalidated
    revalidate: false,
  }
);