import { unstable_cache } from "next/cache";
import { getActiveMarqueeItems } from "@/lib/db/marquee";
import { CACHE_TAGS } from "@/lib/constants";

/* ──────────────────────────────── */
/* Cached Public Read */
/* ──────────────────────────────── */

export const getActiveMarqueeCached = unstable_cache(
  async () => {
    return getActiveMarqueeItems();
  },
  ["marquee-active"],
  {
    tags: [CACHE_TAGS.MARQUEES, CACHE_TAGS.GLOBAL],
    revalidate: false,
  }
);