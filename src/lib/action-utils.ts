import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { STORAGE_BUCKET } from "./supabase/env";
import type { ActionResult } from "./types";

export function fail(error: unknown): ActionResult<never> {
  if (error && typeof error === "object" && "code" in error && error.code === "23505") {
    return { ok: false, error: "이미 사용 중인 slug예요. 다른 slug를 입력해 주세요." };
  }
  const message =
    error instanceof Error
      ? error.message
      : error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "알 수 없는 오류가 발생했어요.";
  return { ok: false, error: message };
}

export const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
export const nullable = (v: unknown) => str(v) || null;
export const strArray = (v: unknown) =>
  Array.isArray(v) ? [...new Set(v.map(str).filter(Boolean))] : [];

/** 객체 배열에서 지정한 필드만 남기고, 모든 값이 빈 항목은 제거 */
export function cleanList<K extends string>(v: unknown, keys: readonly K[]): Record<K, string>[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) =>
      Object.fromEntries(keys.map((k) => [k, str((item as Record<string, unknown>)?.[k])])) as Record<K, string>,
    )
    .filter((item) => keys.some((k) => item[k]));
}

export async function removeStorageFiles(supabase: SupabaseClient, paths: (string | null | undefined)[]) {
  const targets = paths.filter((p): p is string => Boolean(p));
  if (targets.length === 0) return;
  // 이미지 삭제에 실패해도 저장 자체는 성공으로 처리 (고아 파일만 남음)
  await supabase.storage.from(STORAGE_BUCKET).remove(targets);
}

/** 순서 변경: 배열 순서대로 sort_order = 0, 10, 20 ... */
export async function applySortOrder(supabase: SupabaseClient, table: string, ids: string[]) {
  const results = await Promise.all(
    ids.map((id, index) => supabase.from(table).update({ sort_order: index * 10 }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}
