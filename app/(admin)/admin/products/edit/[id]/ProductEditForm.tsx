"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { updateProduct } from "../../serverActions";
import ProductImagesField from "@/components/admin/ProductImagesField";

type MedicineForm =
  | "TABLET"
  | "CAPSULE"
  | "SYRUP"
  | "DROPS"
  | "SUSPENSION"
  | "POWDER"
  | "GRANULES"
  | "OINTMENT"
  | "CREAM"
  | "GEL"
  | "LOTION"
  | "SHAMPOO"
  | "OIL"
  | "SPRAY"
  | "INHALER"
  | "INJECTION"
  | "OTHER"
  | "";

function listToTextarea(v: any): string {
  if (!v) return "";
  if (Array.isArray(v)) return v.join("\n");
  return String(v);
}

function packagingHint(form: MedicineForm) {
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

export default function ProductEditForm({ product }: { product: any }) {
  const [coverUrl, setCoverUrl] = useState<string>(product.imageUrl ?? "");
  const [gallery, setGallery] = useState<string[]>(
    Array.isArray(product.gallery) ? product.gallery : []
  );

  const [medicineForm, setMedicineForm] = useState<MedicineForm>(
    (product.medicineForm as MedicineForm) ?? ""
  );

  const packagingTextDefault = useMemo(() => {
    // packaging stored in Json? (we store as array of lines)
    if (Array.isArray(product.packaging)) return product.packaging.join("\n");
    if (typeof product.packaging === "string") return product.packaging;
    return "";
  }, [product.packaging]);

  const indicationsText = useMemo(
    () => listToTextarea(product.indications),
    [product.indications]
  );
  const ingredientsText = useMemo(
    () => listToTextarea(product.ingredients),
    [product.ingredients]
  );
  const directionsText = useMemo(
    () => listToTextarea(product.directionsToUse),
    [product.directionsToUse]
  );
  const contraindicationsText = useMemo(
    () => listToTextarea(product.contraindications),
    [product.contraindications]
  );

  const packagingPlaceholder = useMemo(
    () => packagingHint(medicineForm),
    [medicineForm]
  );

  return (
    <div style={{ padding: 24, maxWidth: 980 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Edit Product</h1>
          <p style={{ marginTop: 6, opacity: 0.7 }}>
            Updates affect public product listing and detail page.
          </p>
        </div>

        <Link href="/admin/products" style={{ alignSelf: "center" }}>
          ← Back
        </Link>
      </div>

      <form
        action={updateProduct}
        style={{ marginTop: 18, display: "grid", gap: 12 }}
      >
        {/* ids */}
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="oldImageUrl" value={product.imageUrl ?? ""} />

        {/* images stored in hidden fields */}
        <input type="hidden" name="imageUrl" value={coverUrl} />
        <input type="hidden" name="gallery" value={gallery.join("\n")} />

        {/* basic */}
        <input
          name="name"
          defaultValue={product.name}
          placeholder="Product name"
          required
        />
        <input
          name="slug"
          defaultValue={product.slug}
          placeholder="Slug (hair-oil)"
          required
        />
        <input
          name="tag"
          defaultValue={product.tag ?? ""}
          placeholder='Tag (e.g. "Best Seller")'
        />

        {/* ✅ image uploader */}
        <ProductImagesField
          coverUrl={coverUrl}
          setCoverUrl={setCoverUrl}
          gallery={gallery}
          setGallery={setGallery}
        />

        {/* ✅ price required */}
        <input
          name="price"
          defaultValue={product.price ?? ""}
          placeholder="Selling price (₹)"
          inputMode="numeric"
          required
        />

        {/* ✅ short description only */}
        <textarea
          name="shortDescription"
          defaultValue={product.shortDescription ?? ""}
          placeholder="Short description (1–2 lines)"
          rows={3}
        />

        {/* ✅ dosage form dropdown */}
        <select
          name="medicineForm"
          value={medicineForm}
          onChange={(e) => setMedicineForm(e.target.value as MedicineForm)}
          required
        >
          <option value="">Dosage form</option>
          <option value="TABLET">Tablet</option>
          <option value="CAPSULE">Capsule</option>
          <option value="SYRUP">Syrup</option>
          <option value="DROPS">Drops</option>
          <option value="SUSPENSION">Suspension</option>
          <option value="POWDER">Powder</option>
          <option value="GRANULES">Granules</option>
          <option value="OINTMENT">Ointment</option>
          <option value="CREAM">Cream</option>
          <option value="GEL">Gel</option>
          <option value="LOTION">Lotion</option>
          <option value="SHAMPOO">Shampoo</option>
          <option value="OIL">Oil</option>
          <option value="SPRAY">Spray</option>
          <option value="INHALER">Inhaler</option>
          <option value="INJECTION">Injection</option>
          <option value="OTHER">Other</option>
        </select>

        {/* ✅ packaging (guided) */}
        <textarea
          name="packagingText"
          defaultValue={packagingTextDefault}
          placeholder={`Packaging details (guided)\n${packagingPlaceholder}`}
          rows={4}
        />

        {/* ✅ sections with guidance */}
        <textarea
          name="indications"
          defaultValue={indicationsText}
          placeholder={`Indications (one per line)\n• Helps in fever\n• Relieves headache & body ache\n• Useful in cold & flu`}
          rows={5}
        />

        <textarea
          name="ingredients"
          defaultValue={ingredientsText}
          placeholder={`Ingredients (one per line)\n• Giloy\n• Neem\n• Tulsi\n• Ashwagandha`}
          rows={5}
        />

        <textarea
          name="directionsToUse"
          defaultValue={directionsText}
          placeholder={`Directions to use (one per line)\n• 2 tsp twice daily\n• Or as directed by physician`}
          rows={4}
        />

        <textarea
          name="contraindications"
          defaultValue={contraindicationsText}
          placeholder={`Contraindications / Precautions (one per line)\n• Pregnant women consult doctor\n• Do not exceed recommended dose`}
          rows={4}
        />

        {/* published */}
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" name="published" defaultChecked={product.published} />
          Published
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">Save Changes</button>
          <Link href="/admin/products">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
