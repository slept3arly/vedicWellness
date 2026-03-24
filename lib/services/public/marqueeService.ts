import { unstable_cache } from "next/cache";
import { getActiveMarqueeItems } from "@/lib/db/marquee";
import { MARQUEE_TAG } from "@/lib/constants";

/* ──────────────────────────────── */
/* Cached Public Read */
/* ──────────────────────────────── */

export const getActiveMarqueeCached = unstable_cache(
  async () => {
    return getActiveMarqueeItems();
  },
  ["marquee-active"],
  {
    tags: [MARQUEE_TAG],
    revalidate: false,
  }
);