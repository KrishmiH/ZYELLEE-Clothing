
export const instant = false;

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetails from "@/components/products/ProductDetails";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const productId = Number(id);

  if (!Number.isSafeInteger(productId) || productId <= 0) {
    notFound();
  }

  const databaseProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!databaseProduct) {
    notFound();
  }

  const product = {
    ...databaseProduct,
    price: Number(databaseProduct.price),
  };

  return <ProductDetails product={product} />;
}
