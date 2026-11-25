import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Everyday Blouse",
    category: "TOPS",
    price: "LKR 3,500",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700",
  },
  {
    id: 2,
    name: "Classic Outfit",
    category: "DRESSES",
    price: "LKR 4,500",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700",
  },
  {
    id: 3,
    name: "Modern Essentials",
    category: "COLLECTION",
    price: "LKR 3,900",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=700",
  },
  {
    id: 4,
    name: "Everyday Elegance",
    category: "NEW ARRIVAL",
    price: "LKR 4,200",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700",
  },
];

export default function NewArrivals() {
  return (
    <section className="new-arrivals">
      <div className="section-heading">
        <div>
          <p className="eyebrow">CURATED FOR YOU</p>
          <h2>New Arrivals</h2>
        </div>

        <Link href="/shop" className="view-all">
          VIEW ALL PRODUCTS →
        </Link>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <span className="product-tag">NEW</span>
            </div>

            <p className="product-category">
              {product.category}
            </p>

            <h3>{product.name}</h3>

            <p className="product-price">
              {product.price}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
