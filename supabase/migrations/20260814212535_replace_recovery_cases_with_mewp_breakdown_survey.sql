drop table public.recovery_cases;

create table public.recovery_cases (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  machine_type text not null check (machine_type in ('Boom', 'Scissor', 'Vertical mast', 'Other / Not sure')),
  machine_type_other text,
  first_report_source text not null check (first_report_source in ('Operator / site contact', 'Hire desk', 'Engineer', 'Telematics / remote alert', 'Other')),
  first_report_source_other text,
  information_sufficient text not null check (information_sufficient in ('Yes', 'Partly', 'No')),
  information_available text[] not null check (
    cardinality(information_available) > 0
    and information_available <@ array['Description of the problem', 'Fault code', 'Photos / video', 'Machine details', 'Service / breakdown history', 'Telematics / remote data', 'Other']::text[]
  ),
  information_available_other text,
  first_action text not null check (first_action in ('Remote checks with the operator/customer', 'Sent / arranged an engineer', 'Contacted the manufacturer/OEM', 'Checked / arranged a part', 'Arranged another machine', 'Asked for more information', 'Other')),
  first_action_other text,
  first_action_effectiveness text not null check (first_action_effectiveness in ('Yes', 'Partly', 'No — we had to change approach', 'Not sure')),
  time_to_right_way_forward text not null check (time_to_right_way_forward in ('Under 15 mins', '15–30 mins', '30–60 mins', '1–2 hours', '2–4 hours', '4+ hours', 'Not sure')),
  recovery_requirements text[] not null check (
    cardinality(recovery_requirements) > 0
    and recovery_requirements <@ array['Remote fix', 'Engineer visit', 'Another engineer visit', 'Part(s)', 'Manufacturer/OEM support', 'Replacement machine / cross-hire', 'Transport', 'Other']::text[]
  ),
  recovery_requirements_other text,
  total_downtime text not null check (total_downtime in ('Under 1 hour', '1–4 hours', '4–8 hours', '8–24 hours', '1–2 days', '3+ days', 'Not sure')),
  biggest_time_loss text not null check (biggest_time_loss in ('Getting the right information', 'Working out the fault', 'Waiting for an engineer', 'Finding the right part', 'Waiting for the part', 'Waiting for manufacturer/OEM support', 'Finding another machine', 'Transport', 'Communication / approval', 'Nowhere in particular — it went smoothly', 'Other')),
  biggest_time_loss_other text,
  breakdown_frequency text not null check (breakdown_frequency in ('Most days', 'A few times a week', 'About once a week', 'A few times a month', 'Less often')),
  most_helpful_next_breakdown text not null check (most_helpful_next_breakdown in ('Better information from site', 'Knowing the likely fault sooner', 'Knowing the best next step', 'Finding the right engineer', 'Finding the right part', 'Finding another machine quickly', 'Seeing how similar breakdowns were fixed before', 'Nothing in particular', 'Other')),
  most_helpful_next_breakdown_other text,
  role text not null check (role in ('Service Manager / Controller', 'Engineer', 'Hire desk / Rental', 'Fleet / Operations', 'Other')),
  role_other text,
  trial_interest text not null check (trial_interest in ('Yes — happy to try it', 'Maybe — tell me more', 'Not at the moment')),
  contact_name text,
  company text,
  contact_details text,
  source text not null default 'recoveryflow_web',
  schema_version smallint not null default 2 check (schema_version = 2),
  constraint recovery_cases_contact_scope check (
    trial_interest <> 'Not at the moment'
    or (contact_name is null and company is null and contact_details is null)
  )
);

create index recovery_cases_submitted_at_idx
  on public.recovery_cases (submitted_at desc);

alter table public.recovery_cases enable row level security;

revoke all on table public.recovery_cases from anon, authenticated;
grant select, insert, delete on table public.recovery_cases to service_role;

comment on table public.recovery_cases is
  'One structured response to the MEWP Breakdown & Recovery Survey V1.0.';
