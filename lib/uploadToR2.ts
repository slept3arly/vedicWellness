export async function uploadToR2(file: File, folder: string) {
  // 1) get signed url from backend (UUID generated there)
  const res = await fetch("/api/r2/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      folder,
    }),
  });

  if (!res.ok) throw new Error("Failed to get upload URL");

  const { uploadUrl, publicUrl } = await res.json();

  // 2) upload file directly to R2
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error("Upload failed");

  return publicUrl as string;
}
