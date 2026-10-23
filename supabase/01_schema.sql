-- =========================================================
-- 01_schema.sql : 테이블 · 인덱스 · updated_at 트리거
-- Supabase SQL Editor에서 01 → 02 → 03 → 04 순서로 실행하세요.
-- =========================================================

create extension if not exists "pgcrypto";

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------
-- admins : 쓰기 권한을 가진 이메일 (RLS의 is_admin()에서 사용)
-- ---------------------------------------------------------
create table if not exists public.admins (
  email text primary key
);

-- ---------------------------------------------------------
-- profile : 단일 행 (id = 1 고정)
-- ---------------------------------------------------------
create table if not exists public.profile (
  id             int primary key default 1 check (id = 1),
  name           text not null default '',
  nickname       text not null default '',
  headline       text not null default '',
  bio            text not null default '',
  avatar_url     text,
  school         text not null default '',
  major          text not null default '',
  status         text not null default '',
  -- [{ "key": "github", "label": "GitHub", "value": "https://github.com/..." }]
  links          jsonb not null default '[]'::jsonb,
  -- [{ "group": "Backend", "items": ["Spring", "PostgreSQL"] }]
  skills         jsonb not null default '[]'::jsonb,
  -- [{ "name": "정보처리기사", "date": "2025-06-13" }]
  certifications jsonb not null default '[]'::jsonb,
  -- [{ "name": "동아리", "period": "2024.03 ~ 현재", "description": "..." }]
  activities     jsonb not null default '[]'::jsonb,
  updated_at     timestamptz not null default now()
);

drop trigger if exists profile_updated_at on public.profile;
create trigger profile_updated_at before update on public.profile
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- commission_menu
-- ---------------------------------------------------------
create table if not exists public.commission_menu (
  id            uuid primary key default gen_random_uuid(),
  category      text not null check (category in ('video', 'dev')),
  name          text not null,
  description   text not null default '',
  price_text    text not null default '',
  duration_text text not null default '',
  revision_text text not null default '',
  sort_order    int  not null default 0,
  is_open       boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists commission_menu_sort_idx
  on public.commission_menu (category, sort_order);

drop trigger if exists commission_menu_updated_at on public.commission_menu;
create trigger commission_menu_updated_at before update on public.commission_menu
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- projects : 개발 프로젝트
-- ---------------------------------------------------------
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary      text not null default '',
  period_start date,
  period_end   date,
  is_ongoing   boolean not null default false,
  team_info    text not null default '',
  role         text not null default '',
  tech_stack   text[] not null default '{}',
  description  text not null default '',
  -- [{ "path": "projects/xxx.webp", "url": "https://...", "caption": "" }]
  images       jsonb not null default '[]'::jsonb,
  github_url   text,
  demo_url     text,
  -- [{ "label": "발표 자료", "url": "https://..." }]
  etc_links    jsonb not null default '[]'::jsonb,
  is_featured  boolean not null default false,
  is_public    boolean not null default false,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists projects_sort_idx on public.projects (sort_order);
create index if not exists projects_tech_stack_idx on public.projects using gin (tech_stack);

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- works : 영상 · 커미션 샘플 작업물
-- ---------------------------------------------------------
create table if not exists public.works (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category      text not null check (category in ('video', 'dev')),
  -- 커미션 메뉴 항목 (subcategory). 메뉴가 삭제되면 null
  menu_id       uuid references public.commission_menu (id) on delete set null,
  thumbnail_url text,
  thumbnail_path text,
  video_url     text,
  demo_url      text,
  description   text not null default '',
  tools         text[] not null default '{}',
  work_date     date,
  is_featured   boolean not null default false,
  is_public     boolean not null default false,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists works_sort_idx on public.works (sort_order);
create index if not exists works_category_idx on public.works (category);
create index if not exists works_menu_idx on public.works (menu_id);

drop trigger if exists works_updated_at on public.works;
create trigger works_updated_at before update on public.works
  for each row execute function public.set_updated_at();
