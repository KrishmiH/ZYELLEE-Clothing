import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await prisma.product.findMany({
    include: {
      images: true,
    },
  });

  let migratedCount = 0;

  for (const product of products) {
    // Skip products that already have images in the new table.
    if (product.images.length > 0) {
      continue;
    }

    if (!product.image) {
      continue;
    }

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: product.image,
        publicId: null,
        position: 0,
      },
    });

    migratedCount++;
  }

  console.log(`Successfully migrated ${migratedCount} product images.`);
}

main()
  .catch((error) => {
    console.error("Image migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
