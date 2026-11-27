"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type CourierLabelPrintProps = {
  orderNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  address2: string | null;
  city: string;
  postalCode: string;
};

export default function CourierLabelPrint({
  orderNumber,
  firstName,
  lastName,
  phone,
  address,
  address2,
  city,
  postalCode,
}: CourierLabelPrintProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const label = (
    <div id="courier-print-root">
      <section id="courier-label">
        <header className="courier-label-header">
          <h1>ZYELLEE</h1>
          <span>COURIER PACKAGE</span>
        </header>

        <section className="courier-label-section customer-label">
          <h2>SHIP TO / CUSTOMER</h2>

          <h3>{firstName} {lastName}</h3>

          <p>{address}</p>
          {address2 && <p>{address2}</p>}
          <p>{city}</p>
          <p>{postalCode}</p>

          <p className="courier-label-phone">
            PHONE: {phone}
          </p>
        </section>

        <section className="courier-label-section">
          <h2>RETURN TO / SENDER</h2>

          <h3>ZYELLEE</h3>
          <p>123 Main Street</p>
          <p>Matara</p>
          <p>Sri Lanka</p>
          <p>Phone: Business Contact Number</p>
        </section>

        <footer className="courier-label-order">
          <span>ORDER NUMBER</span>
          <strong>{orderNumber}</strong>
        </footer>
      </section>
    </div>
  );

  return (
    <>
      <div className="courier-label-container">
        <button
          type="button"
          className="courier-label-print-button"
          onClick={() => window.print()}
        >
          PRINT COURIER LABEL
        </button>
      </div>

      {mounted && createPortal(label, document.body)}
    </>
  );
}
