"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBanner } from "../serverActions";
import R2Upload from "@/components/R2Upload";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { toast } from "@/lib/toast";

const inputCls =
  "w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const textareaCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const selectCls =
  "w-full h-10 rounded-lg border border-border bg-background px-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow appearance-none cursor-pointer";

const labelCls =
  "block mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

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

export default function BannerNewForm() {
  const [isPending, start] = useTransition();
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    start(async () => {
      try {
        await createBanner(data);

        toast.success("Banner created successfully");

        setTimeout(() => {
          router.push("/admin/banners");
        }, 300);
      } catch (e: unknown) { const error = e as { message?: string; digest?: string };
        if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) return;
        toast.error("Failed to create banner", error?.message);
      }
    });
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-8 space-y-6">
      <form onSubmit={handleSubmit} noValidate aria-label="Create banner" className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="flex flex-col items-start text-left">
            <div className="[&_h1]:text-left [&_h1]:m-0">
               <PageHeader title="Create Banner" />
            </div>
            <p className="text-sm text-muted-foreground/80 mt-1 text-left">
              Create a new promotional popup banner.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <AdminButton 
              type="submit" 
              variant="success" 
              className="w-full sm:min-w-[140px]"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Banner"}
            </AdminButton>
            
            <Link href="/admin/banners" className="w-full sm:w-auto">
              <AdminButton type="button" variant="secondary" className="w-full">
                Discard
              </AdminButton>
            </Link>
          </div>
        </div>

        <input type="hidden" name="imageUrl" value={imageUrl} />
        <input type="hidden" name="isActive" value="on" />

        <Sec title="Banner Configuration" sub="Set the type and visual content.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <F id="type" lbl="Banner Type">
              <div className="relative">
                <select name="type" id="type" className={selectCls}>
                  <option value="TEXT">Text Banner</option>
                  <option value="IMAGE_ONLY">Image Only</option>
                </select>
                <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">▾</span>
              </div>
            </F>
            <F id="title" lbl="Banner Title">
              <input id="title" name="title" placeholder="Summer Sale!" className={inputCls} />
            </F>
          </div>
          <F id="message" lbl="Banner Message">
            <textarea id="message" name="message" rows={3} placeholder="Get 20% off all products..." className={textareaCls} />
          </F>
        </Sec>

        <AdminCard>
          <div className="mb-4 text-left border-b border-border pb-4">
            <SectionHeading title="Banner Image" subtitle="Upload the visual for your popup." />
          </div>
          <div className="py-2">
            <R2Upload folder="banners" onUploaded={setImageUrl} />
            {imageUrl && (
              <p className="mt-2 text-xs text-primary font-medium">Image uploaded successfully</p>
            )}
          </div>
        </AdminCard>

        <Sec title="Call to Action & Schedule" sub="Where the banner links and when it shows.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <F id="buttonText" lbl="Button Text">
              <input id="buttonText" name="buttonText" placeholder="Shop Now" className={inputCls} />
            </F>
            <F id="buttonLink" lbl="Button Link">
              <input id="buttonLink" name="buttonLink" placeholder="/collections/all" className={inputCls} />
            </F>
            <F id="startAt" lbl="Start Date & Time">
              <input id="startAt" name="startAt" type="datetime-local" className={inputCls} />
            </F>
            <F id="endAt" lbl="End Date & Time">
              <input id="endAt" name="endAt" type="datetime-local" className={inputCls} />
            </F>
          </div>
        </Sec>

      </form>
    </div>
  );
}