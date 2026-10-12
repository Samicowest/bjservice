-- ============================================================
-- BJ SERVICES: SUPABASE AUTHENTICATION & RBAC SCHEMA
-- Roles: 'customer' | 'worker' | 'admin' | 'super_admin'
-- ============================================================

-- 1. Create Profiles Table Linked to auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text check (role in ('customer', 'worker', 'admin', 'super_admin')) default 'customer' not null,
  badge text,
  phone text,
  matric_no text,
  department text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Security Helper Functions (Security Definer to prevent RLS recursion)
create or replace function public.is_admin_or_super()
returns boolean as $$
  select exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  );
$$ language sql security definer set search_path = public;

create or replace function public.is_super_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'super_admin'
  );
$$ language sql security definer set search_path = public;

-- Security Policies for Profiles (with drop policy if exists for safe re-runs)

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" 
on public.profiles for select 
using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" 
on public.profiles for select 
using (public.is_admin_or_super());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" 
on public.profiles for update 
using (auth.uid() = id);

drop policy if exists "Super Admins can update roles" on public.profiles;
create policy "Super Admins can update roles" 
on public.profiles for update 
using (public.is_super_admin());

-- 4. Trigger Function: Automatically Create Profile on Signup (Google & Email/Password)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_full_name text;
  user_avatar text;
  user_role text := 'customer';
  user_badge text := 'Student Portal';
begin
  -- Extract name from Google OAuth metadata or fallback to email username
  user_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  -- Extract avatar from Google OAuth metadata
  user_avatar := coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture',
    ''
  );

  -- Auto-promote super admin account
  if lower(new.email) = 'bjservicesworkspace@gmail.com' then
    user_role := 'super_admin';
    user_badge := 'Executive Suite';
    if user_full_name is null or user_full_name = 'bjservicesworkspace' then
      user_full_name := 'Amos Ayinla';
    end if;
  end if;

  insert into public.profiles (id, email, full_name, avatar_url, role, badge)
  values (
    new.id,
    new.email,
    user_full_name,
    user_avatar,
    user_role,
    user_badge
  )
  on conflict (id) do update
  set 
    role = excluded.role,
    badge = excluded.badge,
    full_name = coalesce(public.profiles.full_name, excluded.full_name);

  return new;
end;
$$ language plpgsql security definer;

-- 5. Attach Trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 6. Helper: Ensure Super Admin Account is Activated (Amos Ayinla)
do $$
begin
  if not exists (select 1 from auth.users where lower(email) = 'bjservicesworkspace@gmail.com') then
    insert into auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) values (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'bjservicesworkspace@gmail.com',
      crypt('amosayinla', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Amos Ayinla"}',
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
  end if;
end $$;

update public.profiles 
set role = 'super_admin', badge = 'Executive Suite', full_name = 'Amos Ayinla' 
where lower(email) = 'bjservicesworkspace@gmail.com';
-- ============================================================
