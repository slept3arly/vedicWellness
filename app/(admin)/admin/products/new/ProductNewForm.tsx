"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createProduct } from "../serverActions";
import ProductImagesField from "@/components/admin/ProductImagesField";
import { MedicineForm } from "@prisma/client";

/* -------------------------------------------------- */

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

export default function ProductNewForm() {
  const [coverUrl, setCoverUrl] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [form, setForm] = useState<MedicineForm | "">("");

  const packagingPlaceholder = useMemo(
    () => packagingHint(form),
    [form]
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Add Product</h1>

      <form
        action={createProduct}
        className="space-y-6"
      >
        {/* ---------------- Core Info ---------------- */}

        <div className="grid md:grid-cols-2 gap-4">
          <input name="name" placeholder="Product name" required />
          <input name="slug" placeholder="Slug (hair-oil)" required />
          <input name="subtitle" placeholder="Subtitle (optional)" />
          <input name="tag" placeholder='Tag (e.g. "Best Seller")' />
        </div>

        {/* ---------------- Pricing ---------------- */}

        <div className="grid md:grid-cols-3 gap-4">
          <input
            name="price"
            placeholder="Selling price (₹)"
            inputMode="numeric"
            required
          />

          <input
            name="compareAtPrice"
            placeholder="MRP / Compare price (optional)"
            inputMode="numeric"
          />

          <input
            name="stock"
            placeholder="Stock quantity"
            inputMode="numeric"
            defaultValue="0"
            required
          />
        </div>

        {/* ---------------- Images ---------------- */}

        <input type="hidden" name="imageUrl" value={coverUrl} />
        <input
          type="hidden"
          name="galleryText"
          value={gallery.join("\n")}
        />

        <ProductImagesField
          coverUrl={coverUrl}
          setCoverUrl={setCoverUrl}
          gallery={gallery}
          setGallery={setGallery}
        />

        {/* ---------------- Description ---------------- */}

        <textarea
          name="shortDescription"
          placeholder="Short description (1–2 lines)"
          rows={3}
        />

        <textarea
          name="longDescription"
          placeholder="Long description (detailed product overview)"
          rows={5}
        />

        {/* ---------------- Structured Content ---------------- */}

        <Section title="Highlights">
          <textarea
            name="highlights"
            placeholder="One per line (Amazon bullet style)"
            rows={4}
          />
        </Section>

        <Section title="Benefits">
          <textarea
            name="benefits"
            placeholder="One per line"
            rows={4}
          />
        </Section>

        <Section title="Who Should Use">
          <textarea
            name="whoShouldUse"
            placeholder="One per line"
            rows={4}
          />
        </Section>

        <Section title="Ingredients">
          <textarea
            name="ingredients"
            placeholder="One per line"
            rows={4}
          />
        </Section>

        <Section title="Directions To Use">
          <textarea
            name="directionsToUse"
            placeholder="One per line"
            rows={4}
          />
        </Section>

        <Section title="Precautions">
          <textarea
            name="precautions"
            placeholder="One per line"
            rows={4}
          />
        </Section>

        {/* ---------------- Dosage Form ---------------- */}

        <select
          name="medicineForm"
          value={form}
          onChange={(e) =>
            setForm(e.target.value as MedicineForm)
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

        {/* ---------------- Packaging ---------------- */}

        <textarea
          name="packagingText"
          placeholder={`Packaging details\n${packagingPlaceholder}`}
          rows={4}
        />

        {/* ---------------- Technical Info ---------------- */}

        <div className="grid md:grid-cols-2 gap-4">
          <input name="manufacturer" placeholder="Manufacturer" />
          <input
            name="countryOfOrigin"
            placeholder="Country of origin"
            defaultValue="India"
          />
          <input name="shelfLife" placeholder="Shelf life" />
          <input name="netQuantity" placeholder="Net quantity" />
        </div>

        {/* ---------------- Trust Layer ---------------- */}

        <Section title="Trust Badges">
          <textarea
            name="trustBadges"
            placeholder="One per line (e.g. GMP Certified)"
            rows={3}
            defaultValue="GMP Certified"
          />
        </Section>

        <Section title="Certifications">
          <textarea
            name="certifications"
            placeholder="One per line"
            rows={3}
          />
        </Section>

        {/* ---------------- Publish ---------------- */}

        <label className="flex items-center gap-2">
          <input
            name="published"
            type="checkbox"
            defaultChecked
          />
          Published
        </label>

        {/* ---------------- Actions ---------------- */}

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            Create
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