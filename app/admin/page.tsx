"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type RecoveryCase = {
  id: string; submitted_at: string; machine_type: string; machine_type_other: string | null;
  first_report_source: string; first_report_source_other: string | null; information_sufficient: string;
  information_available: string[]; information_available_other: string | null; first_action: string;
  first_action_other: string | null; first_action_effectiveness: string; time_to_right_way_forward: string;
  recovery_requirements: string[]; recovery_requirements_other: string | null; total_downtime: string;
  biggest_time_loss: string; biggest_time_loss_other: string | null; breakdown_frequency: string;
  most_helpful_next_breakdown: string; most_helpful_next_breakdown_other: string | null; role: string;
  role_other: string | null; trial_interest: string; contact_name: string | null; company: string | null;
  contact_details: string | null; source: string; schema_version: number;
};

type Contributor = {
  id: string; joined_at: string; full_name: string; company: string; role: string; email: string;
  linkedin: string | null; contribution_interests: string[]; consent: boolean; status: string;
  source: string; schema_version: number;
};

const caseColumns: Array<keyof RecoveryCase> = [
  "id", "submitted_at", "machine_type", "machine_type_other", "first_report_source", "first_report_source_other",
  "information_sufficient", "information_available", "information_available_other", "first_action", "first_action_other",
  "first_action_effectiveness", "time_to_right_way_forward", "recovery_requirements", "recovery_requirements_other",
  "total_downtime", "biggest_time_loss", "biggest_time_loss_other", "breakdown_frequency",
  "most_helpful_next_breakdown", "most_helpful_next_breakdown_other", "role", "role_other", "trial_interest",
  "contact_name", "company", "contact_details", "source", "schema_version",
];

const contributorColumns: Array<keyof Contributor> = [
  "id", "joined_at", "full_name", "company", "role", "email", "linkedin", "contribution_interests",
  "consent", "status", "source", "schema_version",
];

