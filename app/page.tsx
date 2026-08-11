"use client";

import { FormEvent, useMemo, useState } from "react";

type Answers = Record<string, string>;

const roles = [
  "Fleet Manager",
  "Service Manager",
  "Engineer",
  "Rental Company",
  "Manufacturer",
  "Supplier",
  "Other",
];

const questions = [
  { key: "role", eyebrow: "About you", title: "Tell us about you.", hint: "What best describes your role?", kind: "role" },
  { key: "challenge", eyebrow: "The challenge", title: "What is the biggest challenge you face in keeping machines working today?", hint: "Tell us what you see in the real world — there are no wrong answers.", placeholder: "For example: waiting for the right part, diagnosing intermittent faults…" },
  { key: "impact", eyebrow: "The impact", title: "Why is this challenge important to you?", hint: "How does it affect your team, customers or business?", placeholder: "For example: lost hire days, delayed jobs, customer pressure…" },
  { key: "cause", eyebrow: "The root cause", title: "What do you believe is the main cause?", hint: "Share your view, based on your experience.", placeholder: "What keeps this problem happening?" },
  { key: "solution", eyebrow: "What happens now", title: "How are you dealing with it today?", hint: "What do you, your team or your partners currently do?", placeholder: "Tell us what you have tried and what works — or does not…" },
  { key: "change", eyebrow: "A better future", title: "If you could change one thing, what would it be?", hint: "Think beyond a product. What would make the biggest difference?", placeholder: "The one change I would make is…" },
  { key: "community", eyebrow: "Keep learning together", title: "Would you like to receive the UK Powered Access Downtime Report 2026 and join future industry discussions?", hint: "Contributors will be the first to receive the findings.", kind: "yesno" },
];

