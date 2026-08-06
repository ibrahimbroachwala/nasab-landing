-- Waitlist table for the Nasab landing page (nasab.tappstudio.in).
-- Run this once in the Supabase SQL editor of the app's existing project.
-- Public-facing: anon may only INSERT; no select/update/delete policies
-- exist, so RLS denies everything else by default.

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);

alter table waitlist enable row level security;

create policy "Anon can join the waitlist"
  on waitlist
  for insert
  to anon
  with check (true);
