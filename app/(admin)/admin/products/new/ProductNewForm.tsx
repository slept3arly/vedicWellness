"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { createProduct } from "../serverActions";
import ProductImagesField from "@/components/admin/ProductImagesField";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { toast } from "@/lib/toast";
import { MedicineForm } from "@prisma/client";

/* ── helpers ── */

const FORM_LABELS: Record<MedicineForm, string> = {
  TABLET: "Tablet", CAPSULE: "Capsule", SYRUP: "Syrup", DROPS: "Drops",
  SUSPENSION: "Suspension", POWDER: "Powder", GRANULES: "Granules",
  OINTMENT: "Ointment", CREAM: "Cream", GEL: "Gel", LOTION: "Lotion",
  SHAMPOO: "Shampoo", OIL: "Oil", SPRAY: "Spray", INHALER: "Inhaler",
  INJECTION: "Injection", OTHER: "Other",
};

const PACKAGING_HINTS: Partial<Record<MedicineForm, string>> = {
  TABLET: "Tablets per strip: 10\nStrips per box: 20",
  CAPSULE: "Capsules per strip: 10\nStrips per box: 20",
  SYRUP: "Bottle size (ml): 200",
  SUSPENSION: "Bottle size (ml): 100",
  OINTMENT: "Tube size (gm): 30", CREAM: "Tube size (gm): 30", GEL: "Tube size (gm): 30",
  OIL: "Bottle size (ml): 100", SHAMPOO: "Bottle size (ml): 100", LOTION: "Bottle size (ml): 100",
};

/* ── shared class strings ── */

const inputCls =
  "w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const textareaCls =
  "w-full h-28 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const selectCls =
  "w-full h-10 rounded-lg border border-border bg-background px-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow appearance-none cursor-pointer";

const labelCls =
  "block mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

const hintCls = "mt-1 text-xs text-muted-foreground/70";

/* ── primitives ── */

function F({ id, lbl, tip, req, children }: {
  id?: string; lbl: string; tip?: string; req?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {lbl}{req && <span className="ml-0.5 text-destructive" aria-hidden>*</span>}
      </label>
      {children}
      {tip && <p className="text-slate-600 dark:text-slate-300 !text-xs opacity-70">{tip}</p>}
    </div>
  );
}

function Sec({ title, sub, children }: {
  title: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <AdminCard>
      <div className="mb-5 pb-4 border-b border-border">
        <SectionHeading title={title} subtitle={sub} />
      </div>
      <div className="space-y-5">{children}</div>
    </AdminCard>
  );
}

/* ── main ── */

