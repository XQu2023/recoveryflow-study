"use client";

import { useMemo, useState } from "react";

type Question = {
  eyebrow: string;
  title: string;
  options?: string[];
  optional?: boolean;
};

const questions: Question[] = [
  { eyebrow: "Your experience", title: "Which best describes your role?", options: ["Fleet Manager", "Service Manager", "Engineer", "Rental Company", "Contractor", "Manufacturer", "Other (please specify)"] },
  { eyebrow: "Downtime causes", title: "What most often causes downtime?", options: ["Electrical", "Hydraulics", "Controls / Sensors", "Battery / Charging", "Parts availability", "Other (please specify)"] },
  { eyebrow: "Your experience", title: "How often does downtime occur?", options: ["Daily", "Weekly", "Monthly", "Less than once a month"] },
  { eyebrow: "Business impact", title: "What has the biggest impact when downtime occurs?", options: ["Project delays", "Lost revenue", "Customer dissatisfaction", "Higher repair costs", "Equipment unavailable", "Other (please specify)"] },
  { eyebrow: "Industry priorities", title: "Which area would you most like to see improved?", options: ["Faster technical support", "Parts availability", "Machine reliability", "Operator training", "Remote diagnostics", "Other (please specify)"] },
  { eyebrow: "Service expectations", title: "How quickly should a downtime issue be resolved?", options: ["Within 4 hours", "Within 24 hours", "Within 2–3 days", "More than 3 days", "It depends on the issue"] },
  { eyebrow: "Stay connected", title: "Would you like to receive the UK Powered Access Downtime Study 2026?", options: ["Yes, by email", "Yes, by LinkedIn", "No, thank you"] },
  { eyebrow: "One final thought", title: "What downtime challenge deserves more industry attention?", optional: true },
];

function KeepBrand() {
  return <a className="keep-brand" href="/" aria-label="RecoveryFlow home"><span className="keep-brand-mark" aria-hidden="true"><i /><i /><i /></span><span>Recovery<span>Flow</span><small>AN INDUSTRY LEARNING INITIATIVE</small></span></a>;
}

export default function KeepStudy() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [other, setOther] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);
  const question = questions[step];
  const answer = answers[step] || "";
  const isOther = answer === "Other (please specify)";
  const canContinue = question.optional || (!!answer && (!isOther || !!other[step]?.trim()));
  const progress = useMemo(() => ((step + 1) / questions.length) * 100, [step]);

  function select(value: string) {
    setAnswers((current) => ({ ...current, [step]: value }));
    if (value !== "Other (please specify)") setOther((current) => ({ ...current, [step]: "" }));
  }

  function next() {
    if (!canContinue) return;
    if (step === questions.length - 1) setDone(true);
    else setStep((current) => current + 1);
  }

  function back() {
    if (step === 0) setStarted(false);
    else setStep((current) => current - 1);
  }

  if (done) return <main className="keep-study keep-done"><header className="keep-header"><KeepBrand /><span>RESPONSE RECORDED</span></header><section><div className="keep-success">✓</div><p className="keep-kicker">UK POWERED ACCESS / 2026</p><h1>Thank you<br /><em>for taking part.</em></h1><p>Your experience will help the UK powered access industry learn from downtime and make better decisions.</p><div className="keep-done-actions"><a href="/">Return home <b>↗</b></a><button onClick={() => { setDone(false); setStarted(false); setStep(0); setAnswers({}); setOther({}); }}>Start again</button></div></section></main>;

  if (!started) return <main className="keep-study keep-intro"><header className="keep-header"><KeepBrand /><span>UK POWERED ACCESS / 2026</span></header><section className="keep-intro-grid"><div><p className="keep-kicker">RECOVERY STUDY / 2026</p><h1>Keep the UK<br /><em>working.</em></h1><p className="keep-lead">Help us understand what really causes downtime — and what the powered access industry can do better.</p><button className="keep-primary" onClick={() => setStarted(true)}>Take part in the study <b>↗</b></button><div className="keep-facts"><span><b>01</b>Anonymous</span><span><b>02</b>About 3 minutes</span><span><b>03</b>One response</span></div></div><aside><span className="keep-orbit" aria-hidden="true" /><div><small>RECOVERYFLOW</small><strong>Learning from downtime.<br />Improving uptime together.</strong></div></aside></section></main>;

  return <main className="keep-study keep-question-page"><header className="keep-header keep-header-light"><KeepBrand /><button onClick={() => setStarted(false)}>Exit study</button></header><div className="keep-progress"><div><span>STUDY PROGRESS</span><b>Question {step + 1} of {questions.length}</b></div><i><em style={{ width: `${progress}%` }} /></i></div><section className="keep-question-shell"><div className="keep-question-meta"><p className="keep-kicker">{question.eyebrow}</p><strong><i>●</i> Anonymous participation</strong></div><h1>{question.title}</h1>{question.options ? <><div className="keep-options">{question.options.map((option, index) => <button key={option} className={answer === option ? "selected" : ""} onClick={() => select(option)} aria-pressed={answer === option}><span>{String(index + 1).padStart(2, "0")}</span><b>{option}</b><i>✓</i></button>)}</div>{isOther && <label className="keep-other">Please specify<input autoFocus value={other[step] || ""} maxLength={160} onChange={(event) => setOther((current) => ({ ...current, [step]: event.target.value }))} placeholder="Add a short description…" /><span>{(other[step] || "").trim().length}/160</span></label>}</> : <div className="keep-textarea"><textarea autoFocus value={answer} maxLength={700} onChange={(event) => select(event.target.value)} placeholder="Share anything you’d like the industry to know…" /><span>{answer.length}/700</span></div>}<div className="keep-actions"><div><button className="keep-back" onClick={back}>← Back</button><span>Your answers are anonymous<small>One response per person</small></span></div><div><span>{question.optional ? "Optional — share as much or as little as you like" : "Select one answer to continue"}</span><button className="keep-primary" disabled={!canContinue} onClick={next}>{step === 7 ? "Submit study" : "Next question"}<b>↗</b></button></div></div></section></main>;
}
