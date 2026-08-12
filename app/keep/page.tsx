"use client";

import { FormEvent, useMemo, useState } from "react";

type Question = {
  eyebrow: string;
  title: string;
  options: string[];
  followUp?: { when: string; label: string };
};

const questions: Question[] = [
  {
    eyebrow: "Step 1 — About You",
    title: "Which best describes your role?",
    options: ["Fleet Manager", "Service Manager", "Engineer", "Rental Company", "Manufacturer", "Supplier", "Other"],
  },
  {
    eyebrow: "Step 2 — The Downtime Event",
    title: "What was the main reason the machine stopped working?",
    options: ["Battery", "Hydraulic", "Electrical", "Engine", "Controls", "Safety system", "Unknown", "Other"],
    followUp: { when: "Other", label: "Please tell us more" },
  },
  {
    eyebrow: "Step 3 — Before It Happened",
    title: "Looking back, were there any warning signs before the machine stopped?",
    options: ["Yes", "No", "Not sure"],
    followUp: { when: "Yes", label: "What warning signs did you notice?" },
  },
  {
    eyebrow: "Step 4 — Recovery",
    title: "What caused the biggest delay in getting the machine back to work?",
    options: ["Finding the fault", "Confirming the cause", "Waiting for parts", "Waiting for an engineer", "Approval", "Repair", "Testing", "Other"],
    followUp: { when: "Other", label: "Please tell us more" },
  },
  {
    eyebrow: "Step 5 — Getting Back to Work",
    title: "What helped get the machine back to work?",
    options: ["Replaced parts", "Engineer experience", "Manufacturer support", "Technical information", "Remote support", "Temporary repair", "Other"],
    followUp: { when: "Other", label: "Please tell us more" },
  },
  {
    eyebrow: "Step 6 — Looking Ahead",
    title: "If you could improve one thing, what would it be?",
    options: ["Prevent breakdowns", "Find faults faster", "Better technical information", "Faster parts", "Better training", "Better support", "Better communication", "Other"],
    followUp: { when: "Other", label: "Please tell us more" },
  },
];

function KeepBrand() {
  return (
    <a className="keep-brand" href="/" aria-label="RecoveryFlow home">
      <span className="keep-brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>Recovery<span>Flow</span><small>AN INDUSTRY LEARNING INITIATIVE</small></span>
    </a>
  );
}

