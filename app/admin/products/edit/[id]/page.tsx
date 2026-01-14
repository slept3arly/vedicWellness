import { prisma } from "@/lib/prisma";
import ProductEditForm from "./ProductEditForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id },
  });

  if (!product) return <div>Product not found.</div>;

  return <ProductEditForm product={product} />;
}