function Brand() {
  return (
    <div className="brand" aria-label="RecoveryFlow">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>Recovery<span>Flow</span></span>
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<"landing" | "questions" | "contact" | "thanks">("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState(false);
  const question = questions[step];
  const progress = useMemo(() => ((step + 1) / questions.length) * 100, [step]);

  function setAnswer(value: string) {
    setAnswers((current) => ({ ...current, [question.key]: value }));
    setError(false);
  }

  function next() {
    if (!answers[question.key]?.trim()) {
      setError(true);
      return;
    }
    if (step === questions.length - 1) setScreen("contact");
    else setStep((current) => current + 1);
  }

  function back() {
    setError(false);
    if (step === 0) setScreen("landing");
    else setStep((current) => current - 1);
  }

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setAnswers((current) => ({
      ...current,
      name: String(data.get("name") || ""),
      company: String(data.get("company") || ""),
      email: String(data.get("email") || ""),
      linkedin: String(data.get("linkedin") || ""),
    }));
    setScreen("thanks");
  }

  return (
    <main className={`site ${screen === "landing" ? "landing-mode" : "form-mode"}`}>
      <header className="topbar">
        <Brand />
        <div className="top-note"><span /> UK Powered Access Industry Conversation</div>
      </header>

      {screen === "landing" && (
        <section className="hero">
          <div className="hero-photo" aria-hidden="true" />
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-content">
            <div className="kicker"><span /> One exhibition. One mission. One question.</div>
            <h1>What really causes<br /><em>downtime?</em></h1>
            <p className="hero-lead">Help build the UK Powered Access Downtime Report 2026 — and turn shared experience into better industry decisions.</p>
            <button className="primary large" onClick={() => setScreen("questions")}>Begin the conversation <b>→</b></button>
            <div className="hero-meta">
              <div><strong>03</strong><span>Minutes<br />to contribute</span></div>
              <div><strong>07</strong><span>Thoughtful<br />questions</span></div>
              <div><strong>01</strong><span>Shared industry<br />report</span></div>
            </div>
          </div>
          <aside className="purpose-card">
            <span className="card-label">Our purpose</span>
            <h2>Connecting the right people, knowledge and resources.</h2>
            <p>Helping the UK powered access industry work better together.</p>
            <div className="card-rule" />
            <small>Your experience matters.<br />Your voice helps the industry learn.</small>
          </aside>
          <div className="scroll-cue">SCROLL TO DISCOVER <span>↓</span></div>
        </section>
      )}

      {screen === "questions" && (
        <section className="conversation-shell">
          <div className="progress-block">
            <div className="progress-copy"><span>Industry conversation</span><strong>{String(step + 1).padStart(2, "0")} <i>/ 07</i></strong></div>
            <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="question-grid">
            <div className="question-side">
              <span className="vertical-label">LISTEN · LEARN · CONNECT</span>
              <div className="question-number">{String(step + 1).padStart(2, "0")}</div>
            </div>
            <div className="question-main" key={question.key}>
              <div className="kicker green"><span /> {question.eyebrow}</div>
              <h2>{question.title}</h2>
              <p>{question.hint}</p>
              {question.kind === "role" ? (
                <div className="option-grid">
                  {roles.map((role) => <button key={role} className={answers.role === role ? "selected" : ""} onClick={() => setAnswer(role)}><span>{role}</span><b>{answers.role === role ? "✓" : "→"}</b></button>)}
                </div>
              ) : question.kind === "yesno" ? (
                <div className="choice-row">
                  {["Yes — keep me involved", "Not right now"].map((choice) => <button key={choice} className={answers.community === choice ? "selected" : ""} onClick={() => setAnswer(choice)}><i>{answers.community === choice ? "●" : "○"}</i>{choice}</button>)}
                </div>
              ) : (
                <div className="textarea-wrap">
                  <textarea autoFocus value={answers[question.key] || ""} onChange={(e) => setAnswer(e.target.value)} placeholder={question.placeholder} maxLength={700} />
                  <span>{(answers[question.key] || "").length} / 700</span>
                </div>
              )}
              {error && <p className="error" role="alert">Please share an answer before continuing.</p>}
              <div className="actions"><button className="back" onClick={back}>← Back</button><button className="primary" onClick={next}>{step === 6 ? "Continue to your details" : "Continue"} <b>→</b></button></div>
            </div>
          </div>
        </section>
      )}

      {screen === "contact" && (
        <section className="conversation-shell contact-screen">
          <div className="progress-block complete"><div className="progress-copy"><span>Your details</span><strong>Complete</strong></div><div className="progress-track"><span /></div></div>
          <div className="contact-grid">
            <div className="contact-intro">
              <div className="kicker green"><span /> One last step</div>
              <h2>Where should we send the report?</h2>
              <p>We’ll use your details to share the final findings and, if you opted in, invite you to future industry conversations.</p>
              <div className="privacy-note"><b>✓</b><span><strong>Your experience, treated with respect.</strong> We will report industry patterns, never attribute comments without your permission.</span></div>
            </div>
            <form className="contact-form" onSubmit={submitContact}>
              <label>Full name <span>*</span><input name="name" required autoFocus placeholder="Your name" /></label>
              <label>Company <span>*</span><input name="company" required placeholder="Company name" /></label>
              <label>Email address <span>*</span><input name="email" type="email" required placeholder="name@company.co.uk" /></label>
              <label>LinkedIn <small>Optional</small><input name="linkedin" placeholder="linkedin.com/in/…" /></label>
              <div className="actions"><button type="button" className="back" onClick={() => { setScreen("questions"); setStep(6); }}>← Back</button><button className="primary" type="submit">Submit my contribution <b>→</b></button></div>
            </form>
          </div>
        </section>
      )}

      {screen === "thanks" && (
        <section className="thanks-screen">
          <div className="thanks-ring"><span>✓</span></div>
          <div className="kicker green"><span /> Contribution received</div>
          <h1>Thank you for helping<br /><em>the industry learn.</em></h1>
          <p>Your experience is now part of the UK Powered Access Downtime Report 2026. We’ll share what the industry learns.</p>
          <button className="ghost" onClick={() => { setAnswers({}); setStep(0); setScreen("landing"); }}>Start another conversation ↗</button>
        </section>
      )}

      <footer><span>RecoveryFlow © 2026</span><span>Every conversation creates an asset.</span></footer>
    </main>
  );
}
