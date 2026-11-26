import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-session";
import ProductForm from "@/components/admin/ProductForm";

export const instant = false;

export default async function NewProductPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard-container">
        <Link href="/admin/products" className="admin-back-link">
          ← Back to Products
        </Link>

        <p className="admin-dashboard-label">
          ZYELLEE STORE MANAGEMENT
        </p>

        <h1>Add Product</h1>

        <p className="admin-dashboard-description">
          Add a new item to your clothing collection.
        </p>

        <div className="admin-product-form-container">
          <ProductForm />
        </div>
      </div>
    </main>
  );
}
