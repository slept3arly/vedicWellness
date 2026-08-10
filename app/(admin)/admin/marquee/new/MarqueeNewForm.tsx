"use client";

import Link from "next/link";
import { useTransition } from "react";
import { createMarqueeItem } from "../serverActions";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { toast } from "@/lib/toast";

/* ── shared class strings (matching ProductNewForm) ── */

const inputCls =
  "w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const labelCls =
  "block mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

/* ── primitives ── */

function F({ id, lbl, tip, req, children }: {
  id?: string; lbl: string; tip?: string; req?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="w-full text-left">
      <label htmlFor={id} className={labelCls}>
        {lbl}{req && <span className="ml-0.5 text-destructive" aria-hidden>*</span>}
      </label>
      {children}
      {tip && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 opacity-80">{tip}</p>}
    </div>
  );
}

function Sec({ title, sub, children }: {
  title: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <AdminCard>
      <div className="mb-5 pb-4 border-b border-border text-left">
        <SectionHeading title={title} subtitle={sub} />
      </div>
      <div className="space-y-5">{children}</div>
    </AdminCard>
  );
}

/* ── main ── */

export default function MarqueeNewForm() {
  const [isPending, start] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    
    start(async () => {
      try {
        await createMarqueeItem(data);
        toast.success("Marquee item created successfully.");
      } catch (e: unknown) { const error = e as { message?: string; digest?: string };
        if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) return;
        toast.error("Failed to create marquee item", error?.message);
      }
    });
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-8 space-y-6">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        
        {/* Header: Strictly left-aligned with responsive buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="flex flex-col items-start text-left">
            <div className="[&_h1]:text-left [&_h1]:m-0">
               <PageHeader title="Add Marquee Text" />
            </div>
            <p className="text-sm text-muted-foreground/80 mt-1 text-left">
              Create a new announcement for the homepage slider.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <AdminButton 
              type="submit" 
              variant="success" 
              className="w-full sm:min-w-[140px]"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Item"}
            </AdminButton>
            
            <Link href="/admin/marquee" className="w-full sm:w-auto">
              <AdminButton type="button" variant="secondary" className="w-full">
                Discard
              </AdminButton>
            </Link>
          </div>
        </div>

        {/* Hidden Publish State - Default true */}
        <input type="hidden" name="isActive" value="on" />

        {/* Content Section */}
        <Sec title="Announcement Details" sub="Configure the text and display sequence.">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <F id="text" lbl="Announcement Content" req>
                <input 
                  id="text" 
                  name="text" 
                  placeholder="e.g., NEW PRODUCTS LIVE NOW" 
                  required 
                  className={inputCls} 
                />
              </F>
            </div>
            <F id="order" lbl="Display Order" tip="Lower numbers show first">
              <input 
                id="order" 
                name="order" 
                type="number" 
                defaultValue="0" 
                className={inputCls} 
              />
            </F>
          </div>
        </Sec>

      </form>
    </div>
  );
}