create table report_drafts (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  status text not null default 'submitted',
  form_data jsonb not null,
  narrative_overrides jsonb not null default '{}',
  photo_urls jsonb not null default '{}',
  admin_email text not null default 'nick@epservices.co.nz',
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index report_drafts_token_idx on report_drafts(token);

alter table report_drafts enable row level security;
-- Deliberately no policies: anon/authenticated get zero direct access via PostgREST.
-- All reads/writes go through Edge Functions using the service-role key.

insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', false);
-- No storage.objects policies either: private bucket, service-role-only access.
