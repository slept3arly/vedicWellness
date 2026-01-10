import Link from "next/link";
import { createProduct } from "../serverActions";

export default function NewProductPage() {
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
        <input name="imageUrl" placeholder="Image URL (optional)" />

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
