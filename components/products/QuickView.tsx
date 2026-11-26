"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/products";

type QuickViewProps = {
  product: Product | null;
  onClose: () => void;
};

export default function QuickView({
  product,
  onClose,
}: QuickViewProps) {
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedSize("");
      setSelectedColor("");
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const images =
    product.images?.length > 0
      ? product.images
      : [product.image];

  function handleAddToCart() {
    if (!selectedSize || !selectedColor) {
      alert("Please select a size and colour.");
      return;
    }

    addToCart({
      productId: product!.id,
      name: product!.name,
      price: product!.price,
      image: product!.image,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    alert("Product added to your bag!");
    onClose();
  }

  return (
    <div
      className="quick-view-overlay"
      onClick={onClose}
    >
      <div
        className="quick-view-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
      >
        <button
          type="button"
          className="quick-view-close"
          onClick={onClose}
          aria-label="Close quick view"
        >
          ×
        </button>

        <div className="quick-view-content">
          <div className="quick-view-gallery">
            <div className="quick-view-main-image">
              <img
                src={selectedImage || product.image}
                alt={product.name}
              />

              {product.isNew && (
                <span className="shop-new-tag">NEW</span>
              )}
            </div>

            {images.length > 1 && (
              <div className="quick-view-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={
                      selectedImage === image
                        ? "quick-view-thumbnail active"
                        : "quick-view-thumbnail"
                    }
                    onClick={() => setSelectedImage(image)}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="quick-view-details">
            <p className="quick-view-category">
              {product.category}
            </p>

            <h2 id="quick-view-title">{product.name}</h2>

            <p className="quick-view-price">
              LKR {product.price.toLocaleString("en-LK")}
            </p>

            <p className="quick-view-description">
              {product.description}
            </p>

            <div className="quick-view-option">
              <label>SIZE</label>

              <div className="quick-view-size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={
                      selectedSize === size
                        ? "quick-view-size active"
                        : "quick-view-size"
                    }
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="quick-view-option">
              <label>COLOUR</label>

              <div className="quick-view-color-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={
                      selectedColor === color
                        ? "quick-view-color active"
                        : "quick-view-color"
                    }
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="quick-view-option">
              <label>QUANTITY</label>

              <div className="quick-view-quantity">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => current + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              className="quick-view-add-button"
              onClick={handleAddToCart}
            >
              ADD TO BAG
            </button>

            <Link
              href={`/products/${product.id}`}
              className="quick-view-full-details"
              onClick={onClose}
            >
              VIEW FULL PRODUCT DETAILS →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
