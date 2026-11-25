import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-session";

export const instant = false;

export default async function AdminDashboardPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

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

        <div className="admin-dashboard-grid">
          <div className="admin-dashboard-card">
            <h2>Orders</h2>
            <p>View and manage customer orders.</p>
          </div>

          <div className="admin-dashboard-card">
            <h2>Products</h2>
            <p>Manage your store products.</p>
          </div>

          <div className="admin-dashboard-card">
            <h2>Customers</h2>
            <p>View customer information.</p>
          </div>
        </div>
      </div>
    </main>
  );
}