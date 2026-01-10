import { prisma } from "@/lib/prisma";
import { updateProduct } from "../../serverActions";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findFirst({
    where: { id: params.id },
  });

  if (!product) return <div>Product not found.</div>;

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>Edit Product</h1>

      <form
        action={updateProduct}
        style={{ marginTop: 18, display: "grid", gap: 12 }}
      >
        <input type="hidden" name="id" value={product.id} />

        <input name="name" defaultValue={product.name} required />
        <input name="slug" defaultValue={product.slug} required />
        <input name="imageUrl" defaultValue={product.imageUrl ?? ""} />
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
