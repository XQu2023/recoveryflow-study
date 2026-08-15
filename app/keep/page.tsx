"use client";

import { useRef, useState } from "react";
import Link from "next/link";

type AnswerKey =
  | "machine_type"
  | "first_report_source"
  | "information_sufficient"
  | "information_available"
  | "first_action"
  | "first_action_effectiveness"
  | "time_to_right_way_forward"
  | "recovery_requirements"
  | "total_downtime"
  | "biggest_time_loss"
  | "breakdown_frequency"
  | "most_helpful_next_breakdown"
  | "role"
  | "trial_interest";

type OtherKey =
  | "machine_type_other"
  | "first_report_source_other"
  | "information_available_other"
  | "first_action_other"
  | "recovery_requirements_other"
  | "biggest_time_loss_other"
  | "most_helpful_next_breakdown_other"
  | "role_other";

type Question = {
  key: AnswerKey;
  part: string;
  title: string;
  options: string[];
  multiple?: boolean;
  other?: { option: string; key: OtherKey; label: string };
};

const questions: Question[] = [
  {
    key: "machine_type",
    part: "Part 1 — Think of one recent breakdown",
    title: "What type of machine was it?",
    options: ["Boom", "Scissor", "Vertical mast", "Other / Not sure"],
    other: { option: "Other / Not sure", key: "machine_type_other", label: "If other, add a short description (optional)" },
  },
  {
    key: "first_report_source",
    part: "Part 1 — Think of one recent breakdown",
    title: "How did you first hear about the problem?",
    options: ["Operator / site contact", "Hire desk", "Engineer", "Telematics / remote alert", "Other"],
    other: { option: "Other", key: "first_report_source_other", label: "Please tell us more (optional)" },
  },
  {
    key: "information_sufficient",
    part: "Part 1 — Think of one recent breakdown",
    title: "At that point, did you have enough information to know what to do next?",
    options: ["Yes", "Partly", "No"],
  },
  {
    key: "information_available",
    part: "Part 1 — Think of one recent breakdown",
    title: "What did you have to work with?",
    multiple: true,
    options: ["Description of the problem", "Fault code", "Photos / video", "Machine details", "Service / breakdown history", "Telematics / remote data", "Other"],
    other: { option: "Other", key: "information_available_other", label: "Please tell us more (optional)" },
  },
  {
    key: "first_action",
    part: "Part 1 — Think of one recent breakdown",
    title: "What did you do next?",
    options: ["Remote checks with the operator/customer", "Sent / arranged an engineer", "Contacted the manufacturer/OEM", "Checked / arranged a part", "Arranged another machine", "Asked for more information", "Other"],
    other: { option: "Other", key: "first_action_other", label: "Please tell us more (optional)" },
  },
  {
    key: "first_action_effectiveness",
    part: "Part 1 — Think of one recent breakdown",
    title: "Did that turn out to be the right next step?",
    options: ["Yes", "Partly", "No — we had to change approach", "Not sure"],
  },
  {
    key: "time_to_right_way_forward",
    part: "Part 1 — Think of one recent breakdown",
    title: "Roughly how long was it before you knew the right way forward?",
    options: ["Under 15 mins", "15–30 mins", "30–60 mins", "1–2 hours", "2–4 hours", "4+ hours", "Not sure"],
  },
  {
    key: "recovery_requirements",
    part: "Part 1 — Think of one recent breakdown",
    title: "What was eventually needed to get the machine working again?",
    multiple: true,
    options: ["Remote fix", "Engineer visit", "Another engineer visit", "Part(s)", "Manufacturer/OEM support", "Replacement machine / cross-hire", "Transport", "Other"],
    other: { option: "Other", key: "recovery_requirements_other", label: "Please tell us more (optional)" },
  },
  {
    key: "total_downtime",
    part: "Part 1 — Think of one recent breakdown",
    title: "Roughly how long was the machine out of service?",
    options: ["Under 1 hour", "1–4 hours", "4–8 hours", "8–24 hours", "1–2 days", "3+ days", "Not sure"],
  },
  {
    key: "biggest_time_loss",
    part: "Part 1 — Think of one recent breakdown",
    title: "Looking back, where was most time lost — if anywhere?",
    options: ["Getting the right information", "Working out the fault", "Waiting for an engineer", "Finding the right part", "Waiting for the part", "Waiting for manufacturer/OEM support", "Finding another machine", "Transport", "Communication / approval", "Nowhere in particular — it went smoothly", "Other"],
    other: { option: "Other", key: "biggest_time_loss_other", label: "Please tell us more (optional)" },
  },
  {
    key: "breakdown_frequency",
    part: "Part 2 — Your day-to-day experience",
    title: "How often are you involved in MEWP breakdowns?",
    options: ["Most days", "A few times a week", "About once a week", "A few times a month", "Less often"],
  },
  {
    key: "most_helpful_next_breakdown",
    part: "Part 2 — Your day-to-day experience",
    title: "When the next machine breaks down, which ONE thing would make your job easier?",
    options: ["Better information from site", "Knowing the likely fault sooner", "Knowing the best next step", "Finding the right engineer", "Finding the right part", "Finding another machine quickly", "Seeing how similar breakdowns were fixed before", "Nothing in particular", "Other"],
    other: { option: "Other", key: "most_helpful_next_breakdown_other", label: "Please tell us more (optional)" },
  },
  {
    key: "role",
    part: "About you",
    title: "What best describes your role?",
    options: ["Service Manager / Controller", "Engineer", "Hire desk / Rental", "Fleet / Operations", "Other"],
    other: { option: "Other", key: "role_other", label: "Please tell us more (optional)" },
  },
  {
    key: "trial_interest",
    part: "Future testing",
    title: "Would you be open to trying a quicker way of handling a future breakdown?",
    options: ["Yes — happy to try it", "Maybe — tell me more", "Not at the moment"],
  },
];

