import { prisma } from "@/lib/prisma";
import ShopContent from "@/components/products/ShopContent";

export const instant = false;

export default async function ShopPage() {
  const databaseProducts = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const products = databaseProducts.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return <ShopContent products={products} />;
}
