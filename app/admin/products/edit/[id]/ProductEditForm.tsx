"use client";

import { useState } from "react";
import R2Upload from "@/components/R2Upload";
import { updateProduct } from "../../serverActions";

export default function ProductEditForm({ product }: { product: any }) {
  const [imageUrl, setImageUrl] = useState(product.imageUrl ?? "");

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>Edit Product</h1>

      <form
        action={updateProduct}
        style={{ marginTop: 18, display: "grid", gap: 12 }}
      >
        <input type="hidden" name="id" value={product.id} />

        {/* for deleting old image */}
        <input type="hidden" name="oldImageUrl" value={product.imageUrl ?? ""} />

        {/* real imageUrl submitted */}
        <input type="hidden" name="imageUrl" value={imageUrl} />

        <input name="name" defaultValue={product.name} required />
        <input name="slug" defaultValue={product.slug} required />

        <div>
          <p style={{ marginBottom: 8, fontWeight: 600 }}>Product Image</p>
          <R2Upload folder="products" onUploaded={setImageUrl} />
          {imageUrl ? (
            <a href={imageUrl} target="_blank" style={{ fontSize: 12 }}>
              View current image
            </a>
          ) : null}
        </div>

        <input
          name="price"
          defaultValue={product.price ?? ""}
          inputMode="decimal"
        />

        <textarea
          name="description"
          defaultValue={product.description ?? ""}
          rows={5}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            name="published"
            defaultChecked={product.published}
          />
          Published (visible on website)
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
