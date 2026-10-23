"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { applySortOrder, cleanList, fail, nullable, removeStorageFiles, str, strArray } from "@/lib/action-utils";
import { SLUG_PATTERN } from "@/lib/utils";
import type { ActionResult, Project } from "@/lib/types";

export type ProjectInput = Omit<Project, "id" | "sort_order" | "created_at" | "updated_at"> & {
  id?: string;
};

export async function saveProject(input: ProjectInput): Promise<ActionResult<{ id: string }>> {
  const { supabase } = await requireAdmin();

  const title = str(input.title);
  const slug = str(input.slug).toLowerCase();
  if (!title) return { ok: false, error: "제목을 입력해 주세요." };
  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false, error: "slug는 영문 소문자, 숫자, 하이픈(-)만 쓸 수 있어요." };
  }

  const images = cleanList(input.images, ["path", "url", "caption"]).filter((i) => i.url);
  const row = {
    title,
    slug,
    summary: str(input.summary),
    period_start: nullable(input.period_start),
    period_end: input.is_ongoing ? null : nullable(input.period_end),
    is_ongoing: Boolean(input.is_ongoing),
    team_info: str(input.team_info),
    role: str(input.role),
    tech_stack: strArray(input.tech_stack),
    description: typeof input.description === "string" ? input.description : "",
    images,
    github_url: nullable(input.github_url),
    demo_url: nullable(input.demo_url),
    etc_links: cleanList(input.etc_links, ["label", "url"]).filter((l) => l.url),
    is_featured: Boolean(input.is_featured),
    is_public: Boolean(input.is_public),
  };

  let id = input.id;
  if (id) {
    const { data: before } = await supabase.from("projects").select("images").eq("id", id).single();
    const { error } = await supabase.from("projects").update(row).eq("id", id);
    if (error) return fail(error);

    const kept = new Set(images.map((i) => i.path));
    const removed = ((before?.images ?? []) as { path: string }[]).map((i) => i.path).filter((p) => !kept.has(p));
    await removeStorageFiles(supabase, removed);
  } else {
    // 새 항목은 맨 위에 오도록
    const { data: first } = await supabase
      .from("projects")
      .select("sort_order")
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();
    const { data, error } = await supabase
      .from("projects")
      .insert({ ...row, sort_order: (first?.sort_order ?? 10) - 10 })
      .select("id")
      .single();
    if (error) return fail(error);
    id = data.id as string;
  }

  updateTag("projects");
  return { ok: true, data: { id } };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("projects").select("images").eq("id", id).single();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return fail(error);

  await removeStorageFiles(supabase, ((data?.images ?? []) as { path: string }[]).map((i) => i.path));
  updateTag("projects");
  return { ok: true };
}

export async function setProjectFlag(
  id: string,
  field: "is_public" | "is_featured",
  value: boolean,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("projects").update({ [field]: value }).eq("id", id);
  if (error) return fail(error);
  updateTag("projects");
  return { ok: true };
}

export async function reorderProjects(ids: string[]): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  try {
    await applySortOrder(supabase, "projects", ids);
  } catch (e) {
    return fail(e);
  }
  updateTag("projects");
  return { ok: true };
}
