"use client";

import { useRef, useState } from "react";

type Folder = "products" | "blogs" | "banners" | "categories";

export default function R2Upload({
  folder,
  onUploaded,
  label = "Drop image here or click to upload",
}: {
  folder: Folder;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      // 1) Ask backend for signed upload URL (UUID generated server-side)
      const res = await fetch("/api/r2/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          folder,
        }),
      });

      if (!res.ok) throw new Error("Failed to get upload url");
      const { uploadUrl, publicUrl } = await res.json();

      // 2) Upload to R2
      const up = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!up.ok) throw new Error("Upload failed");

      setUploadedUrl(publicUrl);
      onUploaded(publicUrl);
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) uploadFile(file);
        }}
        style={{
          border: "2px dashed #2a2a2a",
          padding: 18,
          borderRadius: 14,
          cursor: "pointer",
          userSelect: "none",
          opacity: uploading ? 0.6 : 1,
        }}
      >
        <b>{label}</b>
        <div style={{ marginTop: 6, opacity: 0.7, fontSize: 13 }}>
          PNG/JPG/WebP recommended. (Upload goes to R2)
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{
            width: 240,
            borderRadius: 14,
            border: "1px solid #222",
          }}
        />
      )}

      {uploading && <p>Uploading...</p>}

      {uploadedUrl && (
        <p style={{ fontSize: 12, opacity: 0.7 }}>
          Uploaded ✅
        </p>
      )}
    </div>
  );
}
