import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const instant = false;

export default async function AdminProductsPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard-container">
        <Link href="/admin" className="admin-back-link">
          ← Back to Dashboard
        </Link>

        <p className="admin-dashboard-label">
          ZYELLEE STORE MANAGEMENT
        </p>

        <div className="admin-products-header">
          <div>
            <h1>Products</h1>
            <p className="admin-dashboard-description">
              View and manage your store products.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="admin-add-product-button"
          >
            + Add Product
          </Link>
        </div>

        <div className="admin-orders-summary">
          <span>Total Products</span>
          <strong>{products.length}</strong>
        </div>

        {products.length === 0 ? (
          <div className="admin-orders-empty">
            <h2>No products yet</h2>
            <p>
              Add your first product to start building your collection.
            </p>
          </div>
        ) : (
          <div className="admin-orders-table-wrapper">
            <table className="admin-orders-table admin-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Sizes</th>
                  <th>Colours</th>
                  <th>Collection</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-product-info">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="admin-product-thumbnail"
                        />
                        <strong>{product.name}</strong>
                      </div>
                    </td>

                    <td>{product.category}</td>

                    <td>
                      LKR {Number(product.price).toLocaleString("en-LK")}
                    </td>

                    <td>{product.sizes.join(", ")}</td>

                    <td>{product.colors.join(", ")}</td>

                    <td>
                      <span
                        className={`admin-order-status ${
                          product.isNew
                            ? "status-processing"
                            : "status-delivered"
                        }`}
                      >
                        {product.isNew ? "NEW" : "REGULAR"}
                      </span>
                    </td>

                    <td>
                      <div className="admin-product-actions">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="admin-order-link"
                        >
                          Edit
                        </Link>

                        <DeleteProductButton
                          productId={product.id}
                          productName={product.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
