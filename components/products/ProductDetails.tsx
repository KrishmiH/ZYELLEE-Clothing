"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import type { Product } from "@/lib/products";

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const productImages =
    product.images.length > 0
      ? product.images
      : [product.image];

  const handleAddToBag = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color.");
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: productImages[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    alert(`${product.name} added to your bag!`);

    setQuantity(1);
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
        <div className="product-gallery">
          <div className="product-details-image">
            <img
              src={productImages[activeImage]}
              alt={product.name}
            />
          </div>

          {productImages.length > 1 && (
            <div className="product-image-thumbnails">
              {productImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`product-image-thumbnail ${
                    activeImage === index ? "active" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={activeImage === index}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
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
