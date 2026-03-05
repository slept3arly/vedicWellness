"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Info,
  ListOrdered,
  FlaskConical,
  AlertTriangle,
} from "lucide-react";

import Card from "@/components/public/ui/Card";
import { fadeUpSoft, staggerFast } from "@/app/animations";
import { Product } from "./types";

/* ------------------------------------------------------------------ */
/* Compact Accordion — Background Matches ProductAudience              */
/* ------------------------------------------------------------------ */

function DetailItem({
  title,
  icon: Icon,
  iconColor,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: any;
  iconColor: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div variants={fadeUpSoft} className="overflow-hidden rounded-2xl">
      <Card className="p-0 group">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <span className="flex items-center gap-3">
            <Icon
              size={18}
              strokeWidth={2.2}
              className={`${iconColor} group-hover:scale-110 transition-transform`}
            />
            <span className="font-semibold text-sm tracking-tight">
              {title}
            </span>
          </span>

          <span
            className={`text-lg transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component                                                      */
/* ------------------------------------------------------------------ */

export default function ProductDetailsAccordion({
  product,
}: {
  product: Pick<
    Product,
    | "longDescription"
    | "ingredients"
    | "directionsToUse"
    | "precautions"
  >;
}) {
  const hasAny =
    product.longDescription ||
    (product.ingredients ?? []).length > 0 ||
    (product.directionsToUse ?? []).length > 0 ||
    (product.precautions ?? []).length > 0;

  if (!hasAny) return null;

  return (
    <motion.div
      variants={staggerFast}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="space-y-3"
    >
      {/* Product Description */}
      {product.longDescription && (
        <DetailItem
          title="Product Description"
          icon={Info}
          iconColor="text-blue-400"
          defaultOpen
        >
          <p className="whitespace-pre-line font-medium">
            {product.longDescription}
          </p>
        </DetailItem>
      )}

      {/* Directions */}
      {(product.directionsToUse ?? []).length > 0 && (
        <DetailItem
          title="Directions to Use"
          icon={ListOrdered}
          iconColor="text-emerald-400"
        >
          <ol className="space-y-3">
            {product.directionsToUse?.map((d, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ol>
        </DetailItem>
      )}

      {/* Ingredients */}
      {(product.ingredients ?? []).length > 0 && (
        <DetailItem
          title="Ingredients"
          icon={FlaskConical}
          iconColor="text-violet-400"
        >
          <ul className="space-y-2">
            {product.ingredients?.map((ing, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/40 shrink-0" />
                {ing}
              </li>
            ))}
          </ul>
        </DetailItem>
      )}

      {/* Precautions */}
      {(product.precautions ?? []).length > 0 && (
        <DetailItem
          title="Precautions & Warnings"
          icon={AlertTriangle}
          iconColor="text-amber-400"
        >
          <ul className="space-y-2">
            {product.precautions?.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </DetailItem>
      )}
    </motion.div>
  );
}