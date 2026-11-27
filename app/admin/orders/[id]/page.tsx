import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import OrderStatusForm from "@/components/admin/OrderStatusForm";
import PaymentStatusForm from "@/components/admin/PaymentStatusForm";

export const instant = false;

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const orderId = Number(id);

  if (!Number.isSafeInteger(orderId) || orderId <= 0) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const formatPrice = (value: unknown) =>
    `LKR ${Number(value).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard-container">
        <Link href="/admin/orders" className="admin-back-link">
          ← Back to Orders
        </Link>

        <p className="admin-dashboard-label">
          ZYELLEE STORE MANAGEMENT
        </p>

        <h1>Order Details</h1>

        <p className="admin-dashboard-description">
          Order #{order.orderNumber}
        </p>

        <div className="admin-order-details-grid">
          <section className="admin-order-details-card">
            <h2>Customer Information</h2>

            <div className="admin-order-info-row">
              <span>Customer Name</span>
              <strong>{order.firstName} {order.lastName}</strong>
            </div>

            <div className="admin-order-info-row">
              <span>Email Address</span>
              <strong>{order.email}</strong>
            </div>

            <div className="admin-order-info-row">
              <span>Phone Number</span>
              <strong>{order.phone}</strong>
            </div>
          </section>

          <section className="admin-order-details-card">
            <h2>Delivery Information</h2>

            <div className="admin-order-info-row">
              <span>Address</span>
              <strong>{order.address}</strong>
            </div>

            {order.address2 && (
              <div className="admin-order-info-row">
                <span>Additional Address</span>
                <strong>{order.address2}</strong>
              </div>
            )}

            <div className="admin-order-info-row">
              <span>City</span>
              <strong>{order.city}</strong>
            </div>

            <div className="admin-order-info-row">
              <span>Postal Code</span>
              <strong>{order.postalCode}</strong>
            </div>
          </section>

          <section className="admin-order-details-card">
            <h2>Order Information</h2>

            <div className="admin-order-info-row">
              <span>Order Date</span>
              <strong>
                {new Intl.DateTimeFormat("en-LK", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(order.createdAt)}
              </strong>
            </div>

            <div className="admin-order-info-row">
              <span>Payment Method</span>
              <strong>
                {order.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Bank Transfer"}
              </strong>
            </div>

            <div className="admin-order-info-row">
              <span>Payment Status</span>
              <strong>{order.paymentStatus}</strong>
            </div>

            <div className="admin-order-status-section">
              <span>Order Status</span>

              <OrderStatusForm
                orderId={order.id}
                currentStatus={order.status}
              />

              {order.paymentMethod === "bank" && (
                <div className="admin-order-status-section">
                  <span>Payment Verification</span>

                  {order.paymentReceipt ? (
                    <a
                      href={order.paymentReceipt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-order-link"
                    >
                      VIEW PAYMENT RECEIPT
                    </a>
                  ) : (
                    <p>No payment receipt uploaded yet.</p>
                  )}

                  <PaymentStatusForm
                    orderId={order.id}
                    currentPaymentStatus={order.paymentStatus}
                    hasReceipt={Boolean(order.paymentReceipt)}
                  />
                </div>
              )}

            </div>
          </section>
        </div>

        <section className="admin-order-products">
          <h2>Ordered Products</h2>

          <div className="admin-orders-table-wrapper">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Colour</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.size}</td>
                    <td>{item.color}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>
                      {formatPrice(Number(item.price) * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-order-totals">
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(order.subtotal)}</strong>
            </div>

            <div>
              <span>Shipping</span>
              <strong>{formatPrice(order.shippingCost)}</strong>
            </div>

            <div className="admin-order-grand-total">
              <span>Total</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
