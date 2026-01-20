"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadManyToR2, uploadToR2 } from "@/lib/client/uploadToR2";

const MAX_BYTES = 512_000; // ✅ 512 KB
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
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCoverPick(file: File) {
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
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  }

  async function onGalleryPick(files: FileList) {
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
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  }

  function removeGallery(i: number) {
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
    <div style={{ border: "1px solid #2a2a2a", padding: 14, borderRadius: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <b>Product Images</b>
        <span style={{ fontSize: 12, opacity: 0.75 }}>
          Only .webp/.avif — max 512KB
        </span>
      </div>

      {/* Cover */}
      <div style={{ marginTop: 12 }}>
        <b style={{ fontSize: 13 }}>Cover image</b>

        <div style={{ marginTop: 8, display: "grid", gap: 10 }}>
          <input
            ref={coverInputRef}
            type="file"
            accept={ACCEPT}
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onCoverPick(f);
            }}
          />

          {coverUrl ? (
            <div style={{ position: "relative", width: 220, height: 220, borderRadius: 12, overflow: "hidden" }}>
              <Image src={coverUrl} alt="Cover image" fill className="object-cover" />
            </div>
          ) : (
            <p style={{ fontSize: 12, opacity: 0.7 }}>No cover uploaded</p>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div style={{ marginTop: 18 }}>
        <b style={{ fontSize: 13 }}>Gallery images (upload multiple)</b>

        <div style={{ marginTop: 8 }}>
          <input
            ref={galleryInputRef}
            type="file"
            accept={ACCEPT}
            multiple
            disabled={busy}
            onChange={(e) => {
              const files = e.target.files;
              if (files?.length) onGalleryPick(files);
            }}
          />
        </div>

        {gallery.length ? (
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
            {gallery.map((url, i) => (
              <div key={url + i} style={{ border: "1px solid #2a2a2a", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ position: "relative", width: "100%", height: 110 }}>
                  <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: 8, gap: 6 }}>
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0}>
                    ↑
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === gallery.length - 1}>
                    ↓
                  </button>
                  <button type="button" onClick={() => removeGallery(i)}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
            No gallery images uploaded
          </p>
        )}
      </div>

      {busy ? <p style={{ marginTop: 10 }}>Uploading…</p> : null}
      {error ? <p style={{ marginTop: 10, color: "red" }}>{error}</p> : null}
    </div>
  );
}
