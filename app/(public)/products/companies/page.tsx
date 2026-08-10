import Link from "next/link";
import PageHeader from "@/components/public/ui/PageHeader";
import Card from "@/components/public/ui/Card";
import { getActiveCompanies } from "@/lib/db/company";
import { ArrowLeft, Building2 } from "lucide-react";

export default async function ProductCompaniesPage() {
  const companies = (await getActiveCompanies()).filter((company) => company.slug !== "vedic-wellness");
  if (companies.length === 0) return <section className="mx-auto max-w-3xl px-6 py-12"><PageHeader title="Browse Our Other Products" subtitle="There are no other active companies to browse right now." /><Link href="/products" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"><ArrowLeft size={16} />Back to Vedic Wellness Products</Link></section>;
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <PageHeader title="Browse Our Other Products" subtitle="Choose a company to view its products." />
      <Link href="/products" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"><ArrowLeft size={16} />Back to Vedic Wellness Products</Link>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {companies.map((company) => (
          <Link key={company.id} href={`/products?company=${company.slug}`}>
            <Card className="flex items-center gap-3 p-6 transition hover:border-accent"><Building2 size={20} className="text-accent" /><h2 className="font-heading text-lg font-bold">{company.name}</h2></Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
