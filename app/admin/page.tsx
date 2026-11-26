import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function AdminDashboardPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    salesResult,
  ] = await Promise.all([
    prisma.order.count(),

    prisma.order.count({
      where: { status: "PENDING" },
    }),

    prisma.order.count({
      where: { status: "DELIVERED" },
    }),

    prisma.order.aggregate({
      where: { status: "DELIVERED" },
      _sum: { total: true },
    }),
  ]);

  const totalSales = Number(salesResult._sum.total ?? 0);

  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard-container">
        <p className="admin-dashboard-label">
          ZYELLEE STORE MANAGEMENT
        </p>

        <h1>Admin Dashboard</h1>

        <p className="admin-dashboard-description">
          Welcome to your store management dashboard.
        </p>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <p>Total Orders</p>
            <h2>{totalOrders}</h2>
            <span>All customer orders</span>
          </div>

          <div className="admin-stat-card">
            <p>Pending Orders</p>
            <h2>{pendingOrders}</h2>
            <span>Waiting for processing</span>
          </div>

          <div className="admin-stat-card">
            <p>Completed Orders</p>
            <h2>{completedOrders}</h2>
            <span>Successfully delivered</span>
          </div>

          <div className="admin-stat-card">
            <p>Total Sales</p>
            <h2>
              LKR {totalSales.toLocaleString("en-LK", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
            <span>Revenue from delivered orders</span>
          </div>
        </div>

        <div className="admin-dashboard-grid">
          <Link href="/admin/orders" className="admin-dashboard-card">
            <h2>Orders</h2>
            <p>View and manage customer orders.</p>
          </Link>

          <Link href="/admin/products" className="admin-dashboard-card">
            <h2>Products</h2>
            <p>Manage your store products.</p>
          </Link>

          <div className="admin-dashboard-card">
            <h2>Customers</h2>
            <p>View customer information.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