function KeepBrand() {
  return (
    <Link className="keep-brand" href="/" aria-label="RecoveryFlow home">
      <span className="keep-brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>Recovery<span>Flow</span><small>AN INDUSTRY LEARNING INITIATIVE</small></span>
    </Link>
  );
}

export default function KeepStudy() {
  const [screen, setScreen] = useState<"landing" | "questions" | "done">("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<AnswerKey, string | string[]>>>({});
  const [otherAnswers, setOtherAnswers] = useState<Partial<Record<OtherKey, string>>>({});
  const [contact, setContact] = useState({ contact_name: "", company: "", contact_details: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submissionLocked = useRef(false);

  const question = questions[step];
  const answer = answers[question.key];
  const selected = Array.isArray(answer) ? answer : answer ? [answer] : [];
  const showOther = !!question.other && selected.includes(question.other.option);
  const showContact = question.key === "trial_interest" && (selected[0] === "Yes — happy to try it" || selected[0] === "Maybe — tell me more");
  const canContinue = selected.length > 0;
  const progress = ((step + 1) / questions.length) * 100;

  function select(option: string) {
    if (question.multiple) {
      const next = selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option];
      setAnswers((current) => ({ ...current, [question.key]: next }));
      if (question.other && option === question.other.option && !next.includes(option)) {
        setOtherAnswers((current) => ({ ...current, [question.other!.key]: "" }));
      }
      return;
    }

    setAnswers((current) => ({ ...current, [question.key]: option }));
    if (question.other && option !== question.other.option) {
      setOtherAnswers((current) => ({ ...current, [question.other!.key]: "" }));
    }
    if (question.key === "trial_interest" && option === "Not at the moment") {
      setContact({ contact_name: "", company: "", contact_details: "" });
    }
  }

  function next() {
    if (!canContinue || step === questions.length - 1) return;
    setStep((current) => current + 1);
    setSubmitError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setSubmitError("");
    if (step === 0) setScreen("landing");
    else setStep((current) => current - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    if (!canContinue || submitting || submissionLocked.current) return;
    submissionLocked.current = true;
    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/recovery-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, ...otherAnswers, ...contact }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Submission failed");
      setScreen("done");
      window.scrollTo({ top: 0 });
    } catch {
      submissionLocked.current = false;
      setSubmitError("We couldn’t submit your response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (screen === "done") {
    const followUp = answers.trial_interest === "Yes — happy to try it" || answers.trial_interest === "Maybe — tell me more";
    return (
      <main className="keep-study keep-done">
        <header className="keep-header"><KeepBrand /><span>RESPONSE RECORDED</span></header>
        <section>
          <div className="keep-success">✓</div>
          <p className="keep-kicker">MEWP BREAKDOWN &amp; RECOVERY SURVEY</p>
          <h1>Thanks for sharing your experience.</h1>
          <p>It helps us understand where time is being lost during breakdowns — and what could get machines back to work quicker.<br /><br />We’ll share what we learn with contributors.{followUp && <><br /><br />We’ll be in touch about trying this on a future breakdown.</>}</p>
          <strong className="keep-done-flag">KEEP THE UK WORKING.</strong>
          <div className="keep-done-actions"><Link href="/">About RecoveryFlow <b>↗</b></Link></div>
        </section>
      </main>
    );
  }

  if (screen === "landing") {
    return (
      <main className="keep-study keep-intro keep-survey-intro">
        <header className="keep-header"><KeepBrand /><span>MEWP BREAKDOWN &amp; RECOVERY SURVEY</span></header>
        <section className="keep-survey-welcome">
          <h1>KEEP THE UK WORKING.</h1>
          <div className="keep-survey-intro-copy">
            <p><strong>When a MEWP breaks down, every minute matters.</strong></p>
            <p>Share one recent breakdown and help us understand where time is lost and what gets machines back to work faster.</p>
          </div>
          <div className="keep-survey-cta">
            <button type="button" className="keep-primary" onClick={() => setScreen("questions")}>Share a breakdown <b>↗</b></button>
            <p className="keep-cta-note">2–3 minutes <i>·</i> No company-sensitive information needed</p>
            <p className="keep-contributor-note">Contributors will receive the findings.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="keep-study keep-question-page">
      <header className="keep-header keep-header-light"><KeepBrand /><button type="button" onClick={() => setScreen("landing")}>Exit survey</button></header>
      <div className="keep-progress" aria-live="polite"><div><span>SURVEY PROGRESS</span><b>Question {step + 1} of {questions.length}</b></div><i><em style={{ width: `${progress}%` }} /></i></div>
      <section className="keep-question-shell" key={question.key}>
        <div className="keep-question-meta"><p className="keep-kicker">{question.part}</p><strong><i>●</i> {question.multiple ? "Select all that apply" : "Select one"}</strong></div>
        <h1>{question.title}</h1>
        <div className={`keep-options${question.multiple ? " keep-options-multiple" : ""}`}>
          {question.options.map((option, index) => {
            const isSelected = selected.includes(option);
            return (
              <button key={option} type="button" className={isSelected ? "selected" : ""} onClick={() => select(option)} aria-pressed={isSelected}>
                <span>{String(index + 1).padStart(2, "0")}</span><b>{option}</b><i>✓</i>
              </button>
            );
          })}
        </div>

        {showOther && question.other && (
          <label className="keep-other">{question.other.label}
            <input value={otherAnswers[question.other.key] || ""} maxLength={160} onChange={(event) => setOtherAnswers((current) => ({ ...current, [question.other!.key]: event.target.value }))} placeholder="Add a short description…" />
            <span>{(otherAnswers[question.other.key] || "").trim().length}/160</span>
          </label>
        )}

        {showContact && (
          <div className="keep-trial-contact" aria-live="polite">
            <div><strong>If you&apos;d like us to follow up</strong><span>All fields are optional.</span></div>
            <label>Name <small>Optional</small><input value={contact.contact_name} maxLength={160} autoComplete="name" onChange={(event) => setContact((current) => ({ ...current, contact_name: event.target.value }))} /></label>
            <label>Company <small>Optional</small><input value={contact.company} maxLength={160} autoComplete="organization" onChange={(event) => setContact((current) => ({ ...current, company: event.target.value }))} /></label>
            <label>Email or mobile <small>Optional</small><input value={contact.contact_details} maxLength={254} autoComplete="email" onChange={(event) => setContact((current) => ({ ...current, contact_details: event.target.value }))} /></label>
          </div>
        )}

        {submitError && <p className="keep-submit-error" role="alert">{submitError}</p>}
        <div className="keep-actions">
          <div><button type="button" className="keep-back" disabled={submitting} onClick={back}>← Back</button><span>One recent breakdown<small>Choose the closest answer</small></span></div>
          <div><span>{question.multiple ? "Select everything that applied" : "Choose the closest answer"}</span>{step === questions.length - 1 ? <button type="button" className="keep-primary" disabled={!canContinue || submitting} onClick={submit}>{submitting ? "Saving…" : "Submit response"}<b>↗</b></button> : <button type="button" className="keep-primary" disabled={!canContinue} onClick={next}>Next question<b>↗</b></button>}</div>
        </div>
      </section>
    </main>
  );
}
