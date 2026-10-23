import "server-only";
import { notFound } from "next/navigation";
import { requireAdmin } from "./auth";
import { EMPTY_PROFILE, type CommissionMenu, type Profile, type Project, type Work } from "./types";

/** 관리자 페이지용 조회 (비공개 항목 포함, 캐시 안 함) */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function adminGetProfile(): Promise<Profile> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return { ...EMPTY_PROFILE, ...(data ?? {}) } as Profile;
}

export async function adminListProjects(): Promise<Project[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Project[];
}

export async function adminGetProject(id: string): Promise<Project> {
  if (!UUID.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) notFound();
  return data as Project;
}

export async function adminListWorks(): Promise<Work[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Work[];
}

export async function adminGetWork(id: string): Promise<Work> {
  if (!UUID.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("works").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) notFound();
  return data as Work;
}

export async function adminListMenu(): Promise<CommissionMenu[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("commission_menu")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as CommissionMenu[];
}
