"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createProduct } from "../serverActions";
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
  | "OTHER";

function packagingHint(form: MedicineForm | "") {
  if (form === "TABLET" || form === "CAPSULE") return "Example:\nTablets per strip: 10\nStrips per box: 20";
  if (form === "SYRUP" || form === "SUSPENSION") return "Example:\nBottle size (ml): 200";
  if (form === "OINTMENT" || form === "CREAM" || form === "GEL") return "Example:\nTube size (gm): 30";
  if (form === "OIL" || form === "SHAMPOO" || form === "LOTION") return "Example:\nBottle size (ml): 100";
  return "Example:\nPack size: 1\nUnit: bottle/box/strip";
}

export default function ProductNewForm() {
  const [coverUrl, setCoverUrl] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [form, setForm] = useState<MedicineForm | "">("");

  const packagingPlaceholder = useMemo(() => packagingHint(form), [form]);

  return (
    <div style={{ padding: 24, maxWidth: 980 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Add Product</h1>

      <form action={createProduct} style={{ marginTop: 18, display: "grid", gap: 12 }}>
        <input name="name" placeholder="Product name" required />
        <input name="slug" placeholder="Slug (hair-oil)" required />
        <input name="tag" placeholder='Tag (e.g. "Best Seller")' />

        {/* ✅ images */}
        <input type="hidden" name="imageUrl" value={coverUrl} />
        <input type="hidden" name="gallery" value={gallery.join("\n")} />

        <ProductImagesField
          coverUrl={coverUrl}
          setCoverUrl={setCoverUrl}
          gallery={gallery}
          setGallery={setGallery}
        />

        {/* ✅ price required */}
        <input
          name="price"
          placeholder="Selling price (₹)"
          inputMode="numeric"
          required
        />

        {/* ✅ short description only */}
        <textarea
          name="shortDescription"
          placeholder="Short description (1–2 lines)"
          rows={3}
        />

        {/* ✅ dosage form */}
        <select
          name="medicineForm"
          value={form}
          onChange={(e) => setForm(e.target.value as any)}
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

        {/* ✅ packaging details as guided fields */}
        <textarea
          name="packagingText"
          placeholder={`Packaging details (guided)\n${packagingPlaceholder}`}
          rows={4}
        />

        {/* ✅ sections with guiding text */}
        <textarea
          name="indications"
          placeholder={`Indications (one per line)\n• Helps in fever\n• Relieves headache & body ache\n• Useful in cold & flu`}
          rows={5}
        />

        <textarea
          name="ingredients"
          placeholder={`Ingredients (one per line)\n• Giloy\n• Neem\n• Tulsi\n• Ashwagandha`}
          rows={5}
        />

        <textarea
          name="directionsToUse"
          placeholder={`Directions to use (one per line)\n• 2 tsp twice daily\n• Or as directed by physician`}
          rows={4}
        />

        <textarea
          name="contraindications"
          placeholder={`Contraindications / Precautions (one per line)\n• Pregnant women consult doctor\n• Do not exceed recommended dose`}
          rows={4}
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
