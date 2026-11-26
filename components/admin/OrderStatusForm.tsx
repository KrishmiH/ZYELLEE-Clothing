"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

type OrderStatusFormProps = {
  orderId: number;
  currentStatus: string;
};

export default function OrderStatusForm({
  orderId,
  currentStatus,
}: OrderStatusFormProps) {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleUpdate = async () => {
    setIsSaving(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update status.");
      }

      setMessage("Order status updated successfully.");
      router.refresh();
    } catch (err) {
      setError(true);
      setMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-status-form">
      <div className="admin-status-controls">
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setMessage("");
          }}
          disabled={isSaving}
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleUpdate}
          disabled={isSaving || status === currentStatus}
        >
          {isSaving ? "SAVING..." : "UPDATE STATUS"}
        </button>
      </div>

      {message && (
        <p className={error ? "admin-status-error" : "admin-status-success"}>
          {message}
        </p>
      )}
    </div>
  );
}