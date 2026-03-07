"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadManyToR2, uploadToR2 } from "@/lib/client/uploadToR2";
import AdminCard from "@/components/admin/AdminCard";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { toast } from "@/lib/toast";

const MAX_BYTES = 512_000;
const ACCEPT = "image/webp,image/avif";

function validate(file: File) {
  if (!["image/webp", "image/avif"].includes(file.type))
    throw new Error("Only .webp or .avif allowed.");
  if (file.size > MAX_BYTES)
    throw new Error(`File too large — max 512 KB (got ${(file.size / 1024).toFixed(0)} KB).`);
}

const labelCls =
  "block mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

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
  const coverRef   = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleCover(file: File) {
    setBusy(true);
    try {
      validate(file);
      setCoverUrl(await uploadToR2(file, "products"));
      toast.success("Cover image uploaded.");
    } catch (e: any) {
      toast.error("Upload failed", e?.message);
    } finally {
      setBusy(false);
      if (coverRef.current) coverRef.current.value = "";
    }
  }

  async function handleGallery(files: FileList) {
    setBusy(true);
    try {
      const list = Array.from(files);
      list.forEach(validate);
      const urls = await uploadManyToR2(list, "products");
      setGallery([...gallery, ...urls]);
      toast.success(
        `${urls.length} image${urls.length > 1 ? "s" : ""} added to gallery.`
      );
    } catch (e: any) {
      toast.error("Upload failed", e?.message);
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
    <AdminCard>
      <div className="mb-5 pb-4 border-b border-border">
        <div>
          <SectionHeading 
            title="Product Images" 
            subtitle="Only .webp or .avif — max 512 KB per file" 
          />
        </div>
        {busy && (
          <span className="text-xs text-muted-foreground animate-pulse">Uploading…</span>
        )}
      </div>

      {/* single row: cover + divider + gallery */}
      <div className="flex items-start gap-4 overflow-x-auto pb-1">

        {/* Cover tile */}
        <div className="shrink-0 space-y-1.5">
          <p className={labelCls}>Cover</p>
          <div className="relative w-36 h-36 rounded-lg overflow-hidden border border-border bg-muted">
            {coverUrl ? (
              <Image src={coverUrl} alt="Cover preview" fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <label
              htmlFor="cover-upload"
              className={`inline-flex h-7 cursor-pointer items-center rounded-md border border-border bg-background px-2.5 text-xs text-foreground transition-colors hover:bg-muted focus-within:ring-2 focus-within:ring-ring ${busy ? "pointer-events-none opacity-50" : ""}`}
            >
              {coverUrl ? "Replace" : "Upload"}
              <input
                id="cover-upload" ref={coverRef} type="file" accept={ACCEPT}
                disabled={busy} className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCover(f); }}
              />
            </label>
            {coverUrl && (
              <button type="button" onClick={() => setCoverUrl("")}
                className="inline-flex h-7 items-center rounded-md px-2.5 text-xs text-destructive hover:opacity-70 transition-opacity focus:outline-none">
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="self-stretch w-px bg-border shrink-0 mt-6" />

        {/* Gallery */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center gap-3">
            <p className={labelCls}>Gallery</p>
            <label
              htmlFor="gallery-upload"
              className={`inline-flex h-6 cursor-pointer items-center rounded-md border border-border bg-background px-2.5 text-xs text-foreground transition-colors hover:bg-muted focus-within:ring-2 focus-within:ring-ring ${busy ? "pointer-events-none opacity-50" : ""}`}
            >
              + Add
              <input
                id="gallery-upload" ref={galleryRef} type="file" accept={ACCEPT}
                multiple disabled={busy} className="sr-only"
                onChange={(e) => { if (e.target.files?.length) handleGallery(e.target.files); }}
              />
            </label>
          </div>

          {gallery.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {gallery.map((url, i) => (
                <div key={url + i} className="shrink-0 w-36 rounded-lg overflow-hidden border border-border bg-muted">
                  <div className="relative w-36 h-36">
                    <Image src={url} alt={`Gallery image ${i + 1}`} fill className="object-cover" />
                  </div>
                  <div className="flex items-center justify-between px-2 py-1.5 border-t border-border bg-background/80 backdrop-blur-sm">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                        className="h-6 w-6 rounded text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-opacity focus:outline-none"
                        aria-label="Move left">←</button>
                      <button type="button" onClick={() => move(i, 1)} disabled={i === gallery.length - 1}
                        className="h-6 w-6 rounded text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-opacity focus:outline-none"
                        aria-label="Move right">→</button>
                    </div>
                    <button type="button" onClick={() => remove(i)}
                      className="h-6 w-6 rounded text-xs text-destructive hover:opacity-70 transition-opacity focus:outline-none"
                      aria-label={`Remove image ${i + 1}`}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground pt-1">No gallery images yet.</p>
          )}
        </div>

      </div>
    </AdminCard>
  );
}