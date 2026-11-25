"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleAddToBag = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color.");
      return;
    }

    alert(
      `${quantity} x ${product.name} (${selectedSize}, ${selectedColor}) added to your bag!`
    );
  };

  return (
    <main className="product-details-page">
      <div className="product-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <section className="product-details-container">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-details-info">
          <p className="product-details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="product-details-price">
            LKR {product.price.toLocaleString("en-LK")}
          </p>

          <p className="product-details-description">
            {product.description}
          </p>

          <div className="product-option">
            <h3>Size</h3>
            <div className="product-option-buttons">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? "selected" : ""}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-option">
            <h3>Color</h3>
            <div className="product-option-buttons">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={selectedColor === color ? "selected" : ""}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="product-option">
            <h3>Quantity</h3>
            <div className="quantity-selector">
              <button
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((current) => current + 1)
                }
              >
                +
              </button>
            </div>
          </div>

          <button
            className="add-to-bag-button"
            onClick={handleAddToBag}
          >
            ADD TO BAG
          </button>

          <p className="product-details-note">
            Thoughtful everyday clothing, made for effortless wear.
          </p>
        </div>
      </section>

      <div className="continue-shopping">
        <Link href="/shop">← Continue Shopping</Link>
      </div>
    </main>
  );
}
