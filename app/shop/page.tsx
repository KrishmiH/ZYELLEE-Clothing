import { prisma } from "@/lib/prisma";
import ShopContent from "@/components/products/ShopContent";

export const instant = false;

export default async function ShopPage() {
  const databaseProducts = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  const products = databaseProducts.map((product) => ({
    ...product,
    price: Number(product.price),
    image:
      product.images[0]?.url || product.image,
    images:
      product.images.length > 0
        ? product.images.map((image) => image.url)
        : [product.image],
  }));

  return <ShopContent products={products} />;
}
