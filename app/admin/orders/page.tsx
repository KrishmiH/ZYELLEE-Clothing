import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";

export const instant = false;

type AdminOrdersPageProps = {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const params = await searchParams;

  const search = params.search?.trim() || "";
  const allowedSorts = ["newest", "oldest", "highest", "lowest"];

  const sort = allowedSorts.includes(params.sort || "")
    ? params.sort!
    : "newest";

  const requestedPage = Number(params.page);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const allowedLimits = [10, 15, 25];
  const requestedLimit = Number(params.limit);
  const limit = allowedLimits.includes(requestedLimit)
    ? requestedLimit
    : 10;

  const where = search
    ? {
        OR: [
          { orderNumber: { contains: search, mode: "insensitive" as const } },
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "highest"
        ? { total: "desc" as const }
        : sort === "lowest"
          ? { total: "asc" as const }
          : { createdAt: "desc" as const };

  const [totalOrders, filteredOrders, totalCount] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
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
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const currentPage = Math.min(page, totalPages);

  // If the requested page no longer exists, return to the last valid page.
  if (page > totalPages) {
    const query = new URLSearchParams();

    if (search) query.set("search", search);
    query.set("sort", sort);
    query.set("limit", String(limit));
    query.set("page", String(totalPages));

    redirect(`/admin/orders?${query.toString()}`);
  }

  const buildPageUrl = (nextPage: number) => {
    const query = new URLSearchParams();

    if (search) query.set("search", search);

    query.set("sort", sort);
    query.set("limit", String(limit));
    query.set("page", String(nextPage));

    return `/admin/orders?${query.toString()}`;
  };

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
          <strong>{totalOrders}</strong>
        </div>

        {/* Search and filters */}

        <form method="GET" action="/admin/orders" className="admin-orders-filters">
          <div className="admin-orders-search">
            <label htmlFor="order-search">Search Orders</label>
            <input
              id="order-search"
              type="search"
              name="search"
              placeholder="Order number, customer, email or phone"
              defaultValue={search}
            />
          </div>

          <div className="admin-orders-filter">
            <label htmlFor="order-sort">Sort By</label>
            <select
              id="order-sort"
              name="sort"
              defaultValue={sort}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Total</option>
              <option value="lowest">Lowest Total</option>
            </select>
          </div>

          <div className="admin-orders-filter">
            <label htmlFor="order-limit">Orders Per Page</label>
            <select
              id="order-limit"
              name="limit"
              defaultValue={String(limit)}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="25">25</option>
            </select>
          </div>

          <input type="hidden" name="page" value="1" />

          <button type="submit" className="admin-orders-filter-button">
            APPLY FILTERS
          </button>

          <Link href="/admin/orders" className="admin-orders-reset">
            RESET
          </Link>
        </form>

        <p className="admin-orders-results">
          Showing {totalCount === 0 ? 0 : (currentPage - 1) * limit + 1}
          {" – "}
          {Math.min(currentPage * limit, totalCount)}
          {" of "}
          {totalCount} orders
        </p>

        {filteredOrders.length === 0 ? (
          <div className="admin-orders-empty">
            <h2>{search ? "No matching orders" : "No orders yet"}</h2>
            <p>
              {search
                ? "Try another search term or reset your filters."
                : "Customer orders will appear here when they are placed."}
            </p>
          </div>
        ) : (
          <>
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
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
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
                        LKR{" "}
                        {Number(order.total).toLocaleString("en-LK", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td>
                        {order.paymentMethod === "bank"
                          ? "Bank Transfer"
                          : "Cash on Delivery"}
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

                      <td>
                        <DeleteOrderButton
                          orderId={order.id}
                          orderNumber={order.orderNumber}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}

            <div className="admin-orders-pagination">
              <p>
                Page {currentPage} of {totalPages}
              </p>

              <div className="admin-orders-pagination-controls">
                {currentPage > 1 ? (
                  <Link
                    href={buildPageUrl(currentPage - 1)}
                    className="admin-orders-page-link"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span className="admin-orders-page-disabled">
                    ← Previous
                  </span>
                )}

                {currentPage < totalPages ? (
                  <Link
                    href={buildPageUrl(currentPage + 1)}
                    className="admin-orders-page-link"
                  >
                    Next →
                  </Link>
                ) : (
                  <span className="admin-orders-page-disabled">
                    Next →
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