export default function KeepStudy() {
  const [screen, setScreen] = useState<"landing" | "before" | "questions" | "contact" | "done">("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [followUps, setFollowUps] = useState<Record<number, string>>({});
  const question = questions[step];
  const answer = answers[step] || "";
  const showFollowUp = question.followUp?.when === answer;
  const canContinue = !!answer && (!showFollowUp || !!followUps[step]?.trim());
  const progress = useMemo(() => ((step + 1) / questions.length) * 100, [step]);

  function select(value: string) {
    setAnswers((current) => ({ ...current, [step]: value }));
    if (question.followUp?.when !== value) {
      setFollowUps((current) => ({ ...current, [step]: "" }));
    }
  }

  function next() {
    if (!canContinue) return;
    if (step === questions.length - 1) setScreen("contact");
    else setStep((current) => current + 1);
  }

  function back() {
    if (step === 0) setScreen("before");
    else setStep((current) => current - 1);
  }

  function reset() {
    setScreen("landing");
    setStep(0);
    setAnswers({});
    setFollowUps({});
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setScreen("done");
  }

  if (screen === "done") {
    return (
      <main className="keep-study keep-done">
        <header className="keep-header"><KeepBrand /><span>RESPONSE RECORDED</span></header>
        <section>
          <div className="keep-success">✓</div>
          <p className="keep-kicker">UK POWERED ACCESS RECOVERY STUDY 2026</p>
          <h1>Thank you for sharing<br /><em>your experience.</em></h1>
          <p><strong>Your contribution will help improve the UK powered access industry.</strong><br /><br />The Recovery Study findings will be shared with contributors once the research is complete.</p>
          <div className="keep-done-actions">
            <a href="/">Visit RecoveryFlow <b>↗</b></a>
            <a href="https://www.linkedin.com/company/recoveryflow/" target="_blank" rel="noreferrer">Connect on LinkedIn <b>↗</b></a>
          </div>
          <button className="keep-reset" onClick={reset}>Start another response</button>
        </section>
      </main>
    );
  }

  if (screen === "landing") {
    return (
      <main className="keep-study keep-intro">
        <header className="keep-header"><KeepBrand /><span>UK POWERED ACCESS RECOVERY STUDY 2026</span></header>
        <section className="keep-intro-grid">
          <div>
            <p className="keep-kicker">RECOVERY STUDY / 2026</p>
            <h1>KEEP THE UK<br /><em>WORKING</em></h1>
            <p className="keep-lead">Help us understand how machines get back to work faster—and how unnecessary downtime can be prevented.</p>
            <button className="keep-primary" onClick={() => setScreen("before")}>Start the 3-minute Industry Conversation <b>↗</b></button>
            <p className="keep-cta-note">About 3 minutes <i>•</i> Mobile friendly <i>•</i> No preparation needed</p>
          </div>
          <aside>
            <span className="keep-orbit" aria-hidden="true" />
            <div className="keep-benefits-card">
              <small>WHY PARTICIPATE</small>
              <strong>Your experience will help shape the UK Powered Access Recovery Study 2026.</strong>
              <ul>
                <li><i>01</i> Share your experience</li>
                <li><i>02</i> Learn from the industry</li>
                <li><i>03</i> Receive the Recovery Study findings</li>
              </ul>
              <p>We&apos;re not looking for perfect answers. We&apos;re interested in real experiences.</p>
            </div>
          </aside>
        </section>
      </main>
    );
  }

  if (screen === "before") {
    return (
      <main className="keep-study keep-question-page">
        <header className="keep-header keep-header-light"><KeepBrand /><button onClick={() => setScreen("landing")}>Exit study</button></header>
        <section className="keep-before-shell">
          <p className="keep-kicker">BEFORE WE START</p>
          <h1>Thank you for contributing.</h1>
          <div className="keep-before-copy">
            <p>Please think about <strong>one real downtime event</strong> that had the biggest impact on your work.</p>
            <p>We&apos;re not looking for perfect answers. We&apos;re interested in your real experience.</p>
          </div>
          <button className="keep-primary" onClick={() => setScreen("questions")}>Continue <b>↗</b></button>
        </section>
      </main>
    );
  }

  if (screen === "contact") {
    return (
      <main className="keep-study keep-question-page">
        <header className="keep-header keep-header-light"><KeepBrand /><button onClick={() => setScreen("landing")}>Exit study</button></header>
        <div className="keep-progress"><div><span>STUDY PROGRESS</span><b>Complete</b></div><i><em style={{ width: "100%" }} /></i></div>
        <section className="keep-contact-shell">
          <div className="keep-contact-copy">
            <p className="keep-kicker">UK POWERED ACCESS RECOVERY STUDY 2026</p>
            <h1>Stay in Touch</h1>
            <p>We&apos;ll send you the UK Powered Access Recovery Study findings and future industry updates if you&apos;d like to receive them.</p>
          </div>
          <form className="keep-contact-form" onSubmit={submit}>
            <label>Full Name<input name="name" required autoFocus autoComplete="name" /></label>
            <label>Company<input name="company" required autoComplete="organization" /></label>
            <label>Email Address<input name="email" type="email" required autoComplete="email" /></label>
            <label>LinkedIn <small>Optional</small><input name="linkedin" type="url" placeholder="https://linkedin.com/in/…" /></label>
            <label className="keep-checkbox"><input name="findings" type="checkbox" /><span>Send me the Recovery Study findings.</span></label>
            <div className="keep-contact-actions"><button type="button" className="keep-back" onClick={() => { setScreen("questions"); setStep(5); }}>← Back</button><button className="keep-primary" type="submit">Submit my contribution <b>↗</b></button></div>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="keep-study keep-question-page">
      <header className="keep-header keep-header-light"><KeepBrand /><button onClick={() => setScreen("landing")}>Exit study</button></header>
      <div className="keep-progress" aria-live="polite"><div><span>STUDY PROGRESS</span><b>Question {step + 1} of {questions.length}</b></div><i><em style={{ width: `${progress}%` }} /></i></div>
      <section className="keep-question-shell" key={step}>
        <div className="keep-question-meta"><p className="keep-kicker">{question.eyebrow}</p><strong><i>●</i> Real experience</strong></div>
        <h1>{question.title}</h1>
        <div className="keep-options">
          {question.options.map((option, index) => (
            <button key={option} className={answer === option ? "selected" : ""} onClick={() => select(option)} aria-pressed={answer === option}>
              <span>{String(index + 1).padStart(2, "0")}</span><b>{option}</b><i>✓</i>
            </button>
          ))}
        </div>
        {showFollowUp && (
          <label className="keep-other">{question.followUp?.label}
            <input autoFocus value={followUps[step] || ""} maxLength={160} onChange={(event) => setFollowUps((current) => ({ ...current, [step]: event.target.value }))} placeholder="Add a short description…" />
            <span>{(followUps[step] || "").trim().length}/160</span>
          </label>
        )}
        <div className="keep-actions">
          <div><button className="keep-back" onClick={back}>← Back</button><span>Think about one real event<small>Choose the closest answer</small></span></div>
          <div><span>{showFollowUp ? "Add a short detail to continue" : "Select one answer to continue"}</span><button className="keep-primary" disabled={!canContinue} onClick={next}>{step === 5 ? "Continue" : "Next question"}<b>↗</b></button></div>
        </div>
      </section>
    </main>
  );
}
