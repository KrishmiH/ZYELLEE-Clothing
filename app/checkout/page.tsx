"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handlePlaceOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    alert("Your checkout details have been submitted! Order processing will be implemented next.");
  };

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
                  type="email"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  required
                />
              </div>

              <div className="checkout-field full-width">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
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
                  type="text"
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="City"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  id="postalCode"
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

          <button type="submit" className="place-order-button">
            PLACE ORDER
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
