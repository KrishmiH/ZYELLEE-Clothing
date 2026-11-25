"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <Link href="/" className="admin-login-brand">
          ZYELLEE
        </Link>

        <p className="admin-login-label">STORE MANAGEMENT</p>

        <h1>Welcome Back</h1>

        <p className="admin-login-description">
          Sign in to manage your store and customer orders.
        </p>

        <form onSubmit={handleLogin}>
          <div className="admin-login-field">
            <label htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your admin email"
              required
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {errorMessage && (
            <p className="admin-login-error">{errorMessage}</p>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <Link href="/" className="admin-login-back">
          Back to Store
        </Link>
      </div>
    </main>
  );
}
