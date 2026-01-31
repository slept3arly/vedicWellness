"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Pencil,
  CheckSquare,
  Square,
  Calendar,
  Tag,
  Image as ImageIcon,
  IndianRupee,
  Eye,
  EyeOff,
  Boxes,
} from "lucide-react";

import AdminCard from "../components/ui/AdminCard";
import AdminButton from "../components/ui/AdminButton";
import AdminBadge from "../components/ui/AdminBadge";
import {
  deleteProduct,
  toggleProductPublished,
} from "./serverActions";

function formatDate(d?: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export default function AdminProductsClient({
  products,
}: {
  products: any[];
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  function toggleSelect(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-neutral-500">
            Manage your product catalog
          </p>
        </div>

        <Link href="/admin/products/new">
          <AdminButton>+ Add Product</AdminButton>
        </Link>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="h-12 w-full rounded-xl border border-neutral-300 bg-white pl-11 pr-4 text-sm dark:bg-neutral-900 dark:border-neutral-700"
        />
      </div>

      {/* Row list */}
      {filtered.map((p, index) => {
        const isSelected = selected.includes(p.id);
        const galleryCount = Array.isArray(p.gallery)
          ? p.gallery.length
          : 0;

        return (
          <AdminCard
            key={p.id}
            className={`flex items-start gap-6 transition ${
              isSelected
                ? "ring-2 ring-emerald-500"
                : "hover:shadow-md"
            }`}
          >
            {/* Row number */}
            <div className="text-sm text-neutral-500 pt-2 w-6 shrink-0">
              {index + 1}.
            </div>

            {/* Image */}
            <div className="w-20 h-20 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0 overflow-hidden">
              {p.imageUrl ? (
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-neutral-500" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">

              {/* Name + status */}
              <div className="flex justify-between items-start gap-4">
                <h2 className="font-semibold text-lg leading-snug">
                  {p.name}
                </h2>

                <AdminBadge
                  status={p.published ? "ACTIVE" : "INACTIVE"}
                />
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-2 text-sm">

                <Meta label="Price">
                  <IndianRupee className="h-4 w-4" />
                  {p.price}
                </Meta>

                <Meta label="Tag">
                  <Tag className="h-4 w-4" />
                  {p.tag || "—"}
                </Meta>

                <Meta label="Form">
                  <Boxes className="h-4 w-4" />
                  {p.medicineForm || "—"}
                </Meta>

                <Meta label="Gallery">
                  <ImageIcon className="h-4 w-4" />
                  {galleryCount}
                </Meta>

                <Meta label="Created">
                  <Calendar className="h-4 w-4" />
                  {formatDate(p.createdAt)}
                </Meta>

              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">

              <Link href={`/admin/products/edit/${p.id}`}>
                <AdminButton className="w-full">
                  <Pencil className="h-4 w-4" />
                  Edit
                </AdminButton>
              </Link>

              <form action={toggleProductPublished}>
                <input type="hidden" name="id" value={p.id} />
                <input
                  type="hidden"
                  name="published"
                  value={String(p.published)}
                />
                <AdminButton className="w-full">
                  {p.published ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Show
                    </>
                  )}
                </AdminButton>
              </form>

              <form action={deleteProduct}>
                <input type="hidden" name="id" value={p.id} />
                <AdminButton variant="danger" className="w-full">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </AdminButton>
              </form>

            </div>
          </AdminCard>
        );
      })}
    </div>
  );
}

/* ===== Meta helper ===== */

function Meta({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-neutral-600 dark:text-neutral-400">
        {label}
      </div>
      <div className="flex items-center gap-1 text-neutral-900 dark:text-white">
        {children}
      </div>
    </div>
  );
}
