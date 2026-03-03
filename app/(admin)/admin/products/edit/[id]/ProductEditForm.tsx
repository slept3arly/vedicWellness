"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { updateProduct } from "../../serverActions";
import ProductImagesField from "@/components/admin/ProductImagesField";
import { MedicineForm, Product, ProductVariant } from "@prisma/client";

/* -------------------------------------------------- */

function listToTextarea(v: unknown): string {
  if (!v) return "";
  if (Array.isArray(v)) return v.join("\n");
  return String(v);
}

function packagingHint(form: MedicineForm | "") {
  if (form === "TABLET" || form === "CAPSULE")
    return "Example:\nTablets per strip: 10\nStrips per box: 20";
  if (form === "SYRUP" || form === "SUSPENSION")
    return "Example:\nBottle size (ml): 200";
  if (form === "OINTMENT" || form === "CREAM" || form === "GEL")
    return "Example:\nTube size (gm): 30";
  if (form === "OIL" || form === "SHAMPOO" || form === "LOTION")
    return "Example:\nBottle size (ml): 100";
  return "Example:\nPack size: 1\nUnit: bottle/box/strip";
}

/* -------------------------------------------------- */

export default function ProductEditForm({
  product,
}: {
  product: Product & { variants?: ProductVariant[] };
}) {
  const [coverUrl, setCoverUrl] = useState(product.imageUrl ?? "");
  const [gallery, setGallery] = useState<string[]>(
    Array.isArray(product.gallery) ? product.gallery : []
  );

  const [medicineForm, setMedicineForm] = useState<
    MedicineForm | ""
  >(product.medicineForm ?? "");

  const [variants, setVariants] = useState<ProductVariant[]>(
    product.variants ?? []
  );

  /* -------------------------------------------------- */
  /* Variant Handlers                                   */
  /* -------------------------------------------------- */

  function addVariant() {
    setVariants([
      ...variants,
      {
        id: "",
        productId: product.id,
        name: "",
        price: 0,
        compareAtPrice: null,
        stock: 0,
        sku: null,
      },
    ]);
  }

  function updateVariant(
    index: number,
    field: keyof ProductVariant,
    value: any
  ) {
    const updated = [...variants];
    (updated[index] as any)[field] = value;
    setVariants(updated);
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index));
  }

  const packagingPlaceholder = useMemo(
    () => packagingHint(medicineForm),
    [medicineForm]
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Updates affect public product listing and detail page.
          </p>
        </div>

        <Link href="/admin/products" className="text-sm">
          ← Back
        </Link>
      </div>

      <form action={updateProduct} className="space-y-6">
        {/* Hidden Fields */}
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="imageUrl" value={coverUrl} />
        <input
          type="hidden"
          name="galleryText"
          value={gallery.join("\n")}
        />
        <input
          type="hidden"
          name="variantsJson"
          value={JSON.stringify(variants)}
        />

        {/* Core */}
        <div className="grid md:grid-cols-2 gap-4">
          <input name="name" defaultValue={product.name} required />
          <input name="slug" defaultValue={product.slug} required />
          <input
            name="subtitle"
            defaultValue={product.subtitle ?? ""}
            placeholder="Subtitle"
          />
          <input
            name="tag"
            defaultValue={product.tag ?? ""}
          />
        </div>

        {/* Pricing */}
        <div className="grid md:grid-cols-3 gap-4">
          <input
            name="price"
            defaultValue={product.price}
            required
          />
          <input
            name="compareAtPrice"
            defaultValue={product.compareAtPrice ?? ""}
          />
          <input
            name="stock"
            defaultValue={product.stock}
            required
          />
        </div>

        {/* Variants */}
        <Section title="Variants">
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg grid md:grid-cols-5 gap-3"
              >
                <input
                  placeholder="Variant name"
                  value={variant.name}
                  onChange={(e) =>
                    updateVariant(index, "name", e.target.value)
                  }
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) =>
                    updateVariant(index, "price", Number(e.target.value))
                  }
                />

                <input
                  type="number"
                  placeholder="Compare price"
                  value={variant.compareAtPrice ?? ""}
                  onChange={(e) =>
                    updateVariant(
                      index,
                      "compareAtPrice",
                      e.target.value
                        ? Number(e.target.value)
                        : null
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) =>
                    updateVariant(index, "stock", Number(e.target.value))
                  }
                />

                <input
                  placeholder="SKU"
                  value={variant.sku ?? ""}
                  onChange={(e) =>
                    updateVariant(index, "sku", e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-500 col-span-full text-left"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="px-4 py-2 border rounded-lg"
            >
              + Add Variant
            </button>
          </div>
        </Section>

        {/* Images */}
        <ProductImagesField
          coverUrl={coverUrl}
          setCoverUrl={setCoverUrl}
          gallery={gallery}
          setGallery={setGallery}
        />

        {/* Descriptions */}
        <textarea
          name="shortDescription"
          defaultValue={product.shortDescription ?? ""}
          rows={3}
        />

        <textarea
          name="longDescription"
          defaultValue={product.longDescription ?? ""}
          rows={5}
        />

        {/* Structured Content */}
        <Section title="Highlights">
          <textarea
            name="highlights"
            defaultValue={listToTextarea(product.highlights)}
            rows={4}
          />
        </Section>

        <Section title="Benefits">
          <textarea
            name="benefits"
            defaultValue={listToTextarea(product.benefits)}
            rows={4}
          />
        </Section>

        <Section title="Who Should Use">
          <textarea
            name="whoShouldUse"
            defaultValue={listToTextarea(product.whoShouldUse)}
            rows={4}
          />
        </Section>

        <Section title="Ingredients">
          <textarea
            name="ingredients"
            defaultValue={listToTextarea(product.ingredients)}
            rows={4}
          />
        </Section>

        <Section title="Directions">
          <textarea
            name="directionsToUse"
            defaultValue={listToTextarea(product.directionsToUse)}
            rows={4}
          />
        </Section>

        <Section title="Precautions">
          <textarea
            name="precautions"
            defaultValue={listToTextarea(product.precautions)}
            rows={4}
          />
        </Section>

        {/* Dosage Form */}
        <select
          name="medicineForm"
          value={medicineForm}
          onChange={(e) =>
            setMedicineForm(e.target.value as MedicineForm)
          }
          required
        >
          <option value="">Dosage form</option>
          {Object.values(MedicineForm).map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* Packaging */}
        <textarea
          name="packagingText"
          defaultValue={listToTextarea(product.packaging)}
          placeholder={packagingPlaceholder}
          rows={4}
        />

        {/* Technical Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="manufacturer"
            defaultValue={product.manufacturer ?? ""}
          />
          <input
            name="countryOfOrigin"
            defaultValue={product.countryOfOrigin ?? "India"}
          />
          <input
            name="shelfLife"
            defaultValue={product.shelfLife ?? ""}
          />
          <input
            name="netQuantity"
            defaultValue={product.netQuantity ?? ""}
          />
        </div>

        {/* Trust */}
        <Section title="Trust Badges">
          <textarea
            name="trustBadges"
            defaultValue={listToTextarea(product.trustBadges)}
            rows={3}
          />
        </Section>

        <Section title="Certifications">
          <textarea
            name="certifications"
            defaultValue={listToTextarea(product.certifications)}
            rows={3}
          />
        </Section>

        {/* Publish */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            defaultChecked={product.published}
          />
          Published
        </label>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            Save Changes
          </button>

          <Link
            href="/admin/products"
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

/* -------------------------------------------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">{title}</h3>
      {children}
    </div>
  );
}