"use client";

import {
  Factory,
  Globe,
  Timer,
  Package,
  ShieldCheck,
  Pill,
  Leaf,
  FlaskConical,
  Box,
  ClipboardList,
} from "lucide-react";

import Card from "@/components/public/ui/Card";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { Product } from "./types";

type Row = { label: string; value: string | null | undefined; icon: React.ElementType };

function SpecTable({
  title,
  headerIcon: HeaderIcon,
  rows,
}: {
  title: string;
  headerIcon: React.ElementType;
  rows: Row[];
}) {
  const filled = rows.filter((r) => Boolean(r.value));
  if (!filled.length) return null;

  return (
    <div>
      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-[color:var(--border-soft)] flex items-center gap-2">
          <HeaderIcon size={15} className="text-[color:var(--brand-primary)]" aria-hidden="true" />
          <span className="font-heading font-semibold text-sm tracking-tight text-[color:var(--text-main)]">
            {title}
          </span>
        </div>
        <table className="w-full text-sm" aria-label={title}>
          <tbody>
            {filled.map((row, i) => {
              const RowIcon = row.icon;
              return (
                <tr
                  key={row.label}
                  className={`
                    ${i !== filled.length - 1 ? "border-b border-[color:var(--border-soft)]" : ""}
                    ${i % 2 === 0 ? "bg-zinc-50/50 dark:bg-zinc-800/20" : ""}
                  `}
                >
                  <td className="px-5 py-3 w-48 font-body text-[color:var(--text-muted)]">
                    <span className="flex items-center gap-2">
                      <RowIcon size={12} className="text-[color:var(--brand-primary)] shrink-0" aria-hidden="true" />
                      {row.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-body text-[color:var(--text-main)]">
                    {row.value}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function ProductSpecification({ product }: { product: Product }) {
  const composition: Row[] = [
    { label: "Brand",               value: product.company?.name ?? "Vedic Wellness",       icon: ShieldCheck   },
    { label: "Dosage Form",         value: product.medicineForm,                           icon: Pill          },
    { label: "Net Quantity",        value: product.netQuantity,                            icon: Package       },
    { label: "Packaging",           value: product.packaging?.join(", ") || null,          icon: Box           },
    { label: "Active Ingredients",  value: product.ingredients?.join(", ") || null,        icon: Leaf          },
    { label: "Directions",          value: product.directionsToUse?.join(" • ") || null,   icon: ClipboardList },
  ];

  const manufacturing: Row[] = [
    { label: "Manufactured By",    value: product.manufacturer,                            icon: Factory       },
    { label: "Country of Origin",  value: product.countryOfOrigin,                        icon: Globe         },
    { label: "Shelf Life",         value: product.shelfLife,                               icon: Timer         },
    { label: "Certifications",     value: product.certifications?.join(", ") || null,      icon: ShieldCheck   },
  ];

  const extras = product.specifications ?? [];

  const hasAny =
    composition.some((r) => Boolean(r.value)) ||
    manufacturing.some((r) => Boolean(r.value)) ||
    extras.length > 0;

  if (!hasAny) return null;

  return (
    <div className="space-y-4">
      <SectionHeading title="Product Specifications" align="left" />

      <div className="grid md:grid-cols-2 gap-4">
        <SpecTable title="Composition & Usage"        headerIcon={FlaskConical} rows={composition}   />
        <SpecTable title="Manufacturing & Compliance" headerIcon={Factory}      rows={manufacturing} />
      </div>

      {extras.length > 0 && (
        <div>
          <Card className="p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-[color:var(--border-soft)]">
              <span className="font-heading font-semibold text-sm tracking-tight text-[color:var(--text-main)]">
                Additional Specifications
              </span>
            </div>
            <table className="w-full text-sm" aria-label="Additional specifications">
              <tbody>
                {extras.map((spec, i) => (
                  <tr
                    key={spec.id}
                    className={`
                      ${i !== extras.length - 1 ? "border-b border-[color:var(--border-soft)]" : ""}
                      ${i % 2 === 0 ? "bg-zinc-50/50 dark:bg-zinc-800/20" : ""}
                    `}
                  >
                    <td className="px-5 py-3 w-48 font-body text-[color:var(--text-muted)]">{spec.label}</td>
                    <td className="px-5 py-3 font-body text-[color:var(--text-main)]">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}
