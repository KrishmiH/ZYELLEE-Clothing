import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div>
          <h2>ZYELLEE</h2>
          <p>
            Thoughtful everyday clothing
            made for effortless wear.
          </p>
        </div>

        <div className="footer-links">
          <h3>EXPLORE</h3>
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">Our Story</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="footer-links">
          <h3>FOLLOW US</h3>
          <a href="https://instagram.com" target="_blank">
            Instagram
          </a>
          <a href="https://facebook.com" target="_blank">
            Facebook
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 ZYELLEE. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
