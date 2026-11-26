import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const instant = false;

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const productId = Number(id);

  if (!Number.isSafeInteger(productId) || productId <= 0) {
    notFound();
  }

  const product = await prisma.product.findUnique({
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

  if (!product) {
    notFound();
  }

  const initialProduct = {
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    description: product.description,
    images:
      product.images.length > 0
        ? product.images.map((image) => ({
            url: image.url,
            publicId: image.publicId,
          }))
        : [
            {
              url: product.image,
              publicId: null,
            },
          ],
    sizes: product.sizes,
    colors: product.colors,
    isNew: product.isNew,
  };

  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard-container">
        <Link
          href="/admin/products"
          className="admin-back-link"
        >
          ← Back to Products
        </Link>

        <p className="admin-dashboard-label">
          ZYELLEE STORE MANAGEMENT
        </p>

        <h1>Edit Product</h1>

        <p className="admin-dashboard-description">
          Update the details and photos of your product.
        </p>

        <div className="admin-product-form-container">
          <ProductForm
            key={initialProduct.id}
            product={initialProduct}
            />
        </div>
      </div>
    </main>
  );
}
