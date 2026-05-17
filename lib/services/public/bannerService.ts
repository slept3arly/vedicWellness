import { unstable_cache } from "next/cache";
import { getActiveBanner } from "@/lib/db/banner";
import { CACHE_TAGS } from "@/lib/constants";

/* ========================================================= */
/* PUBLIC: ACTIVE BANNER (CACHED) */
/* ========================================================= */

export const getActiveBannerCached = unstable_cache(
  async () => {
    return getActiveBanner();
  },
  ["active-banner"],
  {
    tags: [CACHE_TAGS.BANNERS, CACHE_TAGS.GLOBAL],

    // 🔥 CRITICAL: no time-based revalidation
    // cache only updates when manually invalidated
    revalidate: false,
  }
);