"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type RecoveryCase = {
  id: string;
  created_at: string;
  role: string;
  stop_reason: string;
  stop_reason_other: string | null;
  warning_signs: string;
  warning_signs_detail: string | null;
  biggest_delay: string;
  biggest_delay_other: string | null;
  recovery_help: string;
  recovery_help_other: string | null;
  improvement: string;
  improvement_other: string | null;
  full_name: string;
  company: string;
  email: string;
  linkedin: string | null;
  receive_findings: boolean;
};

const columns: Array<keyof RecoveryCase> = [
  "id", "created_at", "role", "stop_reason", "stop_reason_other", "warning_signs",
  "warning_signs_detail", "biggest_delay", "biggest_delay_other", "recovery_help",
  "recovery_help_other", "improvement", "improvement_other", "full_name", "company",
  "email", "linkedin", "receive_findings",
];

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export default function RecoveryAdmin() {
  const [cases, setCases] = useState<RecoveryCase[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/recovery-cases", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load cases");
        setCases(data.cases || []);
        setTotal(data.total || 0);
      })
      .catch(() => setError("Recovery Cases could not be loaded. Please refresh and try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return cases;
    return cases.filter((item) => Object.values(item).some((value) => String(value ?? "").toLowerCase().includes(needle)));
  }, [cases, query]);

  function exportCsv() {
    const rows = [columns.join(","), ...filtered.map((item) => columns.map((column) => csvCell(item[column])).join(","))];
    const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `recovery-cases-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin/login");
  }

  return (
    <main className="recovery-admin">
      <header>
        <Link className="keep-brand" href="/keep" aria-label="RecoveryFlow Study">
          <span className="keep-brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Recovery<span>Flow</span><small>RECOVERY STUDY ADMIN</small></span>
        </Link>
        <div className="admin-header-actions"><span>UK POWERED ACCESS RECOVERY STUDY 2026</span><button onClick={logout}>Log out</button></div>
      </header>
      <section className="admin-shell">
        <div className="admin-heading">
          <div><p>RECOVERY STUDY / DATA</p><h1>Recovery Cases</h1></div>
          <div className="admin-total"><span>Total submissions</span><strong>{loading ? "—" : total}</strong></div>
        </div>
        <div className="admin-toolbar">
          <label><span>Search cases</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, company, email or answer…" /></label>
          <button onClick={exportCsv} disabled={loading || filtered.length === 0}>Export CSV <b>↓</b></button>
        </div>
        {error && <p className="admin-error" role="alert">{error}</p>}
        {!error && loading && <p className="admin-state">Loading Recovery Cases…</p>}
        {!error && !loading && filtered.length === 0 && <p className="admin-state">{query ? "No Recovery Cases match your search." : "No submissions yet."}</p>}
        <div className="admin-cases">
          {filtered.map((item) => (
            <article key={item.id}>
              <div className="admin-case-head"><div><span>{item.role}</span><h2>{item.company}</h2><p>{item.full_name} · <a href={`mailto:${item.email}`}>{item.email}</a></p></div><time>{new Date(item.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</time></div>
              <dl>
                <div><dt>Machine stopped</dt><dd>{item.stop_reason}{item.stop_reason_other ? ` — ${item.stop_reason_other}` : ""}</dd></div>
                <div><dt>Warning signs</dt><dd>{item.warning_signs}{item.warning_signs_detail ? ` — ${item.warning_signs_detail}` : ""}</dd></div>
                <div><dt>Biggest delay</dt><dd>{item.biggest_delay}{item.biggest_delay_other ? ` — ${item.biggest_delay_other}` : ""}</dd></div>
                <div><dt>What helped</dt><dd>{item.recovery_help}{item.recovery_help_other ? ` — ${item.recovery_help_other}` : ""}</dd></div>
                <div><dt>One improvement</dt><dd>{item.improvement}{item.improvement_other ? ` — ${item.improvement_other}` : ""}</dd></div>
                <div><dt>Study findings</dt><dd>{item.receive_findings ? "Requested" : "Not requested"}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
