"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadToR2 } from "@/lib/client/uploadToR2";

export default function SlideImagesField({
  desktopUrl,
  setDesktopUrl,
  mobileUrl,
  setMobileUrl,
}: {
  desktopUrl: string;
  setDesktopUrl: (u: string) => void;
  mobileUrl: string;
  setMobileUrl: (u: string) => void;
}) {
  const desktopRef = useRef<HTMLInputElement | null>(null);
  const mobileRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File, type: "desktop" | "mobile") {
    setError(null);
    setBusy(true);
    try {
      const url = await uploadToR2(file, "banners");
      if (type === "desktop") setDesktopUrl(url);
      else setMobileUrl(url);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setBusy(false);
      if (desktopRef.current) desktopRef.current.value = "";
      if (mobileRef.current) mobileRef.current.value = "";
    }
  }

  return (
    <div className="rounded-xl border border-neutral-300 dark:border-neutral-700 p-5 space-y-6">

      <h3 className="font-heading">Slide Images</h3>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Desktop */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Desktop (16:9)</p>

          <input
            ref={desktopRef}
            type="file"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f, "desktop");
            }}
          />

          <div className="aspect-video rounded-xl overflow-hidden border bg-neutral-200 dark:bg-neutral-800 relative">
            {desktopUrl ? (
              <Image src={desktopUrl} alt="" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-neutral-500">
                No desktop image
              </div>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Mobile (4:5)</p>

          <input
            ref={mobileRef}
            type="file"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f, "mobile");
            }}
          />

          <div className="aspect-[4/5] rounded-xl overflow-hidden border bg-neutral-200 dark:bg-neutral-800 relative">
            {mobileUrl ? (
              <Image src={mobileUrl} alt="" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-neutral-500">
                No mobile image
              </div>
            )}
          </div>
        </div>

      </div>

      {busy && <p className="text-xs">Uploading…</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
