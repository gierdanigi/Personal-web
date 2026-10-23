"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { applySortOrder, fail, nullable, removeStorageFiles, str, strArray } from "@/lib/action-utils";
import { SLUG_PATTERN } from "@/lib/utils";
import type { ActionResult, Work } from "@/lib/types";

export type WorkInput = Omit<Work, "id" | "sort_order" | "created_at" | "updated_at"> & {
  id?: string;
};

export async function saveWork(input: WorkInput): Promise<ActionResult<{ id: string }>> {
  const { supabase } = await requireAdmin();

  const title = str(input.title);
  const slug = str(input.slug).toLowerCase();
  if (!title) return { ok: false, error: "제목을 입력해 주세요." };
  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false, error: "slug는 영문 소문자, 숫자, 하이픈(-)만 쓸 수 있어요." };
  }
  const row = {
    title,
    slug,
    // 작업물은 영상 전용 (개발 결과물은 프로젝트로 등록)
    category: "video" as const,
    menu_id: nullable(input.menu_id),
    thumbnail_url: nullable(input.thumbnail_url),
    thumbnail_path: nullable(input.thumbnail_path),
    video_url: nullable(input.video_url),
    demo_url: nullable(input.demo_url),
    description: typeof input.description === "string" ? input.description : "",
    tools: strArray(input.tools),
    work_date: nullable(input.work_date),
    is_featured: Boolean(input.is_featured),
    is_public: Boolean(input.is_public),
  };

  let id = input.id;
  if (id) {
    const { data: before } = await supabase.from("works").select("thumbnail_path").eq("id", id).single();
    const { error } = await supabase.from("works").update(row).eq("id", id);
    if (error) return fail(error);
    if (before?.thumbnail_path && before.thumbnail_path !== row.thumbnail_path) {
      await removeStorageFiles(supabase, [before.thumbnail_path]);
    }
  } else {
    const { data: first } = await supabase
      .from("works")
      .select("sort_order")
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();
    const { data, error } = await supabase
      .from("works")
      .insert({ ...row, sort_order: (first?.sort_order ?? 10) - 10 })
      .select("id")
      .single();
    if (error) return fail(error);
    id = data.id as string;
  }

  updateTag("works");
  return { ok: true, data: { id } };
}

export async function deleteWork(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("works").select("thumbnail_path").eq("id", id).single();
  const { error } = await supabase.from("works").delete().eq("id", id);
  if (error) return fail(error);

  await removeStorageFiles(supabase, [data?.thumbnail_path]);
  updateTag("works");
  return { ok: true };
}

export async function setWorkFlag(
  id: string,
  field: "is_public" | "is_featured",
  value: boolean,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("works").update({ [field]: value }).eq("id", id);
  if (error) return fail(error);
  updateTag("works");
  return { ok: true };
}

export async function reorderWorks(ids: string[]): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  try {
    await applySortOrder(supabase, "works", ids);
  } catch (e) {
    return fail(e);
  }
  updateTag("works");
  return { ok: true };
}
