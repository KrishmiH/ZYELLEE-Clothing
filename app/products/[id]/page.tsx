export const instant = false;

import { notFound } from "next/navigation";
import { products } from "@/lib/products";
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

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
