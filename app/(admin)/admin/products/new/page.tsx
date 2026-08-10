import ProductNewForm from "./ProductNewForm";
import { getActiveCompanies } from "@/lib/db/company";

export default async function NewProductPage() {
  return <ProductNewForm companies={await getActiveCompanies()} />;
}
