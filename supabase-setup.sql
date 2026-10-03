-- Dhiraj B.Sc - Supabase setup
-- Run this once in Supabase -> SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('admin','student')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id integer primary key default 1 check (id = 1),
  live_enabled boolean not null default false,
  live_title text not null default 'Live Class',
  live_room text not null default 'DhirajBscLiveClass',
  recording_title text not null default 'Recorded Class',
  recording_url text not null default '',
  notes_url text not null default '',
  courses jsonb not null default '[{"id":"course-1","title":"B.Sc 1st Semester","description":"Anatomy • Physiology • Psychology","icon":"🫀","visible":true}]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Existing site_content tables get the new course-control column safely.
alter table public.site_content
  add column if not exists courses jsonb not null default '[{"id":"course-1","title":"B.Sc 1st Semester","description":"Anatomy • Physiology • Psychology","icon":"🫀","visible":true}]'::jsonb;

insert into public.site_content (id)
values (1)
on conflict (id) do nothing;

-- Keep the initial homepage simple: only B.Sc 1st Semester is visible.
update public.site_content
set courses = '[{"id":"course-1","title":"B.Sc 1st Semester","description":"Anatomy • Physiology • Psychology","icon":"🫀","visible":true}]'::jsonb
where id = 1 and (courses is null or jsonb_array_length(courses) = 0);

-- First account created becomes the admin. Later accounts are students.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when not exists (select 1 from public.profiles) then 'admin' else 'student' end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- If the first account was created before this setup was run,
-- promote the earliest existing profile to admin when no admin exists.
do $$
begin
  if exists (select 1 from public.profiles)
     and not exists (select 1 from public.profiles where role = 'admin') then
    update public.profiles
    set role = 'admin'
    where id = (
      select id from public.profiles
      order by created_at asc
      limit 1
    );
  end if;
end $$;

alter table public.profiles enable row level security;
alter table public.site_content enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "content_public_read" on public.site_content;
create policy "content_public_read"
on public.site_content for select
to anon, authenticated
using (true);

drop policy if exists "content_admin_insert" on public.site_content;
create policy "content_admin_insert"
on public.site_content for insert
to authenticated
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "content_admin_update" on public.site_content;
create policy "content_admin_update"
on public.site_content for update
to authenticated
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
)
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

grant select on public.site_content to anon, authenticated;
grant select, update, insert on public.site_content to authenticated;
grant select on public.profiles to authenticated;
