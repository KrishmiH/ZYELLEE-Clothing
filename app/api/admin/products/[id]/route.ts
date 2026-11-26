import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-session";
import cloudinary from "@/lib/cloudinary";

type ProductImageInput = {
  url: string;
  publicId: string | null;
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

const isValidImages = (images: unknown): images is ProductImageInput[] => {
  return (
    Array.isArray(images) &&
    images.length >= 1 &&
    images.length <= 5 &&
    images.every(
      (image) =>
        image &&
        typeof image.url === "string" &&
        /^https:\/\//.test(image.url) &&
        (image.publicId === null ||
          (typeof image.publicId === "string" &&
            image.publicId.trim().length > 0))
    )
  );
};

function validProductData(body: Record<string, unknown>) {
  return (
    typeof body.name === "string" &&
    !!body.name.trim() &&
    typeof body.category === "string" &&
    ["Tops", "Dresses", "Bottoms"].includes(body.category) &&
    typeof body.description === "string" &&
    !!body.description.trim() &&
    Number.isFinite(Number(body.price)) &&
    Number(body.price) > 0 &&
    isValidImages(body.images) &&
    Array.isArray(body.sizes) &&
    body.sizes.length > 0 &&
    body.sizes.every(
      (size) => typeof size === "string" && size.trim()
    ) &&
    Array.isArray(body.colors) &&
    body.colors.length > 0 &&
    body.colors.every(
      (color) => typeof color === "string" && color.trim()
    ) &&
    typeof body.isNew === "boolean"
  );
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const productId = Number(id);

    if (!Number.isSafeInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { message: "Invalid product ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!validProductData(body)) {
      return NextResponse.json(
        { message: "Please provide valid product information and images." },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    const images = body.images as ProductImageInput[];

    const retainedPublicIds = new Set(
      images
        .map((image) => image.publicId)
        .filter((id): id is string => !!id)
    );

    const removedPublicIds = existingProduct.images
      .map((image) => image.publicId)
      .filter(
        (id): id is string =>
          !!id && !retainedPublicIds.has(id)
      );

    await prisma.product.update({
      where: { id: productId },
      data: {
        name: (body.name as string).trim(),
        category: body.category as string,
        price: Number(body.price),
        description: (body.description as string).trim(),
        image: images[0].url,
        sizes: [
          ...new Set(
            (body.sizes as string[]).map((size) => size.trim())
          ),
        ],
        colors: [
          ...new Set(
            (body.colors as string[]).map((color) => color.trim())
          ),
        ],
        isNew: body.isNew as boolean,
        images: {
          deleteMany: {},
          create: images.map((image, index) => ({
            url: image.url,
            publicId: image.publicId,
            position: index,
          })),
        },
      },
    });

    // Remove images from Cloudinary that are no longer used.
    await Promise.allSettled(
      removedPublicIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId)
      )
    );

    return NextResponse.json({
      message: "Product updated successfully!",
    });
  } catch (error) {
    console.error("Product update error:", error);

    return NextResponse.json(
      { message: "Unable to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const productId = Number(id);

    if (!Number.isSafeInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { message: "Invalid product ID." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    // Delete the product's Cloudinary images.
    const publicIds = product.images
      .map((image) => image.publicId)
      .filter((id): id is string => !!id);

    await Promise.allSettled(
      publicIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId)
      )
    );

    return NextResponse.json({
      message: "Product deleted successfully!",
    });
  } catch (error) {
    console.error("Product deletion error:", error);

    return NextResponse.json(
      { message: "Unable to delete product." },
      { status: 500 }
    );
  }
}
