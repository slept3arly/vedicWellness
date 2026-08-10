import PageHeader from "@/components/public/ui/PageHeader";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import { getAllCompanies } from "@/lib/db/company";
import { createCompanyAction, toggleCompanyAction, updateCompanyAction } from "./serverActions";
import { Check, Info } from "lucide-react";

export default async function AdminCompaniesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const companies = await getAllCompanies();
  const status = (await searchParams).status;
  const statusMessage = status === "created" ? "Company added successfully." : status === "updated" ? "Company name updated." : status === "toggled" ? "Company status updated." : "";
  return <div className="mx-auto max-w-5xl space-y-6">
    <PageHeader title="Companies & Brands" subtitle="Manage the brands shown in your product catalogue." />
    {statusMessage && <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><Check size={16} />{statusMessage}</div>}
    <AdminCard>
      <div className="mb-4"><h2 className="font-heading text-lg font-bold">Add Company</h2><p className="mt-1 text-sm text-muted-foreground">New companies are available for product assignment immediately.</p></div>
      <form action={createCompanyAction} className="flex flex-col gap-3 sm:flex-row"><input name="name" required placeholder="Company name" aria-label="Company name" className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm" /><AdminButton type="submit" variant="primary">+ Add Company</AdminButton></form>
    </AdminCard>
    <div className="space-y-3">
      {companies.map((company) => <AdminCard key={company.id} className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <form action={updateCompanyAction} className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row"><input type="hidden" name="id" value={company.id} /><input name="name" defaultValue={company.name} required aria-label={`Name for ${company.name}`} className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm" /><AdminButton type="submit" variant="secondary">Save name</AdminButton></form>
          <div className="flex flex-wrap items-center gap-3 text-sm"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${company.active ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}>{company.active ? "Active" : "Inactive"}</span><span className="text-muted-foreground">{company.productCount} {company.productCount === 1 ? "product" : "products"}</span><form action={toggleCompanyAction} title={company.active && company.productCount > 0 ? "Products stay assigned and are hidden from active company lists." : undefined}><input type="hidden" name="id" value={company.id} /><AdminButton type="submit" variant="secondary">{company.active ? "Deactivate" : "Activate"}</AdminButton></form></div>
        </div>
        {company.active && company.productCount > 0 && <p className="flex items-start gap-2 text-xs text-muted-foreground"><Info size={14} className="mt-0.5 shrink-0" />Deactivating this company keeps its {company.productCount} assigned {company.productCount === 1 ? "product" : "products"}; they will simply be hidden from active company browsing.</p>}
      </AdminCard>)}
    </div>
  </div>;
}
