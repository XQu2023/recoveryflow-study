"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";

type AnswerKey =
  | "role_v1"
  | "fleet_size"
  | "delay_frequency"
  | "machine_type_v1"
  | "main_delay"
  | "other_delays"
  | "additional_resources_needed"
  | "additional_resources"
  | "resource_source"
  | "resource_arrangement"
  | "time_to_resource"
  | "current_recovery_method"
  | "recovery_outcome"
  | "avoidable_time"
  | "biggest_difference"
  | "customer_working_time_lost"
  | "tomorrow_easier"
  | "findings_preference"
  | "follow_up_chat";

type OtherKey =
  | "role_v1_other"
  | "machine_type_v1_other"
  | "main_delay_other"
  | "other_delays_other"
  | "additional_resources_other"
  | "resource_source_other"
  | "resource_arrangement_other"
  | "recovery_outcome_other"
  | "biggest_difference_other";

type Question = {
  key: AnswerKey;
  part: string;
  title: string;
  options?: string[];
  helper?: string;
  kind?: "choice" | "text";
  multiple?: boolean;
  exclusiveOption?: string;
  other?: { option: string; key: OtherKey; label: string };
  condition?: { key: AnswerKey; values: string[] };
};

type FindingsReceipt = {
  responseId: string;
  token: string;
  email: string;
  trialInterest: string;
};

const findingsReceiptKey = "recoveryflow_findings_receipt";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normaliseEmail(value: string) {
  const email = value.trim().toLowerCase();
  return emailPattern.test(email) ? email : "";
}

