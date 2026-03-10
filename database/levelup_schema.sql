-- LevelUp.ai Supabase Schema
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  tier text default 'free' check (tier in ('free','pro','enterprise')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table if not exists public.contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null, linkedin_url text, company text, role text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null, linkedin_url text,
  linkedin_data jsonb default '{}', analysis jsonb default '{}',
  has_whatsapp boolean default false, scheduling_pref text,
  created_at timestamptz default now()
);
create table if not exists public.scheduling_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  provider text default 'google' check (provider in ('google','outlook','cal.com')),
  calendar_url text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table public.users enable row level security;
alter table public.contacts enable row level security;
alter table public.analyses enable row level security;
alter table public.scheduling_preferences enable row level security;
create policy "Users view own" on public.users for select using (auth.uid()=id);
create policy "Users update own" on public.users for update using (auth.uid()=id);
create policy "Contacts view" on public.contacts for select using (auth.uid()=user_id);
create policy "Contacts insert" on public.contacts for insert with check (auth.uid()=user_id);
create policy "Contacts update" on public.contacts for update using (auth.uid()=user_id);
create policy "Contacts delete" on public.contacts for delete using (auth.uid()=user_id);
create policy "Analyses view" on public.analyses for select using (auth.uid()=user_id);
create policy "Analyses insert" on public.analyses for insert with check (auth.uid()=user_id);
create policy "Sched view" on public.scheduling_preferences for select using (auth.uid()=user_id);
create policy "Sched insert" on public.scheduling_preferences for insert with check (auth.uid()=user_id);
create policy "Sched update" on public.scheduling_preferences for update using (auth.uid()=user_id);
create index if not exists idx_contacts_uid on public.contacts(user_id);
create index if not exists idx_analyses_uid on public.analyses(user_id);