function csvCell(value: unknown) {
  const text = Array.isArray(value) ? value.join(" | ") : value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function matches(item: object, needle: string) {
  return Object.values(item).some((value) => String(Array.isArray(value) ? value.join(" ") : value ?? "").toLowerCase().includes(needle));
}

export default function RecoveryAdmin() {
  const [view, setView] = useState<"cases" | "contributors">("cases");
  const [cases, setCases] = useState<RecoveryCase[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [caseTotal, setCaseTotal] = useState(0);
  const [contributorTotal, setContributorTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const refreshCases = useCallback(async () => {
    const response = await fetch("/api/admin/recovery-cases", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load cases");
    setCases(data.cases || []);
    setCaseTotal(data.total || 0);
  }, []);

  const refreshContributors = useCallback(async () => {
    const response = await fetch("/api/admin/contributors", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load contributors");
    setContributors(data.contributors || []);
    setContributorTotal(data.total || 0);
  }, []);

  useEffect(() => {
    // These callbacks synchronise the protected server data after the admin shell mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    Promise.allSettled([refreshCases(), refreshContributors()]).then((results) => {
      const nextErrors: Record<string, string> = {};
      if (results[0].status === "rejected") nextErrors.cases = "Recovery Cases could not be loaded. Please refresh and try again.";
      if (results[1].status === "rejected") nextErrors.contributors = "Contributors could not be loaded. Please refresh and try again.";
      setErrors(nextErrors);
      setLoading(false);
    });
  }, [refreshCases, refreshContributors]);

  const filteredCases = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? cases.filter((item) => matches(item, needle)) : cases;
  }, [cases, query]);

  const filteredContributors = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? contributors.filter((item) => matches(item, needle)) : contributors;
  }, [contributors, query]);

  function changeView(next: "cases" | "contributors") {
    setView(next);
    setQuery("");
  }

  function exportCsv() {
    const isCases = view === "cases";
    const columns = isCases ? caseColumns : contributorColumns;
    const records = isCases ? filteredCases : filteredContributors;
    const rows = [columns.join(","), ...records.map((item) => columns.map((column) => csvCell((item as Record<string, unknown>)[column])).join(","))];
    const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${isCases ? "recovery-cases" : "contributors"}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin/login");
  }

  async function deleteRecord(kind: "cases" | "contributors", id: string) {
    const message = kind === "cases" ? "Delete this Recovery Case permanently?" : "Delete this Contributor permanently?";
    if (!window.confirm(message)) return;

    setDeletingId(id);
    setDeleteError("");
    try {
      const endpoint = kind === "cases" ? "/api/admin/recovery-cases" : "/api/admin/contributors";
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete this record");
      if (kind === "cases") await refreshCases();
      else await refreshContributors();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Unable to delete this record. Please try again.");
    } finally {
      setDeletingId("");
    }
  }

  const activeError = errors[view];
  const activeCount = view === "cases" ? filteredCases.length : filteredContributors.length;

  return (
    <main className="recovery-admin">
      <header>
        <Link className="keep-brand" href="/" aria-label="RecoveryFlow home">
          <span className="keep-brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Recovery<span>Flow</span><small>ADMIN</small></span>
        </Link>
        <div className="admin-header-actions"><span>RECOVERYFLOW CONTRIBUTOR NETWORK</span><button onClick={logout}>Log out</button></div>
      </header>

      <section className="admin-shell">
        <div className="admin-tabs" role="tablist" aria-label="Admin data">
          <button role="tab" aria-selected={view === "cases"} className={view === "cases" ? "active" : ""} onClick={() => changeView("cases")}>Breakdown Responses <b>{loading ? "—" : caseTotal}</b></button>
          <button role="tab" aria-selected={view === "contributors"} className={view === "contributors" ? "active" : ""} onClick={() => changeView("contributors")}>Contributors <b>{loading ? "—" : contributorTotal}</b></button>
        </div>

        <div className="admin-heading">
          <div><p>RECOVERYFLOW / DATA</p><h1>{view === "cases" ? "Breakdown Responses" : "Contributors"}</h1></div>
          <div className="admin-total"><span>{view === "cases" ? "Total submissions" : "Total contributors"}</span><strong>{loading ? "—" : view === "cases" ? caseTotal : contributorTotal}</strong></div>
        </div>

        <div className="admin-toolbar">
          <label><span>{view === "cases" ? "Search responses" : "Search contributors"}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={view === "cases" ? "Role, machine, answer or contact…" : "Name, company, role, email or interest…"} /></label>
          <button onClick={exportCsv} disabled={loading || activeCount === 0}>Export CSV <b>↓</b></button>
        </div>

        {activeError && <p className="admin-error" role="alert">{activeError}</p>}
        {deleteError && <p className="admin-error" role="alert">{deleteError}</p>}
        {!activeError && loading && <p className="admin-state">Loading {view === "cases" ? "Recovery Cases" : "Contributors"}…</p>}
        {!activeError && !loading && activeCount === 0 && <p className="admin-state">{query ? `No ${view === "cases" ? "Recovery Cases" : "Contributors"} match your search.` : `No ${view === "cases" ? "submissions" : "contributors"} yet.`}</p>}

        {view === "cases" ? (
          <div className="admin-cases">
            {filteredCases.map((item) => (
              <article key={item.id}>
                <div className="admin-case-head"><div><span>{item.role}{item.role_other ? ` — ${item.role_other}` : ""}</span><h2>{item.machine_type}{item.machine_type_other ? ` — ${item.machine_type_other}` : ""}</h2><p>{item.contact_name || "Anonymous response"}{item.company ? ` · ${item.company}` : ""}{item.contact_details ? ` · ${item.contact_details}` : ""}</p></div><div className="admin-case-actions"><time>{new Date(item.submitted_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</time><button className="admin-delete" onClick={() => deleteRecord("cases", item.id)} disabled={!!deletingId}>{deletingId === item.id ? "Deleting…" : "Delete"}</button></div></div>
                <dl>
                  <div><dt>Response ID</dt><dd>{item.id}</dd></div>
                  <div><dt>First report</dt><dd>{item.first_report_source}{item.first_report_source_other ? ` — ${item.first_report_source_other}` : ""}</dd></div>
                  <div><dt>Enough information</dt><dd>{item.information_sufficient}</dd></div>
                  <div className="admin-record-wide"><dt>Information available</dt><dd>{item.information_available.join(" · ")}{item.information_available_other ? ` — ${item.information_available_other}` : ""}</dd></div>
                  <div><dt>First action</dt><dd>{item.first_action}{item.first_action_other ? ` — ${item.first_action_other}` : ""}</dd></div>
                  <div><dt>Right next step</dt><dd>{item.first_action_effectiveness}</dd></div>
                  <div><dt>Time to right way forward</dt><dd>{item.time_to_right_way_forward}</dd></div>
                  <div className="admin-record-wide"><dt>Recovery requirements</dt><dd>{item.recovery_requirements.join(" · ")}{item.recovery_requirements_other ? ` — ${item.recovery_requirements_other}` : ""}</dd></div>
                  <div><dt>Total downtime</dt><dd>{item.total_downtime}</dd></div>
                  <div><dt>Biggest time loss</dt><dd>{item.biggest_time_loss}{item.biggest_time_loss_other ? ` — ${item.biggest_time_loss_other}` : ""}</dd></div>
                  <div><dt>Breakdown frequency</dt><dd>{item.breakdown_frequency}</dd></div>
                  <div className="admin-record-wide"><dt>Most helpful next time</dt><dd>{item.most_helpful_next_breakdown}{item.most_helpful_next_breakdown_other ? ` — ${item.most_helpful_next_breakdown_other}` : ""}</dd></div>
                  <div><dt>Future trial interest</dt><dd>{item.trial_interest}</dd></div>
                  <div><dt>Contact</dt><dd>{item.contact_name || "Not provided"}{item.company ? ` · ${item.company}` : ""}{item.contact_details ? ` · ${item.contact_details}` : ""}</dd></div>
                  <div><dt>Schema</dt><dd>V{item.schema_version}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-cases admin-contributors">
            {filteredContributors.map((item) => (
              <article key={item.id}>
                <div className="admin-case-head"><div><span>{item.status}</span><h2>{item.full_name}</h2><p>{item.role} · {item.company} · <a href={`mailto:${item.email}`}>{item.email}</a></p></div><div className="admin-case-actions"><time>{new Date(item.joined_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</time><button className="admin-delete" onClick={() => deleteRecord("contributors", item.id)} disabled={!!deletingId}>{deletingId === item.id ? "Deleting…" : "Delete"}</button></div></div>
                <dl>
                  <div><dt>Contributor ID</dt><dd>{item.id}</dd></div>
                  <div><dt>Joined at</dt><dd>{new Date(item.joined_at).toLocaleString("en-GB")}</dd></div>
                  <div><dt>Status</dt><dd>{item.status}</dd></div>
                  <div><dt>Full name</dt><dd>{item.full_name}</dd></div>
                  <div><dt>Company</dt><dd>{item.company}</dd></div>
                  <div><dt>Role</dt><dd>{item.role}</dd></div>
                  <div><dt>Email</dt><dd><a href={`mailto:${item.email}`}>{item.email}</a></dd></div>
                  <div><dt>LinkedIn</dt><dd>{item.linkedin ? <a href={item.linkedin} target="_blank" rel="noreferrer">View profile ↗</a> : "Not provided"}</dd></div>
                  <div><dt>Consent</dt><dd>{item.consent ? "Confirmed" : "Not confirmed"}</dd></div>
                  <div className="admin-record-wide"><dt>Contribution interests</dt><dd>{item.contribution_interests.join(" · ")}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
