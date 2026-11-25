"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const handlePlaceOrder = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const formData = new FormData(event.currentTarget);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
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

      setOrderNumber(data.order.orderNumber);
      clearCart();
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

  if (orderNumber) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <h1>Thank You for Your Order!</h1>
          <p>Your order has been successfully placed.</p>
          <p>
            Your order number is: <strong>{orderNumber}</strong>
          </p>
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
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
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
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
                />
                <span>
                  <strong>Bank Transfer</strong>
                  <small>Bank transfer instructions will be provided later</small>
                </span>
              </label>
            </div>
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
