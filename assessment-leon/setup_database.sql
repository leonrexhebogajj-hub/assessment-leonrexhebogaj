-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Tables (if they don't exist)
create table if not exists videos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists annotations (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references videos not null,
  user_id uuid references auth.users not null,
  text text not null,
  timestamp float not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists bookmarks (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references videos not null,
  user_id uuid references auth.users not null,
  title text not null,
  timestamp float not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table videos enable row level security;
alter table annotations enable row level security;
alter table bookmarks enable row level security;

-- 3. Create Table Policies (Drop existing to avoid conflicts if re-running)
drop policy if exists "Public videos are viewable by everyone" on videos;
create policy "Public videos are viewable by everyone" on videos for select using ( true );

drop policy if exists "Users can insert their own videos" on videos;
create policy "Users can insert their own videos" on videos for insert with check ( auth.uid() = user_id );

drop policy if exists "Annotations are viewable by everyone" on annotations;
create policy "Annotations are viewable by everyone" on annotations for select using ( true );

drop policy if exists "Users can insert their own annotations" on annotations;
create policy "Users can insert their own annotations" on annotations for insert with check ( auth.uid() = user_id );

drop policy if exists "Users can view their own bookmarks" on bookmarks;
create policy "Users can view their own bookmarks" on bookmarks for select using ( auth.uid() = user_id );

drop policy if exists "Users can insert their own bookmarks" on bookmarks;
create policy "Users can insert their own bookmarks" on bookmarks for insert with check ( auth.uid() = user_id );

-- 4. Storage Bucket Setup ('Videos Wayland')
insert into storage.buckets (id, name, public)
values ('Videos Wayland', 'Videos Wayland', true)
on conflict (id) do nothing;

-- 5. Storage Policies
drop policy if exists "Public Access to Videos Wayland bucket" on storage.objects;
create policy "Public Access to Videos Wayland bucket" on storage.objects for select using ( bucket_id = 'Videos Wayland' );

drop policy if exists "Authenticated Uploads to Videos Wayland bucket" on storage.objects;
create policy "Authenticated Uploads to Videos Wayland bucket" on storage.objects for insert to authenticated with check ( bucket_id = 'Videos Wayland' );

drop policy if exists "Users can update own files in Videos Wayland bucket" on storage.objects;
create policy "Users can update own files in Videos Wayland bucket" on storage.objects for update to authenticated using ( auth.uid() = owner ) with check ( bucket_id = 'Videos Wayland' );

drop policy if exists "Users can delete own files in Videos Wayland bucket" on storage.objects;
create policy "Users can delete own files in Videos Wayland bucket" on storage.objects for delete to authenticated using ( auth.uid() = owner and bucket_id = 'Videos Wayland' );
