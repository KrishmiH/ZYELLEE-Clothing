"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="announcement">
        Thoughtful everyday clothing, made for you.
      </div>

      <nav className="nav-container">

        <div className="nav-links">
          <Link href="/" >HOME</Link>
          <Link href="/shop">SHOP</Link>
          <Link href="/about">ABOUT</Link>
        </div>

        <Link href="/" className="brand-logo">
          ZYELLEE
        </Link>

        <div className="nav-actions">
          <Link href="/contact" className="contact-link">
            CONTACT
          </Link>

          <Link href="/cart" className="cart-link">
            BAG ({cartCount})
          </Link>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <Link href="/" onClick={closeMenu}>HOME</Link>
          <Link href="/shop" onClick={closeMenu}>SHOP</Link>
          <Link href="/about" onClick={closeMenu}>ABOUT</Link>
          <Link href="/contact" onClick={closeMenu}>CONTACT</Link>
          <Link href="/cart" onClick={closeMenu}>SHOPPING BAG (0)</Link>
        </div>
      )}
    </header>
  );
}
