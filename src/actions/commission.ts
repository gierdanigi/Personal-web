"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { applySortOrder, fail, str } from "@/lib/action-utils";
import type { ActionResult, CommissionMenu } from "@/lib/types";

export type MenuInput = Omit<CommissionMenu, "id" | "sort_order"> & { id?: string };

export async function saveMenuItem(input: MenuInput): Promise<ActionResult<CommissionMenu>> {
  const { supabase } = await requireAdmin();

  const name = str(input.name);
  if (!name) return { ok: false, error: "메뉴 이름을 입력해 주세요." };
  if (input.category !== "video" && input.category !== "dev") {
    return { ok: false, error: "카테고리를 선택해 주세요." };
  }

  const row = {
    category: input.category,
    name,
    description: str(input.description),
    is_open: Boolean(input.is_open),
  };

  const query = input.id
    ? supabase.from("commission_menu").update(row).eq("id", input.id)
    : supabase.from("commission_menu").insert({ ...row, sort_order: 10000 });
  const { data, error } = await query.select("*").single();
  if (error) return fail(error);

  updateTag("menu");
  return { ok: true, data: data as CommissionMenu };
}

export async function deleteMenuItem(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("commission_menu").delete().eq("id", id);
  if (error) return fail(error);
  updateTag("menu");
  return { ok: true };
}

export async function setMenuOpen(id: string, isOpen: boolean): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("commission_menu").update({ is_open: isOpen }).eq("id", id);
  if (error) return fail(error);
  updateTag("menu");
  return { ok: true };
}

export async function reorderMenu(ids: string[]): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  try {
    await applySortOrder(supabase, "commission_menu", ids);
  } catch (e) {
    return fail(e);
  }
  updateTag("menu");
  return { ok: true };
}
