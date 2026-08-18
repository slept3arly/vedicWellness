import Link from "next/link";
import PageHeader from "@/components/public/ui/PageHeader";
import CompanySelector from "@/components/public/product/CompanySelector";
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

      <CompanySelector companies={companies} size="lg" />

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