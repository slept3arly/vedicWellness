"use client";

import { useRef, useState } from "react";
import { uploadManyToR2, uploadToR2 } from "@/lib/client/uploadToR2";

export default function ProductImageUploader({
  coverUrl,
  onCoverChange,
  gallery,
  onGalleryChange,
}: {
  coverUrl: string;
  onCoverChange: (url: string) => void;
  gallery: string[];
  onGalleryChange: (urls: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const coverRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  async function uploadCover(file: File) {
    setBusy(true);
    try {
      const url = await uploadToR2(file, "products");
      onCoverChange(url);
    } finally {
      setBusy(false);
    }
  }

  async function uploadGallery(files: FileList) {
    setBusy(true);
    try {
      const urls = await uploadManyToR2(Array.from(files), "products");
      onGalleryChange([...gallery, ...urls]);
    } finally {
      setBusy(false);
    }
  }

  function removeAt(i: number) {
    onGalleryChange(gallery.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= gallery.length) return;
    const copy = [...gallery];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onGalleryChange(copy);
  }

  return (
    <div style={{ border: "1px solid #2a2a2a", borderRadius: 14, padding: 14 }}>
      <h3 style={{ fontWeight: 800 }}>Product Images</h3>
      <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
        Only <b>.webp</b> or <b>.avif</b> allowed. Max size: <b>250KB</b> per image.
      </p>

      {/* cover */}
      <div style={{ marginTop: 14 }}>
        <b>Cover image</b>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <input
            ref={coverRef}
            type="file"
            accept="image/webp,image/avif"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadCover(f);
              if (coverRef.current) coverRef.current.value = "";
            }}
          />
          {coverUrl ? (
            <a href={coverUrl} target="_blank" style={{ fontSize: 12 }}>
              View cover
            </a>
          ) : (
            <span style={{ fontSize: 12, opacity: 0.7 }}>No cover</span>
          )}
        </div>
      </div>

      {/* gallery */}
      <div style={{ marginTop: 18 }}>
        <b>Gallery images</b>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <input
            ref={galleryRef}
            type="file"
            accept="image/webp,image/avif"
            multiple
            disabled={busy}
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length) uploadGallery(files);
              if (galleryRef.current) galleryRef.current.value = "";
            }}
          />
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            Upload multiple images at once
          </span>
        </div>

        {gallery.length > 0 ? (
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {gallery.map((url, i) => (
              <div
                key={url + i}
                style={{
                  border: "1px solid #2a2a2a",
                  borderRadius: 12,
                  padding: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <a href={url} target="_blank" style={{ fontSize: 12 }}>
                    {url}
                  </a>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0}>
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === gallery.length - 1}
                    >
                      ↓
                    </button>
                    <button type="button" onClick={() => removeAt(i)}>
                      Remove
                    </button>
                  </div>
                </div>

                <span style={{ fontSize: 12, opacity: 0.7 }}>#{i + 1}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 12, opacity: 0.7, marginTop: 10 }}>
            No gallery images yet
          </p>
        )}
      </div>

      {busy ? <p style={{ marginTop: 12 }}>Uploading…</p> : null}
    </div>
  );
}
