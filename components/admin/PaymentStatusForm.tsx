"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PaymentStatusFormProps = {
  orderId: number;
  currentPaymentStatus: string;
  hasReceipt: boolean;
};

export default function PaymentStatusForm({
  orderId,
  currentPaymentStatus,
  hasReceipt,
}: PaymentStatusFormProps) {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleUpdate = async (paymentStatus: "PAID" | "REJECTED") => {
    const confirmation =
      paymentStatus === "PAID"
        ? "Have you checked the bank account and confirmed that the payment was received?"
        : "Are you sure you want to reject this payment?";

    if (!window.confirm(confirmation)) {
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update payment.");
      }

      setMessage(data.message);
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
        <button
          type="button"
          onClick={() => handleUpdate("PAID")}
          disabled={
            isSaving ||
            !hasReceipt ||
            currentPaymentStatus !== "PENDING"
          }
        >
          {isSaving ? "SAVING..." : "MARK AS PAID"}
        </button>

        <button
          type="button"
          onClick={() => handleUpdate("REJECTED")}
          disabled={
            isSaving ||
            !hasReceipt ||
            currentPaymentStatus !== "PENDING"
          }
        >
          REJECT PAYMENT
        </button>
      </div>

      {!hasReceipt && currentPaymentStatus === "PENDING" && (
        <p className="admin-status-error">
          Waiting for the customer to upload a payment receipt.
        </p>
      )}

      {message && (
        <p className={error ? "admin-status-error" : "admin-status-success"}>
          {message}
        </p>
      )}
    </div>
  );
}
