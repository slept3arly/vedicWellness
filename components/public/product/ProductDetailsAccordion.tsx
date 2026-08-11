"use client";

import { m, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Info,
  ListOrdered,
  FlaskConical,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

import Card from "@/components/public/ui/Card";
import { Product } from "./types";

function AccordionItem({
  title,
  icon: Icon,
  iconColor,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <Card className="p-0">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="
            flex w-full items-center justify-between
            px-5 py-4 text-left
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-inset focus-visible:ring-emerald-500
          "
        >
          <span className="flex items-center gap-3">
            <Icon size={16} strokeWidth={2} className={iconColor} aria-hidden="true" />
            <span className="font-heading font-semibold text-sm tracking-tight text-[color:var(--text-main)]">
              {title}
            </span>
          </span>
          <ChevronDown
            size={15}
            aria-hidden="true"
            className={`
              text-[color:var(--text-muted)] transition-transform duration-300 shrink-0
              ${open ? "rotate-180" : ""}
            `}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <m.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-2 border-t border-[color:var(--border-soft)] text-sm font-body text-[color:var(--text-muted)] leading-relaxed">
                {children}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

export default function ProductDetailsAccordion({
  product,
}: {
  product: Pick<Product, "longDescription" | "ingredients" | "directionsToUse" | "precautions">;
}) {
  const hasAny =
    product.longDescription ||
    (product.ingredients ?? []).length > 0 ||
    (product.directionsToUse ?? []).length > 0 ||
    (product.precautions ?? []).length > 0;

  if (!hasAny) return null;

  return (
    <div className="space-y-3">
      {product.longDescription && (
        <AccordionItem
          title="Product Description"
          icon={Info}
          iconColor="text-blue-500 dark:text-blue-400"
          defaultOpen
        >
          <p className="whitespace-pre-line">{product.longDescription}</p>
        </AccordionItem>
      )}

      {(product.directionsToUse ?? []).length > 0 && (
        <AccordionItem
          title="Directions to Use"
          icon={ListOrdered}
          iconColor="text-emerald-500"
        >
          <ol className="space-y-3 mt-1">
            {product.directionsToUse?.map((d, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="
                  flex h-5 w-5 items-center justify-center rounded-full shrink-0 mt-0.5
                  bg-emerald-50 dark:bg-emerald-950/40
                  text-emerald-700 dark:text-emerald-400
                  text-[10px] font-bold font-heading
                ">
                  {i + 1}
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ol>
        </AccordionItem>
      )}

      {(product.ingredients ?? []).length > 0 && (
        <AccordionItem
          title="Key Ingredients"
          icon={FlaskConical}
          iconColor="text-violet-500"
        >
          <ul className="mt-1 grid grid-cols-2 gap-x-4 gap-y-2">
            {product.ingredients?.map((ing, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-violet-400 shrink-0" aria-hidden="true" />
                {ing}
              </li>
            ))}
          </ul>
        </AccordionItem>
      )}

      {(product.precautions ?? []).length > 0 && (
        <AccordionItem
          title="Precautions & Warnings"
          icon={AlertTriangle}
          iconColor="text-amber-500"
        >
          <ul className="space-y-2 mt-1">
            {product.precautions?.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </AccordionItem>
      )}
    </div>
  );
}