"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ThankYouCards() {
  const [instagram, setInstagram] = useState("@yourinstagram");
  const [facebook, setFacebook] = useState("facebook.com/yourfacebookpage");
  const [website, setWebsite] = useState("www.yourwebsite.com");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cards = (
    <div id="thank-you-cards-print-root">
      <div className="thank-you-cards-sheet">
        {Array.from({ length: 8 }).map((_, index) => (
          <article className="thank-you-card" key={index}>
            <div className="thank-you-card-content">
              <p className="thank-you-card-topline">
                MADE WITH CARE
              </p>

              <h2>ZYELLEE</h2>

              <div className="thank-you-card-rule" />

              <h3>Thank you.</h3>

              <p className="thank-you-card-message">
                For choosing us.
                <br />
                We hope your new favourite
                <br />
                makes you feel wonderful.
              </p>

              <p className="thank-you-card-signature">
                WITH LOVE, ZYELLEE
              </p>

              <div className="thank-you-card-socials">
                <span>{instagram}</span>
                <span>{facebook}</span>
                <span>{website}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <main className="thank-you-cards-page">
        <div className="thank-you-cards-toolbar">
          <div>
            <p>ZYELLEE STORE MANAGEMENT</p>
            <h1>Thank You Cards</h1>
            <span>Prepare your branded packaging inserts.</span>
          </div>

          <button type="button" onClick={() => window.print()}>
            PRINT CARDS
          </button>
        </div>

        <section className="thank-you-cards-settings">
          <h2>Social Media Details</h2>

          <label>
            Instagram
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </label>

          <label>
            Facebook
            <input
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </label>

          <label>
            Website
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
        </section>

        <div className="thank-you-cards-preview-heading">
          <span>PRINT PREVIEW</span>
          <p>8 cards · A4 sheet</p>
        </div>

        <div className="thank-you-cards-screen-preview">
          <div className="thank-you-cards-sheet">
            {Array.from({ length: 8 }).map((_, index) => (
              <article className="thank-you-card" key={index}>
                <div className="thank-you-card-content">
                  <p className="thank-you-card-topline">MADE WITH CARE</p>
                  <h2>ZYELLEE</h2>
                  <div className="thank-you-card-rule" />
                  <h3>Thank you.</h3>
                  <p className="thank-you-card-message">
                    For choosing us.
                    <br />
                    We hope your new favourite
                    <br />
                    makes you feel wonderful.
                  </p>
                  <p className="thank-you-card-signature">
                    WITH LOVE, ZYELLEE
                  </p>
                  <div className="thank-you-card-socials">
                    <span>{instagram}</span>
                    <span>{facebook}</span>
                    <span>{website}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {mounted && createPortal(cards, document.body)}
    </>
  );
}
