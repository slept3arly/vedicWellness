"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, useTransition } from "react";
import { updateProduct } from "../../serverActions";
import ProductImagesField from "@/components/admin/ProductImagesField";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import { toast } from "@/lib/toast";
import { MedicineForm, Product, ProductVariant } from "@prisma/client";

/* ── helpers ── */

const listToText = (v: unknown) =>
  !v ? "" : Array.isArray(v) ? (v as string[]).join("\n") : String(v);

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
        {lbl}
        {req && <span className="ml-0.5 text-destructive" aria-hidden>*</span>}
      </label>
      {children}
      {tip && <p className={hintCls}>{tip}</p>}
    </div>
  );
}

function Sec({ title, sub, children }: {
  title: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <AdminCard>
      <div className="mb-5 pb-4 border-b border-border">
        <h2 className="text-base font-semibold">{title}</h2>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </AdminCard>
  );
}

/* ── variant row ── */

function VariantRow({ v, i, upd, del }: {
  v: ProductVariant; i: number;
  upd: (i: number, k: keyof ProductVariant, val: any) => void;
  del: (i: number) => void;
}) {
  return (
    <div
      role="group"
      aria-label={`Variant ${i + 1}${v.name ? `: ${v.name}` : ""}`}
      className="rounded-lg border border-border bg-muted/30 p-4 space-y-3"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(
          [
            ["Name",          "name",           "text",   "e.g. Pack of 3"],
            ["Price (₹)",     "price",          "number", "0"],
            ["Compare (₹)",   "compareAtPrice", "number", "—"],
            ["Stock",         "stock",          "number", "0"],
            ["SKU",           "sku",            "text",   "SKU-001"],
          ] as const
        ).map(([lbl, key, type, ph]) => (
          <div key={key}>
            <label className={labelCls}>{lbl}</label>
            <input
              type={type}
              placeholder={ph}
              min={type === "number" ? 0 : undefined}
              value={
                key === "compareAtPrice" ? (v[key] ?? "")
                : key === "sku"          ? (v[key] ?? "")
                :                          (v[key] as any)
              }
              onChange={(e) => {
                if (key === "compareAtPrice")
                  upd(i, key, e.target.value ? Number(e.target.value) : null);
                else if (key === "sku")
                  upd(i, key, e.target.value || null);
                else if (type === "number")
                  upd(i, key, Number(e.target.value));
                else
                  upd(i, key, e.target.value);
              }}
              className={inputCls}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => del(i)}
        className="text-xs font-medium text-destructive hover:opacity-70 transition-opacity focus:outline-none focus-visible:underline"
        aria-label={`Remove variant ${i + 1}`}
      >
        Remove variant
      </button>
    </div>
  );
}

/* ── main form ── */

export default function ProductEditForm({
  product,
}: {
  product: Product & { variants?: ProductVariant[] };
}) {
  const [isPending, start] = useTransition();

  const [coverUrl,  setCoverUrl]  = useState(product.imageUrl ?? "");
  const [gallery,   setGallery]   = useState<string[]>(
    Array.isArray(product.gallery) ? (product.gallery as string[]) : []
  );
  const [medicineForm, setMedicineForm] = useState<MedicineForm | "">(
    product.medicineForm ?? ""
  );
  const [variants, setVariants] = useState<ProductVariant[]>(
    product.variants ?? []
  );

  const addVariant = useCallback(
    () => setVariants((p) => [
      ...p,
      { id: "", productId: product.id, name: "", price: 0, compareAtPrice: null, stock: 0, sku: null },
    ]),
    [product.id]
  );

  const updVariant = useCallback((i: number, k: keyof ProductVariant, val: any) =>
    setVariants((p) => { const n = [...p]; (n[i] as any)[k] = val; return n; }), []);

  const delVariant = useCallback(
    (i: number) => setVariants((p) => p.filter((_, idx) => idx !== i)), []
  );

  const variantsJson = useMemo(() => JSON.stringify(variants), [variants]);
  const galleryText  = useMemo(() => gallery.join("\n"), [gallery]);
  const pkgHint      = useMemo(
    () => PACKAGING_HINTS[medicineForm as MedicineForm] ?? "Pack size: 1\nUnit: bottle/box/strip",
    [medicineForm]
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    start(async () => {
      try {
        await updateProduct(data);
        toast.success("Product saved successfully.");
      } catch (e: any) {
        // Next.js throws NEXT_REDIRECT internally when redirect() is called in a server action — not a real error
        if (e?.message === "NEXT_REDIRECT" || e?.digest?.startsWith("NEXT_REDIRECT")) return;
        toast.error("Failed to save product", e?.message);
      }
    });
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-8 space-y-6">

      <form onSubmit={handleSubmit} noValidate aria-label="Edit product" className="space-y-6">

        {/* header */}
        <div className="space-y-3">
          {/* title row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Product</h1>
              <p className="mt-1 text-xs text-muted-foreground font-mono">
                {product.id}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/admin/products" tabIndex={isPending ? -1 : 0}>
                <AdminButton type="button" variant="secondary" disabled={isPending}>
                  Discard
                </AdminButton>
              </Link>
              <AdminButton type="submit" variant="success" disabled={isPending} aria-busy={isPending}>
                {isPending ? "Saving…" : "Save Changes"}
              </AdminButton>
            </div>
          </div>
        </div>

        {/* hidden state */}
        <input type="hidden" name="id"           value={product.id} />
        <input type="hidden" name="imageUrl"      value={coverUrl} />
        <input type="hidden" name="galleryText"   value={galleryText} />
        <input type="hidden" name="variantsJson"  value={variantsJson} />

        {/* core info */}
        <Sec title="Core Information" sub="Shown on product listing and detail page.">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <F id="name" lbl="Product Name" req>
              <input id="name" name="name" defaultValue={product.name}
                required autoComplete="off" className={inputCls} aria-required />
            </F>
            <F id="slug" lbl="Slug" req tip="URL-safe, e.g. my-product-name">
              <input id="slug" name="slug" defaultValue={product.slug}
                required pattern="[a-z0-9-]+" autoComplete="off" className={inputCls} aria-required />
            </F>
            <F id="subtitle" lbl="Subtitle">
              <input id="subtitle" name="subtitle" defaultValue={product.subtitle ?? ""} className={inputCls} />
            </F>
            <F id="tag" lbl="Tag" tip="e.g. bestseller, new">
              <input id="tag" name="tag" defaultValue={product.tag ?? ""} className={inputCls} />
            </F>
          </div>
        </Sec>

        {/* pricing */}
        <Sec title="Pricing & Inventory" sub="Base price. Use variants below for multi-pack options.">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <F id="price" lbl="Price (₹)" req>
              <input id="price" type="number" name="price" defaultValue={product.price}
                required min={0} className={inputCls} aria-required />
            </F>
            <F id="compareAtPrice" lbl="Compare At (₹)" tip="Strike-through price">
              <input id="compareAtPrice" type="number" name="compareAtPrice"
                defaultValue={product.compareAtPrice ?? ""} min={0} className={inputCls} />
            </F>
            <F id="stock" lbl="Stock" req>
              <input id="stock" type="number" name="stock" defaultValue={product.stock}
                required min={0} className={inputCls} aria-required />
            </F>
            <F id="sku" lbl="SKU" tip="Unique product code">
              <input id="sku" name="sku" defaultValue={product.sku ?? ""} className={inputCls} />
            </F>
          </div>
        </Sec>

        {/* variants */}
        <Sec title="Variants" sub="Pack sizes or alternate configs with their own pricing and stock.">
          <div className="space-y-3">
            {variants.length === 0
              ? <p className="text-sm text-muted-foreground text-center py-3">No variants added yet.</p>
              : variants.map((v, i) => (
                  <VariantRow key={v.id || `new-${i}`} v={v} i={i} upd={updVariant} del={delVariant} />
                ))
            }
          </div>
          <AdminButton type="button" onClick={addVariant}>+ Add Variant</AdminButton>
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
              <textarea id="shortDescription" name="shortDescription"
                defaultValue={product.shortDescription ?? ""} className={textareaCls} />
            </F>
            <F id="longDescription" lbl="Long Description">
              <textarea id="longDescription" name="longDescription"
                defaultValue={product.longDescription ?? ""} className={textareaCls} />
            </F>
          </div>
        </Sec>

        {/* structured content */}
        <Sec title="Structured Content" sub="One item per line — powers bullets, icon grids, and tabs.">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {([
              ["highlights",      "Highlights",       "Amazon-style bullet points"],
              ["benefits",        "Benefits",         "Icon feature grid"],
              ["whoShouldUse",    "Who Should Use",   ""],
              ["ingredients",     "Ingredients",      ""],
              ["directionsToUse", "Directions",       ""],
              ["precautions",     "Precautions",      ""],
            ] as const).map(([name, lbl, tip]) => (
              <F key={name} id={name} lbl={lbl} tip={tip || undefined}>
                <textarea id={name} name={name}
                  defaultValue={listToText((product as any)[name])}
                  className={textareaCls} />
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
              <textarea id="packagingText" name="packagingText"
                defaultValue={listToText(product.packaging)}
                placeholder={pkgHint}
                className={textareaCls} />
            </F>
          </div>
        </Sec>

        {/* technical */}
        <Sec title="Technical Information">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            <F id="manufacturer" lbl="Manufacturer">
              <input id="manufacturer" name="manufacturer"
                defaultValue={product.manufacturer ?? ""} className={inputCls} />
            </F>
            <F id="countryOfOrigin" lbl="Country of Origin">
              <input id="countryOfOrigin" name="countryOfOrigin"
                defaultValue={product.countryOfOrigin ?? "India"} className={inputCls} />
            </F>
            <F id="shelfLife" lbl="Shelf Life" tip="e.g. 24 months">
              <input id="shelfLife" name="shelfLife"
                defaultValue={product.shelfLife ?? ""} className={inputCls} />
            </F>
            <F id="netQuantity" lbl="Net Quantity" tip="e.g. 60 tablets">
              <input id="netQuantity" name="netQuantity"
                defaultValue={product.netQuantity ?? ""} className={inputCls} />
            </F>
          </div>
        </Sec>

        {/* trust */}
        <Sec title="Trust & Certifications" sub="One item per line — shown as badges or logos.">
          <div className="grid sm:grid-cols-2 gap-5">
            <F id="trustBadges" lbl="Trust Badges">
              <textarea id="trustBadges" name="trustBadges"
                defaultValue={listToText(product.trustBadges)} className={textareaCls} />
            </F>
            <F id="certifications" lbl="Certifications">
              <textarea id="certifications" name="certifications"
                defaultValue={listToText(product.certifications)} className={textareaCls} />
            </F>
          </div>
        </Sec>

        {/* publish toggle */}
        <AdminCard>
          <label className="flex items-center gap-3 text-sm font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              name="published"
              defaultChecked={product.published}
              className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
            />
            <span>
              Published
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {product.published ? "Visible on storefront" : "Hidden from storefront"}
              </span>
            </span>
          </label>
        </AdminCard>

      </form>
    </div>
  );
}