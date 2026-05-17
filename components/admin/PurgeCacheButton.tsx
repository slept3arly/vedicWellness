"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { purgeGlobalCache } from "@/app/(admin)/admin/systemActions";
import AdminButton from "./AdminButton";
import { RefreshCw } from "lucide-react";

export default function PurgeCacheButton() {
  const [isPending, startTransition] = useTransition();

  const handlePurge = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        await purgeGlobalCache(formData);
        toast.success("Global cache purged successfully");
      } catch (err) {
        toast.error("Failed to purge global cache");
      }
    });
  };

  return (
    <AdminButton
      onClick={handlePurge}
      disabled={isPending}
      variant="danger"
      className="w-full flex items-center justify-center gap-2 mt-4"
    >
      <RefreshCw className={isPending ? "animate-spin" : ""} size={18} />
      {isPending ? "Purging..." : "Purge Global Cache"}
    </AdminButton>
  );
}
