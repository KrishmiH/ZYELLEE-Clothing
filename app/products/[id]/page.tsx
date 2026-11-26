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
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!databaseProduct) {
    notFound();
  }

  const product = {
    ...databaseProduct,
    price: Number(databaseProduct.price),
    image:
      databaseProduct.images[0]?.url || databaseProduct.image,
    images:
      databaseProduct.images.length > 0
        ? databaseProduct.images.map((image) => image.url)
        : [databaseProduct.image],
  };

  return <ProductDetails product={product} />;
}
