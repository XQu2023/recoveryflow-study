"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const interests = [
  "Share real experiences",
  "Share practical knowledge",
  "Take part in interviews or studies",
  "Join industry discussions",
  "Make useful introductions",
  "Not sure yet — keep me informed",
];

export default function ContributorJoin() {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);

  function toggle(value: string) {
    setSelected((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (selected.length === 0) {
      setError("Please select at least one way you would like to contribute.");
      return;
    }

    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contributors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.get("full_name"),
          company: form.get("company"),
          role: form.get("role"),
          email: form.get("email"),
          linkedin: form.get("linkedin") || null,
          contribution_interests: selected,
          consent: form.get("consent") === "on",
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save your details right now.");
      setComplete(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to save your details right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (complete) {
    return (
      <section className="cp-join cp-join-success" id="join" aria-labelledby="cp-join-success-title">
        <div className="cp-join-success-inner">
          <span aria-hidden="true">✓</span>
          <p>BECOME A CONTRIBUTOR</p>
          <h2 id="cp-join-success-title">Thank you for joining RecoveryFlow.</h2>
          <p>We&apos;ll keep you informed about relevant opportunities to contribute, learn and connect.</p>
          <Link href="/">Return to RecoveryFlow <b>→</b></Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cp-join" id="join" aria-labelledby="cp-join-title">
      <div className="cp-join-grid" aria-hidden="true" />
      <div className="cp-join-inner">
        <div className="cp-join-intro">
          <h2 id="cp-join-title">BECOME A CONTRIBUTOR</h2>
          <h3>Share what you know. Learn from what others know.</h3>
          <p>Join the RecoveryFlow contributor network and take part in industry learning when it makes sense for you.</p>
        </div>

        <form className="cp-join-form" onSubmit={submit}>
          <div className="cp-join-fields">
            <label>Full Name<input name="full_name" required autoComplete="name" /></label>
            <label>Company<input name="company" required autoComplete="organization" /></label>
            <label>Role<input name="role" required autoComplete="organization-title" /></label>
            <label>Email<input name="email" type="email" required autoComplete="email" /></label>
            <label className="cp-join-wide">LinkedIn <small>Optional</small><input name="linkedin" type="url" placeholder="https://linkedin.com/in/…" /></label>
          </div>

          <fieldset className="cp-interest-fieldset">
            <legend>How would you like to contribute?</legend>
            <div className="cp-interest-options">
              {interests.map((interest) => {
                const active = selected.includes(interest);
                return (
                  <label key={interest} className={active ? "selected" : ""}>
                    <input type="checkbox" checked={active} onChange={() => toggle(interest)} />
                    <span aria-hidden="true">{active ? "✓" : ""}</span>
                    <strong>{interest}</strong>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="cp-join-consent">
            <input name="consent" type="checkbox" required />
            <span aria-hidden="true" />
            <strong>I&apos;m happy for RecoveryFlow to contact me about relevant contributor opportunities and industry learning.</strong>
          </label>

          {error && <p className="cp-join-error" role="alert">{error}</p>}

          <button className="cp-join-submit" type="submit" disabled={submitting}>
            {submitting ? "Saving your details…" : "Become a RecoveryFlow Contributor"}<b>→</b>
          </button>
        </form>
      </div>
    </section>
  );
}
