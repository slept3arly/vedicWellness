import { getAdminProducts } from "@/lib/db/product";
import AdminProductsClient from "./AdminProductsClient";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();
  return <AdminProductsClient products={products} />;
}
