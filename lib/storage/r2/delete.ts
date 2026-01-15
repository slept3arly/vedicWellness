import "server-only";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/storage/r2/client";

/**
 * Deletes an object from R2 given a key like:
 * products/uuid.jpg
 */
export async function deleteFromR2(key: string) {
  if (!key) return;

  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    })
  );
}

/**
 * Extracts key from a full public public URL:
 * https://pub-xxxx.r2.dev/products/uuid.jpg -> products/uuid.jpg
 */
export function getR2KeyFromPublicUrl(url: string) {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\/+/, "");
  } catch {
    return null;
  }
}
