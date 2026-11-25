import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-label">
          THE ART OF EVERYDAY STYLE
        </p>

        <h1>
          Style that
          <br />
          feels like you.
        </h1>

        <p className="hero-description">
          Thoughtful everyday clothing made for
          effortless wear and timeless expression.
        </p>

        <Link href="/shop" className="primary-button">
          EXPLORE COLLECTION
        </Link>
      </div>

      <div className="hero-image">
        <div className="hero-image-overlay">
          <span>EFFORTLESSLY YOURS.</span>
        </div>
      </div>
    </section>
  );
}
