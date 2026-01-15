import { prisma } from "@/lib/db/prisma";
import ProductEditForm from "./ProductEditForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const product = await prisma.product.findFirst({
    where: { id },
  });

  if (!product) return <div>Product not found.</div>;

  return <ProductEditForm product={product} />;
}
