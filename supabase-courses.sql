-- Run this once in Supabase SQL Editor for permanent course sync across all devices.
-- Safe to run if the column already exists.

alter table public.site_content
add column if not exists courses jsonb not null default '[{"id":"course-1","title":"B.Sc 1st Semester","description":"Anatomy • Physiology • Psychology","icon":"🫀","visible":true}]'::jsonb;

update public.site_content
set courses = '[{"id":"course-1","title":"B.Sc 1st Semester","description":"Anatomy • Physiology • Psychology","icon":"🫀","visible":true}]'::jsonb
where id = 1 and (courses is null or jsonb_array_length(courses) = 0);
