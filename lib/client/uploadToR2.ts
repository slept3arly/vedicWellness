const PRODUCT_ALLOWED_TYPES = new Set(["image/webp", "image/avif"]);
const PRODUCT_MAX_BYTES = 524_248;

function assertProductImage(file: File) {
  if (!PRODUCT_ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only .webp and .avif images are allowed.");
  }
  if (file.size > PRODUCT_MAX_BYTES) {
    throw new Error("Image too large. Max size is 250KB.");
  }
}

export async function uploadToR2(file: File, folder: string) {
  // ✅ client validation for products
  if (folder === "products") {
    assertProductImage(file);
  }

  const res = await fetch("/api/r2/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      folder,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to get upload URL");

  const { uploadUrl, publicUrl } = data;

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error("Upload failed");

  return publicUrl as string;
}

// ✅ NEW helper: multiple upload
export async function uploadManyToR2(files: File[], folder: string) {
  const urls: string[] = [];
  for (const f of files) {
    urls.push(await uploadToR2(f, folder));
  }
  return urls;
}
