create table public.recovery_cases (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role text not null,
  stop_reason text not null,
  stop_reason_other text,
  warning_signs text not null,
  warning_signs_detail text,
  biggest_delay text not null,
  biggest_delay_other text,
  recovery_help text not null,
  recovery_help_other text,
  improvement text not null,
  improvement_other text,
  full_name text not null,
  company text not null,
  email text not null,
  linkedin text,
  receive_findings boolean not null default false,
  source text not null default 'recoveryflow_web',
  schema_version smallint not null default 1,
  constraint recovery_cases_conditional_answers check (
    (stop_reason <> 'Other' or nullif(btrim(stop_reason_other), '') is not null)
    and (warning_signs <> 'Yes' or nullif(btrim(warning_signs_detail), '') is not null)
    and (biggest_delay <> 'Other' or nullif(btrim(biggest_delay_other), '') is not null)
    and (recovery_help <> 'Other' or nullif(btrim(recovery_help_other), '') is not null)
    and (improvement <> 'Other' or nullif(btrim(improvement_other), '') is not null)
  )
);
create index recovery_cases_created_at_idx on public.recovery_cases (created_at desc);
alter table public.recovery_cases enable row level security;
revoke all on table public.recovery_cases from anon, authenticated;
comment on table public.recovery_cases is 'One structured record for each completed UK Powered Access Recovery Study 2026 submission.';;
