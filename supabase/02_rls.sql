-- =========================================================
-- 02_rls.sql : Row Level Security
-- 공개 읽기: projects / works 는 is_public = true 만
--            profile / commission_menu 는 전체
-- 쓰기: is_admin() 인 사용자만
-- =========================================================

-- 로그인한 사용자의 이메일이 admins 테이블에 있는지 확인
-- security definer : admins 테이블 자체는 RLS로 막혀 있어도 함수 안에서는 읽을 수 있음
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admins          enable row level security;
alter table public.profile         enable row level security;
alter table public.commission_menu enable row level security;
alter table public.projects        enable row level security;
alter table public.works           enable row level security;

-- ---------------------------------------------------------
-- admins : 정책 없음 → anon/authenticated 접근 불가 (SQL Editor로만 관리)
-- ---------------------------------------------------------

-- ---------------------------------------------------------
-- profile
-- ---------------------------------------------------------
drop policy if exists "profile_public_read" on public.profile;
create policy "profile_public_read" on public.profile
  for select using (true);

drop policy if exists "profile_admin_write" on public.profile;
create policy "profile_admin_write" on public.profile
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- commission_menu
-- ---------------------------------------------------------
drop policy if exists "menu_public_read" on public.commission_menu;
create policy "menu_public_read" on public.commission_menu
  for select using (true);

drop policy if exists "menu_admin_write" on public.commission_menu;
create policy "menu_admin_write" on public.commission_menu
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- projects
-- ---------------------------------------------------------
drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read" on public.projects
  for select using (is_public = true or public.is_admin());

drop policy if exists "projects_admin_write" on public.projects;
create policy "projects_admin_write" on public.projects
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- works
-- ---------------------------------------------------------
drop policy if exists "works_public_read" on public.works;
create policy "works_public_read" on public.works
  for select using (is_public = true or public.is_admin());

drop policy if exists "works_admin_write" on public.works;
create policy "works_admin_write" on public.works
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
