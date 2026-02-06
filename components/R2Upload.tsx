"use client";

import { useRef, useState } from "react";
import { uploadManyToR2, uploadToR2 } from "@/lib/client/uploadToR2";

type Folder = "products" | "blogs" | "banners" | "categories";

type Props = {
  folder: Folder;
  onUploaded?: (url: string) => void;
  onUploadedMany?: (urls: string[]) => void;
  label?: string;
  accept?: string; // "image/webp,image/*"
  maxBytes?: number;
  multiple?: boolean;
};

const MAX_BATCH = 20;

export default function R2Upload({
  folder,
  onUploaded,
  onUploadedMany,
  label = "Upload file",
  accept,
  maxBytes,
  multiple = false,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function matchesMime(allowed: string[], type: string) {
    return allowed.some((a) =>
      a === type ||
      (a.endsWith("/*") && type.startsWith(a.slice(0, -1)))
    );
  }

  function validateFile(file: File) {
    if (accept) {
      const allowed = accept.split(",").map((x) => x.trim());
      if (!matchesMime(allowed, file.type)) {
        throw new Error(`Invalid file type. Allowed: ${allowed.join(", ")}`);
      }
    }

    if (maxBytes && file.size > maxBytes) {
      throw new Error(`File too large. Max ${Math.round(maxBytes / 1024)}KB`);
    }
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErr(null);
    const files = e.target.files;

    try {
      if (!files || files.length === 0) return;

      if (multiple && files.length > MAX_BATCH) {
        throw new Error(`Max ${MAX_BATCH} files at once`);
      }

      setBusy(true);

      if (!multiple) {
        const file = files[0];
        validateFile(file);

        const url = await uploadToR2(file, folder);
        onUploaded?.(url);
        return;
      }

      const list = Array.from(files);
      list.forEach(validateFile);

      const urls = await uploadManyToR2(list, folder);
      onUploadedMany?.(urls);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErr(error.message);
      } else {
        setErr("Upload failed");
      }
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          cursor: busy ? "not-allowed" : "pointer",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={busy}
          onChange={handleChange}
        />
        <span style={{ fontSize: 12, opacity: 0.8 }}>
          {busy ? "Uploading..." : label}
        </span>
      </div>

      {err && (
        <p style={{ color: "red", fontSize: 12 }}>
          {err}
        </p>
      )}
    </div>
  );
}
