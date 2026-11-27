"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { bankDetails } from "@/lib/bank-details";

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const [orderTotal, setOrderTotal] = useState(0);
  const [customerEmail, setCustomerEmail] = useState("");

  const [selectedReceipt, setSelectedReceipt] = useState<File | null>(null);

  const [receiptUploading, setReceiptUploading] = useState(false);
  const [receiptMessage, setReceiptMessage] = useState("");
  const [receiptError, setReceiptError] = useState("");

  const uploadReceipt = async (
    file: File,
    targetOrderNumber: string,
    targetEmail: string
  ) => {
    setReceiptUploading(true);
    setReceiptMessage("");
    setReceiptError("");

    try {
      const formData = new FormData();

      formData.append("receipt", file);
      formData.append("orderNumber", targetOrderNumber);
      formData.append("email", targetEmail);

      const response = await fetch("/api/orders/receipt", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Receipt upload failed.");
      }

      setReceiptMessage("Payment receipt uploaded successfully!");
      setReceiptError("");
      setSelectedReceipt(null);

      return true;
    } catch (error) {
      setReceiptError(
        error instanceof Error
          ? error.message
          : "Unable to upload receipt."
      );

      return false;
    } finally {
      setReceiptUploading(false);
    }
  };

  const handlePlaceOrder = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (paymentMethod === "bank" && !selectedReceipt) {
      setErrorMessage("Please select your bank payment receipt.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const formData = new FormData(event.currentTarget);

      const email = String(formData.get("email"));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          phone: formData.get("phone"),
          address: formData.get("address"),
          address2: formData.get("address2"),
          city: formData.get("city"),
          postalCode: formData.get("postalCode"),
          paymentMethod,
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to place your order.");
      }

      const newOrderNumber = data.order.orderNumber;

      setOrderNumber(newOrderNumber);
      setOrderTotal(data.order.total);
      setCustomerEmail(email);

      clearCart();

      if (paymentMethod === "bank" && selectedReceipt) {
        await uploadReceipt(
          selectedReceipt,
          newOrderNumber,
          email
        );
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceiptRetry = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const file = formData.get("receipt");

    if (!(file instanceof File) || file.size === 0) {
      setReceiptError("Please select a receipt.");
      return;
    }

    const success = await uploadReceipt(
      file,
      orderNumber,
      customerEmail
    );

    if (success) {
      formElement.reset();
    }
  };

  const handleReceiptUpload = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formElement = event.currentTarget;

    setReceiptUploading(true);
    setReceiptMessage("");
    setReceiptError("");

    try {
      const formData = new FormData(event.currentTarget);

      formData.append("orderNumber", orderNumber);
      formData.append("email", customerEmail);

      const response = await fetch("/api/orders/receipt", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Receipt upload failed.");
      }

      setReceiptMessage("Your payment receipt has been uploaded successfully!");
      formElement.reset();
    } catch (error) {
      setReceiptError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setReceiptUploading(false);
    }
  };

  if (orderNumber) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <h1>Thank You for Your Order!</h1>

          <p>Your order has been successfully placed.</p>

          <p>
            Your order number is: <strong>{orderNumber}</strong>
          </p>

         {paymentMethod === "bank" && (
          <div className="checkout-bank-details">
            <div className="checkout-bank-heading">
              <h3>Bank Transfer Details</h3>
              <p>Your order has been received. Here are your payment details.</p>
            </div>

            <div className="checkout-bank-information">
              <div>
                <span>Bank Name</span>
                <strong>{bankDetails.bankName}</strong>
              </div>

              <div>
                <span>Account Name</span>
                <strong>{bankDetails.accountName}</strong>
              </div>

              <div>
                <span>Account Number</span>
                <strong>{bankDetails.accountNumber}</strong>
              </div>

              <div>
                <span>Branch</span>
                <strong>{bankDetails.branch}</strong>
              </div>

              <div className="checkout-bank-amount">
                <span>Amount Transferred</span>
                <strong>
                  LKR {orderTotal.toLocaleString("en-LK")}
                </strong>
              </div>
            </div>

            {receiptMessage && (
              <p className="checkout-receipt-success">
                {receiptMessage}
              </p>
            )}

            {receiptError && (
              <div className="checkout-receipt-upload">
                <p className="checkout-receipt-error">{receiptError}</p>

                <form onSubmit={handleReceiptRetry}>
                  <label htmlFor="retry-receipt">
                    Upload Payment Receipt Again
                  </label>

                  <input
                    id="retry-receipt"
                    name="receipt"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    required
                  />

                  <button type="submit" disabled={receiptUploading}>
                    {receiptUploading ? "UPLOADING..." : "UPLOAD RECEIPT"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

          <Link href="/shop">CONTINUE SHOPPING</Link>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <h1>Your shopping bag is empty</h1>
          <p>Add some products before proceeding to checkout.</p>
          <Link href="/shop">CONTINUE SHOPPING</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-header">
        <p>ZYELLEE</p>
        <h1>Checkout</h1>
        <span>Complete your details to continue</span>
      </div>

      <form
        className="checkout-container"
        onSubmit={handlePlaceOrder}
      >
        <section className="checkout-form-section">

          <div className="checkout-section">
            <h2>01. Contact Information</h2>

            <div className="checkout-form-grid">
              <div className="checkout-field full-width">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  required
                />
              </div>

              <div className="checkout-field full-width">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="07XXXXXXXX"
                  pattern="0[0-9]{9}"
                  title="Enter a valid 10-digit Sri Lankan phone number"
                  required
                />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2>02. Delivery Address</h2>

            <div className="checkout-form-grid">
              <div className="checkout-field full-width">
                <label htmlFor="address">Street Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="House number and street"
                  required
                />
              </div>

              <div className="checkout-field full-width">
                <label htmlFor="address2">
                  Apartment / Floor (Optional)
                </label>
                <input
                  id="address2"
                  name="address2"
                  type="text"
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  placeholder="Postal code"
                  required
                />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2>03. Payment Method</h2>

            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => {
                    setPaymentMethod("cod");
                    setSelectedReceipt(null);
                    setReceiptError("");
                  }}
                />

                <span>
                  <strong>Cash on Delivery</strong>
                  <small>Pay when your order arrives</small>
                </span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                />

                <span>
                  <strong>Bank Transfer</strong>
                  <small>Pay directly to our bank account</small>
                </span>
              </label>
            </div>

            {paymentMethod === "bank" && (
              <div className="checkout-bank-details">
                <div className="checkout-bank-heading">
                  <h3>Bank Transfer Details</h3>
                  <p>
                    Please transfer the total amount to the following bank account
                    and upload your payment receipt.
                  </p>
                </div>

                <div className="checkout-bank-information">
                  <div>
                    <span>Bank Name</span>
                    <strong>{bankDetails.bankName}</strong>
                  </div>

                  <div>
                    <span>Account Name</span>
                    <strong>{bankDetails.accountName}</strong>
                  </div>

                  <div>
                    <span>Account Number</span>
                    <strong>{bankDetails.accountNumber}</strong>
                  </div>

                  <div>
                    <span>Branch</span>
                    <strong>{bankDetails.branch}</strong>
                  </div>

                  <div className="checkout-bank-amount">
                    <span>Amount to Transfer</span>
                    <strong>
                      LKR {cartTotal.toLocaleString("en-LK")}
                    </strong>
                  </div>
                </div>

                <div className="checkout-receipt-upload">
                  <label htmlFor="payment-receipt">
                    Upload Payment Receipt
                  </label>

                  <p>
                    Select your bank transfer receipt before placing your order.
                  </p>

                  <input
                    id="payment-receipt"
                    name="receipt"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    required
                    onChange={(event) => {
                      setSelectedReceipt(event.target.files?.[0] || null);
                      setErrorMessage("");
                    }}
                  />

                  {selectedReceipt && (
                    <p className="checkout-receipt-selected">
                      Selected: {selectedReceipt.name}
                    </p>
                  )}

                  <small>
                    Accepted formats: JPG, PNG, WEBP and PDF. Maximum size: 5 MB.
                  </small>
                </div>
              </div>
            )}
          </div>

          {errorMessage && (
            <p style={{ color: "red", marginBottom: "15px", fontSize: "13px" }}>
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="place-order-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
          </button>

          <Link href="/cart" className="checkout-back-link">
            ← Return to Shopping Bag
          </Link>

        </section>

        <aside className="checkout-order-summary">
          <h2>Your Order</h2>

          <p className="checkout-item-count">
            {cartCount} items in your bag
          </p>

          <div className="checkout-products">
            {cartItems.map((item) => (
              <div
                className="checkout-product"
                key={`${item.productId}-${item.size}-${item.color}`}
              >
                <div className="checkout-product-image">
                  <img src={item.image} alt={item.name} />
                  <span>{item.quantity}</span>
                </div>

                <div className="checkout-product-info">
                  <h3>{item.name}</h3>
                  <p>Size: {item.size}</p>
                  <p>Color: {item.color}</p>
                </div>

                <strong>
                  LKR {(item.price * item.quantity).toLocaleString("en-LK")}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-total-row">
            <span>Subtotal</span>
            <span>
              LKR {cartTotal.toLocaleString("en-LK")}
            </span>
          </div>

          <div className="checkout-total-row">
            <span>Shipping</span>
            <span>To be confirmed</span>
          </div>

          <div className="checkout-grand-total">
            <span>Order Subtotal</span>
            <span>
              LKR {cartTotal.toLocaleString("en-LK")}
            </span>
          </div>

          <p className="checkout-note">
            Shipping charges will be confirmed before your order is finalized.
          </p>
        </aside>
      </form>
    </main>
  );
}
