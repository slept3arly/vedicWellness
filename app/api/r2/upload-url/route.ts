import "server-only";

import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

import { r2 } from "@/lib/storage/r2/client";
import { auth } from "@/auth";

import { secureMutation } from "@/lib/security/secureMutation";

type Folder = "products" | "blogs" | "banners" | "categories";

const RULES: Record<
  Folder,
  {
    allowedTypes: Set<string>;
    allowedExt: Set<string>;
    maxBytes: number;
    cacheControl: string;
  }
> = {
  products: {
    allowedTypes: new Set(["image/webp", "image/avif"]),
    allowedExt: new Set(["webp", "avif"]),
    maxBytes: 2 * 1024 * 1024,
    cacheControl: "public, max-age=3600",
  },
  blogs: {
    allowedTypes: new Set(["image/webp", "image/avif", "image/jpeg", "image/png"]),
    allowedExt: new Set(["webp", "avif", "jpg", "jpeg", "png"]),
    maxBytes: 4 * 1024 * 1024,
    cacheControl: "public, max-age=3600",
  },
  banners: {
    allowedTypes: new Set(["image/webp", "image/avif", "image/jpeg", "image/png"]),
    allowedExt: new Set(["webp", "avif", "jpg", "jpeg", "png"]),
    maxBytes: 6 * 1024 * 1024,
    cacheControl: "public, max-age=3600",
  },
  categories: {
    allowedTypes: new Set(["image/webp", "image/avif", "image/jpeg", "image/png"]),
    allowedExt: new Set(["webp", "avif", "jpg", "jpeg", "png"]),
    maxBytes: 2 * 1024 * 1024,
    cacheControl: "public, max-age=3600",
  },
};

function getExt(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

export async function POST(req: Request) {
  try {
    // 🔒 CSRF + rate limit (r2UploadUrl)
    await secureMutation(req, {
      limit: "r2UploadUrl",
      keyPrefix: "r2-upload-url",
    });

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as
      | {
          fileName?: string;
          contentType?: string;
          folder?: Folder;
          size?: number;
        }
      | null;

    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const fileName = body.fileName?.trim() || "";
    const contentType = body.contentType?.trim() || "";
    const folder = body.folder;
    const size = body.size;

    if (!fileName || !contentType || !folder || typeof size !== "number") {
      return NextResponse.json(
        { error: "Missing fields (fileName, contentType, folder, size required)" },
        { status: 400 }
      );
    }

    const rules = RULES[folder];
    if (!rules) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }

    if (contentType === "image/svg+xml" || contentType.startsWith("text/")) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const ext = getExt(fileName);
    if (!rules.allowedTypes.has(contentType) || !rules.allowedExt.has(ext)) {
      return NextResponse.json(
        { error: `Invalid file type for ${folder}` },
        { status: 400 }
      );
    }

    if (size <= 0 || size > rules.maxBytes) {
      return NextResponse.json(
        { error: `File too large. Max ${(rules.maxBytes / (1024 * 1024)).toFixed(0)}MB` },
        { status: 400 }
      );
    }

    const key = `${folder}/${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
      CacheControl: rules.cacheControl,
    });

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 60 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (err: any) {
    const status = typeof err?.status === "number" ? err.status : 500;
    const msg =
      err?.message === "RATE_LIMITED"
        ? "Too many upload requests. Try again later."
        : "Failed to generate upload URL";

    return NextResponse.json({ error: msg }, { status });
  }
}
