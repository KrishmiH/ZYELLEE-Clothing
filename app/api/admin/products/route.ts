import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-session";

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      name,
      category,
      price,
      description,
      images,
      sizes,
      colors,
      isNew,
    } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !["Tops", "Dresses", "Bottoms"].includes(category) ||
      typeof description !== "string" ||
      !description.trim() ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0 ||
      !Array.isArray(images) ||
      images.length === 0 ||
      images.length > 5 ||
      !images.every(
        (image) =>
          image &&
          typeof image.url === "string" &&
          typeof image.publicId === "string" &&
          /^https:\/\//.test(image.url) &&
          image.publicId.trim()
      ) ||
      !Array.isArray(sizes) ||
      sizes.length === 0 ||
      !sizes.every((size) => typeof size === "string" && size.trim()) ||
      !Array.isArray(colors) ||
      colors.length === 0 ||
      !colors.every((color) => typeof color === "string" && color.trim()) ||
      typeof isNew !== "boolean"
    ) {
      return NextResponse.json(
        { message: "Please provide valid product information and images." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        category,
        price: Number(price),
        description: description.trim(),

        // Keep the first image in the legacy field temporarily.
        image: images[0].url,

        sizes: [...new Set(sizes.map((size: string) => size.trim()))],
        colors: [...new Set(colors.map((color: string) => color.trim()))],
        isNew,

        images: {
          create: images.map(
            (
              image: { url: string; publicId: string },
              index: number
            ) => ({
              url: image.url,
              publicId: image.publicId,
              position: index,
            })
          ),
        },
      },
    });

    return NextResponse.json(
      {
        message: "Product added successfully!",
        productId: product.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product creation error:", error);

    return NextResponse.json(
      { message: "Something went wrong while adding the product." },
      { status: 500 }
    );
  }
}
