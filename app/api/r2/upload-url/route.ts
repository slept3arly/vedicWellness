import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

import { r2 } from "@/lib/storage/r2/client";
import { auth } from "@/auth";

type Folder = "products" | "blogs" | "banners" | "categories";

const ALLOWED_PRODUCT_TYPES = new Set(["image/webp", "image/avif"]);
const ALLOWED_PRODUCT_EXT = new Set(["webp", "avif"]);

function getExt(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fileName, contentType, folder } = (await req.json()) as {
      fileName: string;
      contentType: string;
      folder: Folder;
    };

    if (!fileName || !contentType || !folder) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ✅ strict type validation for product images
    if (folder === "products") {
      const ext = getExt(fileName);
      if (!ALLOWED_PRODUCT_TYPES.has(contentType) || !ALLOWED_PRODUCT_EXT.has(ext)) {
        return NextResponse.json(
          { error: "Only .webp and .avif images are allowed for products." },
          { status: 400 }
        );
      }
    }

    const ext = getExt(fileName) || "webp";
    const key = `${folder}/${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
      CacheControl: "public, max-age=3600",
    });

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 60 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
