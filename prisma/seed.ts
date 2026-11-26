import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const products = [
  {
    id: 1,
    name: "Everyday Blouse",
    category: "Tops",
    price: 3500,
    description:
      "A timeless everyday blouse designed for effortless styling and comfort.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beige", "White"],
    isNew: true,
  },
  {
    id: 2,
    name: "Classic Dress",
    category: "Dresses",
    price: 4500,
    description:
      "An elegant dress for everyday occasions and special moments.",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Brown"],
    isNew: true,
  },
  {
    id: 3,
    name: "Modern Essentials",
    category: "Tops",
    price: 3900,
    description:
      "A versatile piece that complements your everyday wardrobe.",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=700",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Cream"],
    isNew: false,
  },
  {
    id: 4,
    name: "Everyday Elegance",
    category: "Dresses",
    price: 4200,
    description:
      "A modern fashion piece designed with simplicity in mind.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700",
    sizes: ["S", "M", "L"],
    colors: ["Beige", "Black"],
    isNew: true,
  },
  {
    id: 5,
    name: "Relaxed Trousers",
    category: "Bottoms",
    price: 4800,
    description:
      "Comfortable trousers for a relaxed and polished look.",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Beige"],
    isNew: false,
  },
  {
    id: 6,
    name: "Casual Collection",
    category: "Tops",
    price: 3200,
    description:
      "An effortless addition to your casual wardrobe.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700",
    sizes: ["S", "M", "L"],
    colors: ["White", "Brown"],
    isNew: false,
  },
  {
    id: 7,
    name: "Signature Outfit",
    category: "Dresses",
    price: 5500,
    description:
      "A refined style for women who appreciate simple elegance.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Cream"],
    isNew: true,
  },
  {
    id: 8,
    name: "Classic Bottoms",
    category: "Bottoms",
    price: 4300,
    description:
      "A versatile everyday essential with a timeless look.",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=700",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Brown", "Black"],
    isNew: false,
  },
];

async function main() {
  for (const product of products) {
    const { id, ...productData } = product;

    await prisma.product.upsert({
      where: { id },
      update: productData,
      create: { id, ...productData },
    });
  }

  console.log("Successfully seeded 8 ZYELLEE products.");
}

main()
  .catch((error) => {
    console.error("Product seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
