-- Run this once in the Liverexectours Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query → paste → Run).

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  service text,
  message text not null
);

alter table public.enquiries enable row level security;

-- Anyone (the public website) can submit an enquiry...
create policy "Allow public insert" on public.enquiries
  for insert
  to anon
  with check (true);

-- ...but nobody can read, update, or delete via the public API.
-- View submissions in the Table Editor (dashboard access bypasses RLS).
