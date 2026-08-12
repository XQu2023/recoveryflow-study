"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: data.get("password") }),
    });
    if (response.ok) {
      window.location.assign("/admin");
      return;
    }
    setError("Incorrect administrator password.");
    setSubmitting(false);
  }

  return (
    <main className="admin-login">
      <section>
        <Link className="keep-brand" href="/keep" aria-label="RecoveryFlow Study">
          <span className="keep-brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Recovery<span>Flow</span><small>RECOVERY STUDY ADMIN</small></span>
        </Link>
        <div className="admin-login-card">
          <p>PROTECTED ACCESS</p>
          <h1>Administrator login</h1>
          <form onSubmit={login}>
            <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
            {error && <p className="admin-login-error" role="alert">{error}</p>}
            <button type="submit" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"} <b>↗</b></button>
          </form>
        </div>
      </section>
    </main>
  );
}
