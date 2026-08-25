import Link from "next/link";
import PageHeader from "@/components/public/ui/PageHeader";
import { getActiveCompanies } from "@/lib/db/company";
import { getCompanyLogoUrl } from "@/lib/public/companyLogo";
import { ArrowLeft } from "lucide-react";

export const revalidate = 21600;

export default async function ProductCompaniesPage() {
  const companies = (await getActiveCompanies()).map((company) => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
    logoUrl: getCompanyLogoUrl(company.slug) ?? "",
  }));

  if (companies.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <PageHeader
          title="Browse Our Other Products"
          subtitle="No active companies yet. Companies appear here once they are activated."
        />
        <div className="text-center">
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Vedic Wellness Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pt-10 pb-20 space-y-10">
      <PageHeader
        badge={
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Company and brand directory
          </span>
        }
        title="Browse Our Other Products"
        subtitle="Choose a company to view its products."
      />

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {companies.map((company) => (
          <li key={company.id}>
            <Link
              href={
                company.slug === "vedic-wellness"
                  ? "/products"
                  : `/products?company=${company.slug}`
              }
              prefetch={false}
              className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-[var(--border-soft)] bg-neutral-900/[0.06] px-3 transition-colors duration-200 hover:border-brand-accent/40 hover:bg-neutral-900/[0.09] dark:bg-white/[0.08] dark:hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]"
            >
              {company.logoUrl && (
                <img
                  src={company.logoUrl}
                  alt=""
                  loading="lazy"
                  className="h-9 w-auto max-w-full object-contain"
                />
              )}
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                {company.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Vedic Wellness Products
        </Link>
      </div>
    </section>
  );
}