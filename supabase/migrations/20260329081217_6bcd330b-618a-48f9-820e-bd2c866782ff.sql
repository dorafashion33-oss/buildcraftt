
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  prompt text not null,
  generated_code text not null default '',
  created_at timestamptz default now() not null
);

alter table public.projects enable row level security;

create policy "Users can view own projects" on public.projects for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects for update to authenticated using (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects for delete to authenticated using (auth.uid() = user_id);
