"use server";

import { revalidateTag } from "next/cache";
import { secureAdminAction } from "@/lib/security/secureAdminAction";
import { CACHE_TAGS } from "@/lib/constants";
import { auditWithContext } from "@/lib/observability/auditWithContext";

export const purgeGlobalCache = secureAdminAction(
  async (admin) => {
    revalidateTag(CACHE_TAGS.GLOBAL, "max");

    await auditWithContext({
      actorId: admin.id,
      action: "SETTINGS_UPDATE",
      entityType: "SETTINGS",
      entityId: "system",
      entityLabel: "Global Cache",
      metadata: {
        type: "UPDATE",
        context: "Manually purged global cache",
      },
    });
  }
);