export default function ProductNewForm() {
  const [isPending, start] = useTransition();
  const [coverUrl, setCoverUrl] = useState("");
  const [gallery, setGallery]   = useState<string[]>([]);
  const [medicineForm, setMedicineForm] = useState<MedicineForm | "">("");

  const pkgHint = useMemo(
    () => PACKAGING_HINTS[medicineForm as MedicineForm] ?? "Pack size: 1\nUnit: bottle/box/strip",
    [medicineForm]
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    start(async () => {
      try {
        await createProduct(data);
        toast.success("Product created successfully.");
      } catch (e: any) {
        if (e?.message === "NEXT_REDIRECT" || e?.digest?.startsWith("NEXT_REDIRECT")) return;
        toast.error("Failed to create product", e?.message);
      }
    });
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-8 space-y-6">
      <form onSubmit={handleSubmit} noValidate aria-label="Create product" className="space-y-6">

        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <PageHeader title="Add Product" />
          <div className="flex items-center gap-2 shrink-0">
            <AdminButton type="submit" variant="success">
              {isPending ? "Creating…" : "Create Product"}
            </AdminButton>
            
            <Link href="/admin/products">
              <AdminButton type="button" variant="secondary">
                Discard
              </AdminButton>
            </Link>
          </div>
        </div>

        {/* hidden state */}
        <input type="hidden" name="imageUrl"    value={coverUrl} />
        <input type="hidden" name="galleryText" value={gallery.join("\n")} />

        {/* core info */}
        <Sec title="Core Information" sub="Shown on product listing and detail page.">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <F id="name" lbl="Product Name" req>
              <input id="name" name="name" placeholder="Lady-K Syrup" required autoComplete="off" className={inputCls} aria-required />
            </F>
            <F id="slug" lbl="Slug" req tip="URL-safe, e.g. my-product-name">
              <input id="slug" name="slug" placeholder="lady-k-syrup" required pattern="[a-z0-9-]+" autoComplete="off" className={inputCls} aria-required />
            </F>
            <F id="subtitle" lbl="Subtitle">
              <input id="subtitle" name="subtitle" placeholder="Ayurvedic Uterine Tonic" className={inputCls} />
            </F>
            <F id="tag" lbl="Tag" tip="e.g. bestseller, new">
              <input id="tag" name="tag" placeholder="Women's Care" className={inputCls} />
            </F>
          </div>
        </Sec>

        {/* pricing */}
        <Sec title="Pricing & Inventory" sub="Base price. You can add variants after creating the product.">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <F id="price" lbl="Price (₹)" req>
              <input id="price" name="price" inputMode="numeric" placeholder="299" required className={inputCls} aria-required />
            </F>
            <F id="compareAtPrice" lbl="Compare At (₹)" tip="Strike-through price">
              <input id="compareAtPrice" name="compareAtPrice" inputMode="numeric" placeholder="399" className={inputCls} />
            </F>
            <F id="stock" lbl="Stock" req>
              <input id="stock" name="stock" inputMode="numeric" placeholder="0" defaultValue="0" required className={inputCls} aria-required />
            </F>
            <F id="sku" lbl="SKU" tip="Unique product code">
              <input id="sku" name="sku" placeholder="SKU-001" className={inputCls} />
            </F>
          </div>
        </Sec>

        {/* images */}
        <ProductImagesField
          coverUrl={coverUrl}   setCoverUrl={setCoverUrl}
          gallery={gallery}     setGallery={setGallery}
        />

        {/* descriptions */}
        <Sec title="Descriptions" sub="Short for cards; long for the product page.">
          <div className="grid sm:grid-cols-2 gap-5">
            <F id="shortDescription" lbl="Short Description">
              <textarea id="shortDescription" name="shortDescription" placeholder="1–2 line product summary" className={textareaCls} />
            </F>
            <F id="longDescription" lbl="Long Description">
              <textarea id="longDescription" name="longDescription" placeholder="Detailed product overview" className={textareaCls} />
            </F>
          </div>
        </Sec>

        {/* structured content */}
        <Sec title="Structured Content" sub="One item per line — powers bullets, icon grids, and tabs.">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {([
              ["highlights",      "Highlights",     "Amazon-style bullet points"],
              ["benefits",        "Benefits",       "Icon feature grid"],
              ["whoShouldUse",    "Who Should Use", ""],
              ["ingredients",     "Ingredients",    ""],
              ["directionsToUse", "Directions",     ""],
              ["precautions",     "Precautions",    ""],
            ] as const).map(([name, lbl, tip]) => (
              <F key={name} id={name} lbl={lbl} tip={tip || undefined}>
                <textarea id={name} name={name} placeholder="One per line" className={textareaCls} />
              </F>
            ))}
          </div>
        </Sec>

        {/* product details */}
        <Sec title="Product Details" sub="Dosage form and packaging info.">
          <div className="grid sm:grid-cols-2 gap-5">
            <F id="medicineForm" lbl="Dosage Form">
              <div className="relative">
                <select id="medicineForm" name="medicineForm"
                  value={medicineForm}
                  onChange={(e) => setMedicineForm(e.target.value as MedicineForm)}
                  className={selectCls}
                >
                  <option value="">Select form</option>
                  {(Object.keys(FORM_LABELS) as MedicineForm[]).map((f) => (
                    <option key={f} value={f}>{FORM_LABELS[f]}</option>
                  ))}
                </select>
                <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">▾</span>
              </div>
            </F>
            <F id="packagingText" lbl="Packaging" tip="One key: value per line">
              <textarea id="packagingText" name="packagingText" placeholder={pkgHint} className={textareaCls} />
            </F>
          </div>
        </Sec>

        {/* technical */}
        <Sec title="Technical Information">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            <F id="manufacturer" lbl="Manufacturer">
              <input id="manufacturer" name="manufacturer" placeholder="ABC Pharma Ltd." className={inputCls} />
            </F>
            <F id="countryOfOrigin" lbl="Country of Origin">
              <input id="countryOfOrigin" name="countryOfOrigin" placeholder="India" defaultValue="India" className={inputCls} />
            </F>
            <F id="shelfLife" lbl="Shelf Life" tip="e.g. 24 months">
              <input id="shelfLife" name="shelfLife" placeholder="24 months" className={inputCls} />
            </F>
            <F id="netQuantity" lbl="Net Quantity" tip="e.g. 60 tablets">
              <input id="netQuantity" name="netQuantity" placeholder="200 ml" className={inputCls} />
            </F>
          </div>
        </Sec>

        {/* trust */}
        <Sec title="Trust & Certifications" sub="One item per line — shown as badges or logos.">
          <div className="grid sm:grid-cols-2 gap-5">
            <F id="trustBadges" lbl="Trust Badges">
              <textarea id="trustBadges" name="trustBadges" placeholder="GMP Certified" defaultValue="GMP Certified" className={textareaCls} />
            </F>
            <F id="certifications" lbl="Certifications">
              <textarea id="certifications" name="certifications" placeholder="One per line" className={textareaCls} />
            </F>
          </div>
        </Sec>

        {/* publish */}
        <AdminCard>
          <label className="flex items-center gap-3 text-sm font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              name="published"
              defaultChecked
              className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
            />
            <span className="text-slate-600 dark:text-slate-300">
              Published
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                Visible on storefront immediately
              </span>
            </span>
          </label>
        </AdminCard>

      </form>
    </div>
  );
}