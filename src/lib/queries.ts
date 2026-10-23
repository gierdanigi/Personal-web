import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/public";
import {
  EMPTY_PROFILE,
  type CommissionMenu,
  type Profile,
  type Project,
  type WorkWithMenu,
} from "./types";

/**
 * 공개 페이지용 데이터. 전부 캐시되고, 관리자가 저장하면 Server Action의 updateTag로 즉시 갱신됨.
 * 태그: profile / projects / works / menu
 */

const WORK_SELECT = "*, menu:commission_menu(id, name)";

export async function getProfile(): Promise<Profile> {
  "use cache";
  cacheLife("days");
  cacheTag("profile");

  const supabase = createPublicClient();
  if (!supabase) return EMPTY_PROFILE;
  const { data, error } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(`profile 조회 실패: ${error.message}`);
  return { ...EMPTY_PROFILE, ...(data ?? {}) } as Profile;
}

export async function getPublicProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("days");
  cacheTag("projects");

  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_public", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(`projects 조회 실패: ${error.message}`);
  return (data ?? []) as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  "use cache";
  cacheLife("days");
  cacheTag("projects");

  const projects = await getPublicProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getPublicWorks(): Promise<WorkWithMenu[]> {
  "use cache";
  cacheLife("days");
  cacheTag("works", "menu");

  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("works")
    .select(WORK_SELECT)
    .eq("is_public", true)
    .eq("category", "video")
    .order("sort_order", { ascending: true })
    .order("work_date", { ascending: false, nullsFirst: false });
  if (error) throw new Error(`works 조회 실패: ${error.message}`);
  return (data ?? []) as WorkWithMenu[];
}

export async function getWorkBySlug(slug: string): Promise<WorkWithMenu | null> {
  "use cache";
  cacheLife("days");
  cacheTag("works", "menu");

  const works = await getPublicWorks();
  return works.find((w) => w.slug === slug) ?? null;
}

export async function getCommissionMenu(): Promise<CommissionMenu[]> {
  "use cache";
  cacheLife("days");
  cacheTag("menu");

  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("commission_menu")
    .select("*")
    .order("category", { ascending: false }) // video → dev
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`commission_menu 조회 실패: ${error.message}`);
  return (data ?? []) as CommissionMenu[];
}
