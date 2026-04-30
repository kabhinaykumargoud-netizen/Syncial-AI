-- ============================================================
-- Syncial — Supabase Schema (Updated for Backend Alignment)
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query
-- ============================================================

-- ACCOUNTS TABLE
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  platform text not null,
  access_token text,
  created_at timestamptz not null default now(),
  unique(user_id, platform)
);

-- POSTS TABLE
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  platform text not null,
  status text not null default 'pending' check (status in ('pending', 'posted')),
  scheduled_time timestamptz,
  image_url text,
  created_at timestamptz not null default now()
);

-- ANALYTICS TABLE
create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade not null,
  likes integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0
);

-- INDEXES FOR PERFORMANCE
create index if not exists idx_posts_user_id on public.posts(user_id);
create index if not exists idx_posts_scheduled_time on public.posts(scheduled_time);

-- ROW LEVEL SECURITY
alter table public.accounts enable row level security;
alter table public.posts enable row level security;
alter table public.analytics enable row level security;

-- ACCOUNTS POLICIES
create policy "Users can view own accounts" on public.accounts
  for select using (auth.uid() = user_id);

create policy "Users can insert own accounts" on public.accounts
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own accounts" on public.accounts
  for delete using (auth.uid() = user_id);

-- POSTS POLICIES
create policy "Users can view own posts" on public.posts
  for select using (auth.uid() = user_id);

create policy "Users can insert own posts" on public.posts
  for insert with check (auth.uid() = user_id);

create policy "Users can update own posts" on public.posts
  for update using (auth.uid() = user_id);

create policy "Users can delete own posts" on public.posts
  for delete using (auth.uid() = user_id);

-- ANALYTICS POLICIES
-- To secure analytics based on post ownership:
create policy "Users can view own analytics" on public.analytics
  for select using (
    exists (
      select 1 from public.posts
      where posts.id = analytics.post_id and posts.user_id = auth.uid()
    )
  );

create policy "Users can insert own analytics" on public.analytics
  for insert with check (
    exists (
      select 1 from public.posts
      where posts.id = analytics.post_id and posts.user_id = auth.uid()
    )
  );

-- Enable Realtime for posts
alter publication supabase_realtime add table public.posts;
