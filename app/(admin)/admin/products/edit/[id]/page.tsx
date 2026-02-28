import { prisma } from "@/lib/db/prisma";
import ProductEditForm from "./ProductEditForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return notFound();

  return <ProductEditForm product={product} />;
}