"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import QuickView from "@/components/products/QuickView";

export default function ShopContent({
  products,
}: {
  products: Product[];
}) {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [quickViewProduct, setQuickViewProduct] =
    useState<Product | null>(null);

  const categories = [
    "All",
    "Tops",
    "Dresses",
    "Bottoms",
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "All") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "newest") {
      result.sort(
        (a, b) => Number(b.isNew) - Number(a.isNew)
      );
    }

    return result;
  }, [category, sort]);

  return (
    <main className="shop-page">
      <section className="shop-banner">
        <p>DISCOVER YOUR STYLE</p>
        <h1>Our Collection</h1>
        <span>
          Thoughtfully selected styles for your everyday wardrobe.
        </span>
      </section>

      <section className="shop-content">
        <div className="shop-toolbar">
          <div className="category-filters">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={
                  category === item
                    ? "category-button active"
                    : "category-button"
                }
              >
                {item}
              </button>
            ))}
          </div>

          <div className="shop-sort">
            <span>Sort by:</span>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="newest">New Arrivals</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="shop-result">
          {filteredProducts.length} PRODUCTS
        </div>

        <div className="shop-product-grid">
          {filteredProducts.map((product) => {
            const secondImage = product.images?.[1];

            return (
              <div
                key={product.id}
                className="shop-product-card"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="shop-product-link"
                >
                  <div
                    className={`shop-product-image ${
                      secondImage ? "has-hover-image" : ""
                    }`}
                  >
                    <img
                      className="shop-primary-image"
                      src={product.image}
                      alt={product.name}
                    />

                    {secondImage && secondImage !== product.image && (
                      <img
                        className="shop-secondary-image"
                        src={secondImage}
                        alt={`${product.name} alternate view`}
                      />
                    )}

                    {product.isNew && (
                      <span className="shop-new-tag">NEW</span>
                    )}
                  </div>

                  <p className="shop-product-category">
                    {product.category}
                  </p>

                  <h3>{product.name}</h3>

                  <p className="shop-product-price">
                    LKR {product.price.toLocaleString("en-LK")}
                  </p>
                </Link>

                <button
                  type="button"
                  className="shop-quick-view-button"
                  onClick={() => setQuickViewProduct(product)}
                >
                  QUICK VIEW
                </button>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <p className="empty-products">
            No products found in this category.
          </p>
        )}
      </section>

      <QuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </main>
  );
}