const questions: Question[] = [
  {
    key: "role_v1",
    part: "Question 1 — Role",
    title: "What's your role?",
    options: ["Service Manager / Service Controller", "Engineer / Technician", "Fleet / Operations", "Hire Desk / Branch", "Owner / Director", "Manufacturer / OEM", "Other"],
    other: { option: "Other", key: "role_v1_other", label: "Please tell us more (optional)" },
  },
  {
    key: "fleet_size",
    part: "Question 2 — Fleet size",
    title: "Roughly how big is your powered access fleet?",
    options: ["Under 50 machines", "50–249", "250–999", "1,000+", "Not applicable", "Prefer not to say"],
  },
  {
    key: "delay_frequency",
    part: "Question 3 — Frequency",
    title: "How often does a breakdown take longer to sort than you think it should?",
    options: ["Most days", "A few times a week", "About once a week", "A few times a month", "Less often", "Hard to say"],
  },
  {
    key: "machine_type_v1",
    part: "Question 4 — Machine type",
    title: "Think about the last time that happened. What type of machine was it?",
    options: ["Scissor lift", "Boom lift", "Other", "Not sure"],
    other: { option: "Other", key: "machine_type_v1_other", label: "Please tell us more (optional)" },
  },
  {
    key: "main_delay",
    part: "Question 5 — Main delay",
    title: "What held things up the most?",
    helper: "Choose the main one.",
    options: ["Getting the right information from site", "Working out what was actually wrong", "Finding the right engineer", "Waiting for an engineer to become available", "Identifying the right part", "Waiting for the part", "Waiting for manufacturer / OEM support", "Arranging transport", "Finding a replacement / cross-hire machine", "Communication / coordination", "Something else"],
    other: { option: "Something else", key: "main_delay_other", label: "Please tell us more (optional)" },
  },
  {
    key: "other_delays",
    part: "Question 6 — Other delays",
    title: "Did anything else add significant time?",
    helper: "Select any that apply.",
    multiple: true,
    exclusiveOption: "No — that was the main issue",
    options: ["Getting the right information from site", "Working out what was actually wrong", "Finding the right engineer", "Waiting for an engineer to become available", "Identifying the right part", "Waiting for the part", "Waiting for manufacturer / OEM support", "Arranging transport", "Finding a replacement / cross-hire machine", "Communication / coordination", "No — that was the main issue", "Something else"],
    other: { option: "Something else", key: "other_delays_other", label: "Please tell us more (optional)" },
  },
  {
    key: "additional_resources_needed",
    part: "Question 7 — Additional resources",
    title: "Did you need any help or resources beyond what was immediately available to your team?",
    options: ["Yes", "No", "Not sure"],
  },
  {
    key: "additional_resources",
    part: "Question 7 — Additional resources",
    title: "What did you need?",
    helper: "Select any that apply.",
    multiple: true,
    options: ["Engineer", "Manufacturer / OEM support", "Technical advice", "Part(s)", "Transport", "Replacement / cross-hire machine", "Other"],
    other: { option: "Other", key: "additional_resources_other", label: "Please tell us more (optional)" },
    condition: { key: "additional_resources_needed", values: ["Yes"] },
  },
  {
    key: "resource_source",
    part: "Question 8 — Resource source and arrangement",
    title: "Where did that help or resource come from?",
    options: ["Another depot / branch", "Manufacturer / OEM", "Existing supplier", "Independent engineer", "Another rental company", "Other"],
    other: { option: "Other", key: "resource_source_other", label: "Please tell us more (optional)" },
    condition: { key: "additional_resources_needed", values: ["Yes"] },
  },
  {
    key: "resource_arrangement",
    part: "Question 8 — Resource source and arrangement",
    title: "How did you arrange it?",
    options: ["Someone we already knew", "Phone", "WhatsApp / messaging", "Internal system", "Manufacturer / supplier portal", "Online search", "Other"],
    other: { option: "Other", key: "resource_arrangement_other", label: "Please tell us more (optional)" },
    condition: { key: "additional_resources_needed", values: ["Yes"] },
  },
  {
    key: "time_to_resource",
    part: "Question 9 — Time to resource",
    title: "Once you knew what you needed, roughly how long did it take to get it in place?",
    options: ["Under 30 minutes", "30–60 minutes", "1–2 hours", "2–4 hours", "More than 4 hours", "Next day or longer", "Can't remember"],
    condition: { key: "additional_resources_needed", values: ["Yes"] },
  },
  {
    key: "current_recovery_method",
    part: "Question 10 — Current recovery method",
    title: "Generally, how well does your current way of finding and arranging recovery support work?",
    options: ["Very well", "Fairly well", "It's mixed", "Not very well", "Poorly"],
  },
  {
    key: "recovery_outcome",
    part: "Question 11 — Recovery outcome",
    title: "How did the customer eventually get working again?",
    options: ["We fixed the original machine", "Remote fix / operator action", "Replacement from our own fleet", "Cross-hire / machine from another rental company", "They used another machine already on site", "They waited for the original machine to be repaired", "Other", "Don't know"],
    other: { option: "Other", key: "recovery_outcome_other", label: "Please tell us more (optional)" },
  },
  {
    key: "avoidable_time",
    part: "Question 12 — Avoidable time",
    title: "Looking back, was there any point where time could realistically have been saved?",
    options: ["Yes", "Probably", "No", "Not sure"],
  },
  {
    key: "biggest_difference",
    part: "Question 12 — Avoidable time",
    title: "What would have made the biggest difference?",
    options: ["Better information from site", "Knowing the fault sooner", "Knowing who to contact", "Getting an engineer sooner", "Getting the right part sooner", "Faster manufacturer / OEM support", "Getting a replacement machine sooner", "Better communication / coordination", "Something else"],
    other: { option: "Something else", key: "biggest_difference_other", label: "Please tell us more (optional)" },
    condition: { key: "avoidable_time", values: ["Yes", "Probably"] },
  },
  {
    key: "customer_working_time_lost",
    part: "Question 13 — Customer working time lost",
    title: "Roughly how much working time did the customer lose?",
    options: ["Under 1 hour", "1–2 hours", "2–4 hours", "4–8 hours", "About a day", "More than a day", "They kept working with a replacement machine", "Don't know"],
  },
  {
    key: "tomorrow_easier",
    part: "Final question",
    title: "If the same thing happened tomorrow, what would make it easier to get the job moving again?",
    kind: "text",
  },
  {
    key: "findings_preference",
    part: "Optional follow-up",
    title: "Would you like a copy of the UK Powered Access Recovery Study findings?",
    options: ["Yes", "No"],
  },
  {
    key: "follow_up_chat",
    part: "Optional follow-up",
    title: "Would you be happy to have a short follow-up chat about your breakdown experience?",
    options: ["Yes", "Maybe", "No"],
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
  const [findingsReceipt, setFindingsReceipt] = useState<FindingsReceipt | null>(null);
  const [findingsMode, setFindingsMode] = useState<"closed" | "confirm" | "form" | "success">("closed");
  const [findingsEmail, setFindingsEmail] = useState("");
  const [findingsError, setFindingsError] = useState("");
  const [findingsSubmitting, setFindingsSubmitting] = useState(false);
  const submissionLocked = useRef(false);
  const trialContactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(findingsReceiptKey);
      if (!saved) return;
      const receipt = JSON.parse(saved) as Partial<FindingsReceipt>;
      if (
        typeof receipt.responseId !== "string" ||
        typeof receipt.token !== "string" ||
        typeof receipt.email !== "string" ||
        typeof receipt.trialInterest !== "string"
      ) return;
      // Restore only the server-confirmed receipt needed to finish the findings request after a refresh.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFindingsReceipt(receipt as FindingsReceipt);
      setAnswers({ follow_up_chat: receipt.trialInterest });
      setScreen("done");
    } catch {
      window.sessionStorage.removeItem(findingsReceiptKey);
    }
  }, []);

  const visibleQuestions = questions.filter((item) => {
    if (!item.condition) return true;
    const conditionAnswer = answers[item.condition.key];
    return typeof conditionAnswer === "string" && item.condition.values.includes(conditionAnswer);
  });
  const question = visibleQuestions[Math.min(step, visibleQuestions.length - 1)];
  const answer = answers[question.key];
  const selected = Array.isArray(answer) ? answer : answer ? [answer] : [];
  const showOther = !!question.other && selected.includes(question.other.option);
  const showContact = question.key === "follow_up_chat";
  const canContinue = question.kind === "text"
    ? typeof answer === "string" && answer.trim().length > 0
    : selected.length > 0;
  const progress = ((step + 1) / visibleQuestions.length) * 100;

  function select(option: string) {
    if (question.multiple) {
      let next: string[];
      if (question.exclusiveOption && option === question.exclusiveOption) {
        next = selected.includes(option) ? [] : [option];
      } else {
        const withoutExclusive = question.exclusiveOption ? selected.filter((item) => item !== question.exclusiveOption) : selected;
        next = withoutExclusive.includes(option) ? withoutExclusive.filter((item) => item !== option) : [...withoutExclusive, option];
      }
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
    if (question.key === "additional_resources_needed" && option !== "Yes") {
      setAnswers((current) => ({
        ...current,
        additional_resources_needed: option,
        additional_resources: undefined,
        resource_source: undefined,
        resource_arrangement: undefined,
        time_to_resource: undefined,
      }));
      setOtherAnswers((current) => ({
        ...current,
        additional_resources_other: "",
        resource_source_other: "",
        resource_arrangement_other: "",
      }));
    }
    if (question.key === "avoidable_time" && option !== "Yes" && option !== "Probably") {
      setAnswers((current) => ({ ...current, avoidable_time: option, biggest_difference: undefined }));
      setOtherAnswers((current) => ({ ...current, biggest_difference_other: "" }));
    }
    if (question.key === "follow_up_chat" && window.matchMedia("(max-width: 600px)").matches) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => trialContactRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
      });
    }
  }

  function next() {
    if (!canContinue || step === visibleQuestions.length - 1) return;
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
        body: JSON.stringify({ questionnaire_version: "uk_industrial_english_v1", ...answers, ...otherAnswers, ...contact }),
      });
      const result = await response.json() as {
        error?: string;
        findings_token?: unknown;
        response?: { id?: unknown; submitted_at?: unknown };
      };
      if (!response.ok) throw new Error(result.error || "Submission failed");
      if (typeof result.response?.id !== "string" || typeof result.findings_token !== "string") {
        throw new Error("Submission was not confirmed");
      }
      const trialInterest = typeof answers.follow_up_chat === "string" ? answers.follow_up_chat : "";
      const receipt: FindingsReceipt = {
        responseId: result.response.id,
        token: result.findings_token,
        email: normaliseEmail(contact.contact_details),
        trialInterest,
      };
      setFindingsReceipt(receipt);
      window.sessionStorage.setItem(findingsReceiptKey, JSON.stringify(receipt));
      setScreen("done");
      window.scrollTo({ top: 0 });
    } catch {
      submissionLocked.current = false;
      setSubmitError("We couldn’t submit your response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function openFindings() {
    if (!findingsReceipt) {
      setFindingsError("We couldn’t add you to the list. Please try again.");
      return;
    }
    setFindingsError("");
    setFindingsEmail(findingsReceipt.email);
    setFindingsMode(findingsReceipt.email ? "confirm" : "form");
  }

  async function requestFindings(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (findingsSubmitting || !findingsReceipt) return;

    const email = normaliseEmail(findingsEmail || findingsReceipt.email);
    if (!email) {
      setFindingsError("Enter a valid email address.");
      return;
    }

    setFindingsSubmitting(true);
    setFindingsError("");
    try {
      const response = await fetch("/api/findings-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response_id: findingsReceipt.responseId, token: findingsReceipt.token, email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to register findings interest");

      const updatedReceipt = { ...findingsReceipt, email };
      setFindingsReceipt(updatedReceipt);
      window.sessionStorage.setItem(findingsReceiptKey, JSON.stringify(updatedReceipt));
      setFindingsMode("success");
    } catch (error) {
      setFindingsError(error instanceof Error && error.message === "Enter a valid email address."
        ? error.message
        : "We couldn’t add you to the list. Please try again.");
    } finally {
      setFindingsSubmitting(false);
    }
  }

  if (screen === "done") {
    const followUp = answers.follow_up_chat === "Yes" || answers.follow_up_chat === "Maybe" || answers.follow_up_chat === "Yes — happy to try it" || answers.follow_up_chat === "Maybe — tell me more";
    return (
      <main className="keep-study keep-done">
        <header className="keep-header"><KeepBrand /><span>RESPONSE RECORDED</span></header>
        <section>
          <div className="keep-success">✓</div>
          <p className="keep-kicker">RESPONSE RECORDED</p>
          <h1>Thanks for sharing your experience.</h1>
          <p className="keep-done-summary">It helps us understand where time is being lost during breakdowns — and what could get machines back to work quicker.{followUp && <span>We’ll be in touch about trying this on a future breakdown.</span>}</p>
          <strong className="keep-done-flag">KEEP THE UK WORKING.</strong>
          {findingsMode !== "closed" && (
            <div className={`keep-findings-panel${findingsMode === "success" ? " is-success" : ""}`} aria-live="polite">
              {findingsMode === "success" ? (
                <><strong>You’re on the list.</strong><p>We’ll send you the findings when they’re ready.</p></>
              ) : findingsMode === "confirm" ? (
                <>
                  <p>Send the findings to:</p>
                  <strong>{findingsReceipt?.email}</strong>
                  {findingsError && <span role="alert">{findingsError}</span>}
                  <button type="button" onClick={() => requestFindings()} disabled={findingsSubmitting}>{findingsSubmitting ? "Saving…" : "Yes, send them"}<b>→</b></button>
                </>
              ) : (
                <form onSubmit={requestFindings} noValidate>
                  <label htmlFor="findings-email">Where should we send the findings?</label>
                  <input id="findings-email" type="email" value={findingsEmail} onChange={(event) => { setFindingsEmail(event.target.value); setFindingsError(""); }} autoComplete="email" placeholder="Email address" aria-invalid={!!findingsError} />
                  {findingsError && <span role="alert">{findingsError}</span>}
                  <button type="submit" disabled={findingsSubmitting}>{findingsSubmitting ? "Saving…" : "Send me the findings"}<b>→</b></button>
                </form>
              )}
            </div>
          )}
          <div className="keep-done-actions">
            {findingsMode === "closed" && <button className="keep-findings-trigger" type="button" onClick={openFindings}>Send me the findings <b>↗</b></button>}
            <Link className="keep-about-link" href="/">About RecoveryFlow <b>↗</b></Link>
          </div>
        </section>
      </main>
    );
  }

  if (screen === "landing") {
    return (
      <main className="keep-study keep-intro keep-survey-intro">
        <header className="keep-header"><KeepBrand /><span>UK POWERED ACCESS RECOVERY STUDY 2026</span></header>
        <section className="keep-survey-welcome">
          <h1>UK Powered Access Recovery Study 2026</h1>
          <div className="keep-survey-intro-copy">
            <p><strong>When a machine goes down, what actually slows getting the job moving again?</strong></p>
            <p>We&apos;re looking at what happens in real breakdowns across the powered access industry — where time gets lost, what gets things moving again, and what could work better.</p>
          </div>
          <div className="keep-survey-cta">
            <button type="button" className="keep-primary" onClick={() => setScreen("questions")}>Share a breakdown <b>↗</b></button>
            <p className="keep-cta-note">Based on real experience. Around 3 minutes.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="keep-study keep-question-page">
      <header className="keep-header keep-header-light"><KeepBrand /><button type="button" onClick={() => setScreen("landing")}>Exit survey</button></header>
      <div className="keep-progress" aria-live="polite"><div><span>SURVEY PROGRESS</span><b>Question {step + 1} of {visibleQuestions.length}</b></div><i><em style={{ width: `${progress}%` }} /></i></div>
      <section className="keep-question-shell" key={question.key}>
        <div className="keep-question-meta"><p className="keep-kicker">{question.part}</p><strong><i>●</i> {question.helper || (question.kind === "text" ? "Free-text response" : question.multiple ? "Select all that apply" : "Select one")}</strong></div>
        <h1>{question.title}</h1>
        {question.kind === "text" ? (
          <label className="keep-other keep-textarea">
            <textarea value={typeof answer === "string" ? answer : ""} maxLength={1000} onChange={(event) => setAnswers((current) => ({ ...current, [question.key]: event.target.value }))} placeholder="Type your answer…" />
            <span>{(typeof answer === "string" ? answer : "").trim().length}/1000</span>
          </label>
        ) : <div className={`keep-options${question.multiple ? " keep-options-multiple" : ""}`}>
          {(question.options || []).map((option, index) => {
            const isSelected = selected.includes(option);
            return (
              <button key={option} type="button" className={isSelected ? "selected" : ""} onClick={() => select(option)} aria-pressed={isSelected}>
                <span>{String(index + 1).padStart(2, "0")}</span><b>{option}</b><i>✓</i>
              </button>
            );
          })}
        </div>}

        {showOther && question.other && (
          <label className="keep-other">{question.other.label}
            <input value={otherAnswers[question.other.key] || ""} maxLength={160} onChange={(event) => setOtherAnswers((current) => ({ ...current, [question.other!.key]: event.target.value }))} placeholder="Add a short description…" />
            <span>{(otherAnswers[question.other.key] || "").trim().length}/160</span>
          </label>
        )}

        {showContact && (
          <div ref={trialContactRef} className="keep-trial-contact" aria-live="polite">
            <div><strong>Email / contact details</strong><span>Optional.</span></div>
            <label>Email / contact details <small>Optional</small><input value={contact.contact_details} maxLength={254} autoComplete="email" onChange={(event) => setContact((current) => ({ ...current, contact_details: event.target.value }))} /></label>
          </div>
        )}

        {submitError && <p className="keep-submit-error" role="alert">{submitError}</p>}
        <div className="keep-actions">
          <div><button type="button" className="keep-back" disabled={submitting} onClick={back}>← Back</button><span>One recent breakdown<small>Choose the closest answer</small></span></div>
          <div><span>{question.helper || (question.kind === "text" ? "Write a short practical answer" : question.multiple ? "Select everything that applied" : "Choose the closest answer")}</span>{step === visibleQuestions.length - 1 ? <button type="button" className="keep-primary" disabled={!canContinue || submitting} onClick={submit}>{submitting ? "Saving…" : "Submit response"}<b>↗</b></button> : <button type="button" className="keep-primary" disabled={!canContinue} onClick={next}>Next question<b>↗</b></button>}</div>
        </div>
      </section>
    </main>
  );
}
