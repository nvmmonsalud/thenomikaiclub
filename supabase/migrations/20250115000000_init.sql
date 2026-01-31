-- Enable extensions
create extension if not exists "pgcrypto";

-- Roles enum
create type public.user_role as enum ('member', 'admin');

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role public.user_role not null default 'member',
  created_at timestamptz not null default now()
);

-- Bars table
create table if not exists public.bars (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  neighborhood text,
  description text,
  created_at timestamptz not null default now()
);

-- Posts table (public updates)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Reviews table
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  bar_id uuid not null references public.bars (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text,
  image_path text,
  created_at timestamptz not null default now()
);

-- Helper function to check admin role
create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id and role = 'admin'
  );
$$;

-- Automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.bars enable row level security;
alter table public.posts enable row level security;
alter table public.reviews enable row level security;

-- Profiles policies
create policy "Public profiles are viewable" on public.profiles
  for select using (true);

create policy "Users can update their profile" on public.profiles
  for update using (auth.uid() = id);

-- Bars policies (public read)
create policy "Bars are publicly readable" on public.bars
  for select using (true);

create policy "Admins can manage bars" on public.bars
  for all using (public.is_admin());

-- Posts policies (public read)
create policy "Posts are publicly readable" on public.posts
  for select using (true);

create policy "Admins can manage posts" on public.posts
  for all using (public.is_admin());

-- Reviews policies
create policy "Reviews are publicly readable" on public.reviews
  for select using (true);

create policy "Authenticated users can create reviews" on public.reviews
  for insert with check (auth.role() = 'authenticated' and auth.uid() = user_id);

create policy "Users can update their own reviews" on public.reviews
  for update using (auth.uid() = user_id);

create policy "Users can delete their own reviews" on public.reviews
  for delete using (auth.uid() = user_id);

-- Storage bucket for review images
insert into storage.buckets (id, name, public)
values ('review-images', 'review-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public can read review images" on storage.objects
  for select using (bucket_id = 'review-images');

create policy "Authenticated users can upload review images" on storage.objects
  for insert with check (
    bucket_id = 'review-images'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own review images" on storage.objects
  for update using (
    bucket_id = 'review-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own review images" on storage.objects
  for delete using (
    bucket_id = 'review-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
