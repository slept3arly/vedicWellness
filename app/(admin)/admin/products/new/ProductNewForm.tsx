"use client";

import Link from "next/link";
import { useState } from "react";
import { createProduct } from "../serverActions";
import R2Upload from "@/components/R2Upload";

export default function ProductNewForm() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Add Product</h1>
      <p style={{ opacity: 0.7 }}>Create a new product for the website.</p>

      <form
        action={createProduct}
        style={{
          marginTop: 18,
          display: "grid",
          gap: 12,
        }}
      >
        <input name="name" placeholder="Product name" required />
        <input name="slug" placeholder="Slug (example: hair-oil)" required />

        {/* ✅ hidden input to send imageUrl to server action */}
        <input type="hidden" name="imageUrl" value={imageUrl} />

        <div>
          <p style={{ marginBottom: 8, fontWeight: 600 }}>Product Image</p>
          <R2Upload folder="products" onUploaded={setImageUrl} />
          {imageUrl ? (
            <a href={imageUrl} target="_blank" style={{ fontSize: 12 }}>
              View uploaded image
            </a>
          ) : null}
        </div>

        <input
          name="price"
          placeholder="Price (optional, number)"
          inputMode="decimal"
        />

        <textarea
          name="description"
          placeholder="Short description (optional)"
          rows={5}
        />

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input name="published" type="checkbox" defaultChecked />
          Published
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">Create</button>
          <Link href="/admin/products">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
