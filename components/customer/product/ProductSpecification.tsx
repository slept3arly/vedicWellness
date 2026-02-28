"use client";

import { motion } from "framer-motion";
import {
  Factory,
  Globe,
  Timer,
  Package,
  ShieldCheck,
  Pill,
  Leaf,
  Info,
  FlaskConical,
  Box,
  ClipboardList,
} from "lucide-react";

import Card from "@/components/public/ui/Card";
import { staggerSlow } from "@/app/animations";
import { Product } from "./types";

type Props = {
  product: Product;
};

export default function ProductSpecification({ product }: Props) {
  const specifications = product.specifications ?? [];

  /* ===============================
     COMPOSITION & USAGE
  =============================== */

  const composition = [
    {
    label: "Brand",
    value: "Vedic Wellness",
    icon: <ShieldCheck size={14} />, // ✅ Brand icon
    },
    {
      label: "Dosage Form",
      value: product.medicineForm,
      icon: <Pill size={14} />,
    },
    {
      label: "Net Quantity",
      value: product.netQuantity,
      icon: <Package size={14} />,
    },
    {
    label: "Packaging",
    value:
      product.packaging.length > 0
        ? product.packaging.join(", ")
        : null,
    icon: <Box size={14} />, // ✅ Packaging icon
    },
    {
      label: "Active Ingredients",
      value:
        product.ingredients.length > 0
          ? product.ingredients.join(", ")
          : null,
      icon: <Leaf size={14} />,
    },
    {
      label: "Recommended Dosage",
      value:
        product.directionsToUse.length > 0
          ? product.directionsToUse.join(" • ")
          : null,
      icon: <ClipboardList size={14} />, // ✅ Dosage icon
    },
  ].filter((row) => Boolean(row.value));

  /* ===============================
     MANUFACTURING & COMPLIANCE
  =============================== */

  const manufacturing = [
    {
      label: "Manufactured By",
      value: product.manufacturer,
      icon: <Factory size={14} />,
    },
    {
      label: "Country of Origin",
      value: product.countryOfOrigin,
      icon: <Globe size={14} />,
    },
    {
      label: "Shelf Life",
      value: product.shelfLife,
      icon: <Timer size={14} />,
    },
    {
      label: "Certifications",
      value:
        product.certifications.length > 0
          ? product.certifications.join(", ")
          : null,
      icon: <ShieldCheck size={14} />,
    },
  ].filter((row) => Boolean(row.value));

  if (
    composition.length === 0 &&
    manufacturing.length === 0 &&
    specifications.length === 0
  ) {
    return null;
  }

  return (
    <motion.div
      variants={staggerSlow}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="space-y-6"
    >
      {/* 🔥 Updated Main Title */}
      <h2 className="font-heading text-2xl font-black flex items-center gap-2">
        <Info size={22} className="text-accent" />
        Product Specifications
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* COMPOSITION */}
        {composition.length > 0 && (
          <Card className="bg-white/75 dark:bg-black/45 overflow-hidden p-0">
            <div className="p-4 border-b font-semibold text-lg flex items-center gap-2 bg-[var(--bg-surface)]">
              <FlaskConical size={18} className="text-accent" />
              Composition & Usage
            </div>

            <table className="w-full text-sm">
              <tbody>
                {composition.map((row, i, arr) => (
                  <tr
                    key={row.label}
                    className={`${
                      i !== arr.length - 1
                        ? "border-b border-[var(--border-soft)]"
                        : ""
                    } ${
                      i % 2 === 0
                        ? "bg-muted/5"
                        : "bg-[var(--bg-surface)]"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium w-44 text-muted">
                      <div className="flex items-center gap-2">
                        {row.icon && (
                          <span className="text-accent">
                            {row.icon}
                          </span>
                        )}
                        {row.label}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {row.value as string}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {/* MANUFACTURING */}
        {manufacturing.length > 0 && (
          <Card className="bg-white/75 dark:bg-black/45 overflow-hidden p-0">
            <div className="p-4 border-b font-semibold text-lg flex items-center gap-2 bg-[var(--bg-surface)]">
              <Factory size={18} className="text-accent" />
              Manufacturing & Compliance
            </div>

            <table className="w-full text-sm">
              <tbody>
                {manufacturing.map((row, i, arr) => (
                  <tr
                    key={row.label}
                    className={`${
                      i !== arr.length - 1
                        ? "border-b border-[var(--border-soft)]"
                        : ""
                    } ${
                      i % 2 === 0
                        ? "bg-muted/5"
                        : "bg-[var(--bg-surface)]"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium w-52 text-muted">
                      <div className="flex items-center gap-2">
                        {row.icon && (
                          <span className="text-accent">
                            {row.icon}
                          </span>
                        )}
                        {row.label}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {row.value as string}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* EXTRA SPECIFICATIONS */}
      {specifications.length > 0 && (
        <Card className="bg-white/75 dark:bg-black/45 overflow-hidden p-0">
          <div className="p-4 border-b font-semibold text-lg">
            Additional Specifications
          </div>

          <table className="w-full text-sm">
            <tbody>
              {specifications.map((spec, i, arr) => (
                <tr
                  key={spec.id}
                  className={`${
                    i !== arr.length - 1
                      ? "border-b border-[var(--border-soft)]"
                      : ""
                  } ${
                    i % 2 === 0
                      ? "bg-muted/5"
                      : "bg-[var(--bg-surface)]"
                  }`}
                >
                  <td className="px-4 py-3 font-medium w-52 text-muted">
                    {spec.label}
                  </td>
                  <td className="px-4 py-3">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </motion.div>
  );
}