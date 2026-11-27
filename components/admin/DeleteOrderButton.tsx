"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteOrderButton({
  orderId,
  orderNumber,
}: {
  orderId: number;
  orderNumber: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete order ${orderNumber}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete order.");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="admin-order-delete-button"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <p className="admin-order-delete-error">{error}</p>
      )}
    </div>
  );
}
