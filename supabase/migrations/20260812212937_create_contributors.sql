create table public.contributors (
  id uuid primary key default gen_random_uuid(),
  joined_at timestamptz not null default now(),
  full_name text not null,
  company text not null,
  role text not null,
  email text not null,
  linkedin text,
  contribution_interests text[] not null,
  consent boolean not null,
  status text not null default 'active',
  source text not null default 'recoveryflow_web',
  schema_version smallint not null default 1,
  constraint contributors_required_values check (
    nullif(btrim(full_name), '') is not null
    and nullif(btrim(company), '') is not null
    and nullif(btrim(role), '') is not null
    and nullif(btrim(email), '') is not null
  ),
  constraint contributors_interests_valid check (
    cardinality(contribution_interests) between 1 and 6
    and contribution_interests <@ array[
      'Share real experiences',
      'Share practical knowledge',
      'Take part in interviews or studies',
      'Join industry discussions',
      'Make useful introductions',
      'Not sure yet — keep me informed'
    ]::text[]
  ),
  constraint contributors_consent_required check (consent is true),
  constraint contributors_status_valid check (status in ('active', 'inactive'))
);

create unique index contributors_email_unique_idx
  on public.contributors (lower(btrim(email)));

create index contributors_joined_at_idx
  on public.contributors (joined_at desc);

alter table public.contributors enable row level security;

revoke all on table public.contributors from public, anon, authenticated;
grant select, insert, update, delete on table public.contributors to service_role;

comment on table public.contributors is
  'RecoveryFlow Contributor Programme participants; accessible only through secure server-side services.';
