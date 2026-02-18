"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadManyToR2, uploadToR2 } from "@/lib/client/uploadToR2";

const MAX_BYTES = 512_000;
const ACCEPT = "image/webp,image/avif";

function validate(file: File) {
  if (!["image/webp", "image/avif"].includes(file.type)) {
    throw new Error("Only .webp or .avif allowed.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be <= 512KB.");
  }
}

export default function ProductImagesField({
  coverUrl,
  setCoverUrl,
  gallery,
  setGallery,
}: {
  coverUrl: string;
  setCoverUrl: (u: string) => void;
  gallery: string[];
  setGallery: (g: string[]) => void;
}) {
  const coverRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCover(file: File) {
    setError(null);
    setBusy(true);
    try {
      validate(file);
      const url = await uploadToR2(file, "products");
      setCoverUrl(url);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setBusy(false);
      if (coverRef.current) coverRef.current.value = "";
    }
  }

  async function handleGallery(files: FileList) {
    setError(null);
    setBusy(true);
    try {
      const list = Array.from(files);
      list.forEach(validate);
      const urls = await uploadManyToR2(list, "products");
      setGallery([...gallery, ...urls]);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setBusy(false);
      if (galleryRef.current) galleryRef.current.value = "";
    }
  }

  function remove(i: number) {
    setGallery(gallery.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= gallery.length) return;
    const copy = [...gallery];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setGallery(copy);
  }

  return (
    <div className="rounded-xl border border-neutral-300 dark:border-neutral-700 p-5 space-y-6">

      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Product Images</h3>
        <span className="text-xs text-neutral-500">
          Only .webp/.avif — max 512KB
        </span>
      </div>

      {/* Cover */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Cover Image</p>

        <input
          ref={coverRef}
          type="file"
          accept={ACCEPT}
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleCover(f);
          }}
        />

        <div className="w-56 h-56 rounded-xl overflow-hidden border bg-neutral-200 dark:bg-neutral-800 relative">
          {coverUrl ? (
            <Image src={coverUrl} alt="Cover" fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-neutral-500">
              No cover uploaded
            </div>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Gallery Images</p>

        <input
          ref={galleryRef}
          type="file"
          accept={ACCEPT}
          multiple
          disabled={busy}
          onChange={(e) => {
            if (e.target.files?.length) handleGallery(e.target.files);
          }}
        />

        {gallery.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery.map((url, i) => (
              <div key={url + i} className="border rounded-xl overflow-hidden">
                <div className="relative w-full h-32">
                  <Image src={url} alt="" fill className="object-cover" />
                </div>

                <div className="flex justify-between p-2 text-xs">
                  <button type="button" onClick={() => move(i, -1)}>↑</button>
                  <button type="button" onClick={() => move(i, 1)}>↓</button>
                  <button type="button" onClick={() => remove(i)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-500">No gallery images uploaded</p>
        )}
      </div>

      {busy && <p className="text-xs">Uploading…</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
