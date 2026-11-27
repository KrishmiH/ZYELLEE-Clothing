import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function AdminOrdersPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      orderNumber: true,
      firstName: true,
      lastName: true,
      email: true,
      total: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      paymentReceipt: true,
      createdAt: true,
      items: {
        select: {
          id: true,
        },
      },
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

        <h1>Orders</h1>

        <p className="admin-dashboard-description">
          View and manage customer orders.
        </p>

        <div className="admin-orders-summary">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>

        {orders.length === 0 ? (
          <div className="admin-orders-empty">
            <h2>No orders yet</h2>
            <p>Customer orders will appear here when they are placed.</p>
          </div>
        ) : (
          <div className="admin-orders-table-wrapper">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment Method</th>
                  <th>Payment Status</th>
                  <th>Receipt</th>
                  <th>Order Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                        <Link
                            href={`/admin/orders/${order.id}`}
                            className="admin-order-link"
                        >
                            {order.orderNumber}
                        </Link>
                    </td>

                    <td>
                      <strong>
                        {order.firstName} {order.lastName}
                      </strong>
                      <span className="admin-order-email">
                        {order.email}
                      </span>
                    </td>

                    <td>
                      {new Intl.DateTimeFormat("en-LK", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(order.createdAt)}
                    </td>

                    <td>{order.items.length}</td>

                    <td>
                      LKR {Number(order.total).toLocaleString("en-LK", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td>
                      {order.paymentMethod === "bank" ? "Bank Transfer" : "Cash on Delivery"}
                    </td>

                    <td>
                      <span
                        className={`admin-order-status status-${order.paymentStatus.toLowerCase()}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td>
                      {order.paymentReceipt ? (
                        <a
                          href={order.paymentReceipt}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-order-link"
                        >
                          View Receipt
                        </a>
                      ) : (
                        <span>Not uploaded</span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`admin-order-status status-${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
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
