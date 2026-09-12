create table if not exists public.payments (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 user_email text not null, course_id text not null, course_title text not null, price numeric(10,2) not null,
 receipt_path text not null, status text not null default 'pending' check (status in ('pending','approved','rejected')),
 created_at timestamptz not null default now(), reviewed_at timestamptz, reviewed_by text
);
create table if not exists public.lessons (
 id uuid primary key default gen_random_uuid(), course_id text not null, title text not null,
 video_url text not null, duration text, sort_order integer not null default 0, is_published boolean not null default true,
 created_at timestamptz not null default now()
);
alter table public.payments enable row level security;
alter table public.lessons enable row level security;
create policy "students read own payments" on public.payments for select using (auth.uid() = user_id);
create policy "students create own payments" on public.payments for insert with check (auth.uid() = user_id);
create policy "published lessons visible" on public.lessons for select using (is_published = true);
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('receipts','receipts',false,8388608,array['image/jpeg','image/png','image/webp']) on conflict (id) do nothing;
create policy "students upload own receipts" on storage.objects for insert to authenticated with check (bucket_id='receipts' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "students read own receipts" on storage.objects for select to authenticated using (bucket_id='receipts' and (storage.foldername(name))[1]=auth.uid()::text);
