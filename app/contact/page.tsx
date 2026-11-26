"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p className="contact-eyebrow">WE'RE HERE TO HELP</p>
        <h1>Get in Touch</h1>
        <p>
          Have a question about an order, our collection, or anything
          else? We'd love to hear from you.
        </p>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <p className="contact-eyebrow">CONTACT US</p>
          <h2>Let's start a conversation.</h2>
          <p>
            Whether you need assistance or simply want to say hello,
            feel free to send us a message.
          </p>

          <div className="contact-detail">
            <span>EMAIL</span>
            <p>hello@zyellee.com</p>
          </div>

          <div className="contact-detail">
            <span>INSTAGRAM</span>
            <p>@zyellee</p>
          </div>

          <div className="contact-detail">
            <span>RESPONSE TIME</span>
            <p>We aim to respond within 1–2 business days.</p>
          </div>
        </div>

        <div className="contact-form-wrapper">
          {submitted ? (
            <div className="contact-success">
              <h2>Thank you!</h2>
              <p>
                Your message has been submitted successfully.
              </p>
              <button onClick={() => setSubmitted(false)}>
                SEND ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <label htmlFor="contact-name">YOUR NAME</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Enter your name"
                required
              />

              <label htmlFor="contact-email">EMAIL ADDRESS</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />

              <label htmlFor="contact-subject">SUBJECT</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="What is your message about?"
                required
              />

              <label htmlFor="contact-message">MESSAGE</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="Write your message here..."
                required
              />

              <button type="submit">SEND MESSAGE</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}