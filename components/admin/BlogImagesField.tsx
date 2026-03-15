"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadToR2 } from "@/lib/client/uploadToR2";

export default function BlogImageField({
  thumbnailUrl,
  setThumbnailUrl,
}: {
  thumbnailUrl: string;
  setThumbnailUrl: (u: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(file: File) {
    setError(null);
    setBusy(true);
    try {
      const url = await uploadToR2(file, "blogs");
      setThumbnailUrl(url);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-xl border border-neutral-300 dark:border-neutral-700 p-5 space-y-4">

      <h3 className="font-heading">Thumbnail Image</h3>

      <input
        ref={inputRef}
        type="file"
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
        }}
      />

      <div className="w-64 h-40 rounded-xl overflow-hidden border bg-neutral-200 dark:bg-neutral-800 relative">
        {thumbnailUrl ? (
          <Image src={thumbnailUrl} alt="" fill sizes="256px" className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-neutral-500">
            No thumbnail uploaded
          </div>
        )}
      </div>

      {busy && <p className="text-xs">Uploading…</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
