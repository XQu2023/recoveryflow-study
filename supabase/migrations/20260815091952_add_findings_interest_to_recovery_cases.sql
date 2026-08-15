alter table public.recovery_cases
  add column wants_findings boolean not null default false,
  add column findings_email text,
  add column findings_requested_at timestamptz,
  add column findings_token_hash text;

alter table public.recovery_cases
  add constraint recovery_cases_findings_state check (
    (
      wants_findings = false
      and findings_email is null
      and findings_requested_at is null
    )
    or
    (
      wants_findings = true
      and findings_email is not null
      and findings_requested_at is not null
    )
  ),
  add constraint recovery_cases_findings_email check (
    findings_email is null
    or findings_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  add constraint recovery_cases_findings_token_hash check (
    findings_token_hash is null
    or findings_token_hash ~ '^[0-9a-f]{64}$'
  );

grant update (wants_findings, findings_email, findings_requested_at)
  on table public.recovery_cases to service_role;

comment on column public.recovery_cases.wants_findings is
  'Whether the respondent asked to receive the completed Study findings.';
comment on column public.recovery_cases.findings_email is
  'Email address supplied specifically for future Study findings.';
comment on column public.recovery_cases.findings_requested_at is
  'Server-generated time when findings interest was first registered.';
comment on column public.recovery_cases.findings_token_hash is
  'SHA-256 hash of the capability token returned only for the newly created response.';
