-- Create a table for videos
create table videos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for annotations
create table annotations (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references videos not null,
  user_id uuid references auth.users not null,
  text text not null,
  timestamp float not null, -- stored in seconds
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for bookmarks
create table bookmarks (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references videos not null,
  user_id uuid references auth.users not null,
  title text not null,
  timestamp float not null, -- stored in seconds
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table videos enable row level security;
alter table annotations enable row level security;
alter table bookmarks enable row level security;

-- Create policies (modify as needed for your specific access control rules)

-- Videos: Everyone can view, only authenticated users can insert
create policy "Public videos are viewable by everyone"
  on videos for select
  using ( true );

create policy "Users can insert their own videos"
  on videos for insert
  with check ( auth.uid() = user_id );

-- Annotations: Viewing depends on video visibility, insert own
create policy "Annotations are viewable by everyone"
  on annotations for select
  using ( true );

create policy "Users can insert their own annotations"
  on annotations for insert
  with check ( auth.uid() = user_id );

-- Bookmarks: Users can only see their own bookmarks
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check ( auth.uid() = user_id );
