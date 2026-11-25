"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
  } = useCart();

  return (
    <main className="cart-page">
      <div className="cart-header">
        <p>YOUR SHOPPING BAG</p>
        <h1>Shopping Bag</h1>
        <span>{cartCount} items</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your bag is currently empty.</h2>
          <p>Discover pieces made for everyday living.</p>

          <Link href="/shop" className="continue-shopping-button">
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div
                className="cart-item"
                key={`${item.productId}-${item.size}-${item.color}`}
              >
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item-details">
                  <h2>{item.name}</h2>

                  <p>
                    LKR {item.price.toLocaleString("en-LK")}
                  </p>

                  <p>Size: {item.size}</p>
                  <p>Color: {item.color}</p>

                  <div className="cart-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity === 1}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-cart-item"
                    onClick={() =>
                      removeFromCart(
                        item.productId,
                        item.size,
                        item.color
                      )
                    }
                  >
                    Remove
                  </button>
                </div>

                <div className="cart-item-total">
                  LKR{" "}
                  {(item.price * item.quantity).toLocaleString("en-LK")}
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="cart-summary-row">
              <span>Items ({cartCount})</span>
              <span>
                LKR {cartTotal.toLocaleString("en-LK")}
              </span>
            </div>

            <div className="cart-summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="cart-summary-total">
              <span>Subtotal</span>
              <span>
                LKR {cartTotal.toLocaleString("en-LK")}
              </span>
            </div>

            <button
              className="checkout-button"
              onClick={() =>
                alert("Checkout will be available soon!")
              }
            >
              PROCEED TO CHECKOUT
            </button>

            <Link href="/shop" className="back-to-shop">
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
