"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { cleanList, fail, nullable, removeStorageFiles, str, strArray } from "@/lib/action-utils";
import type { ActionResult, Profile } from "@/lib/types";

export type ProfileInput = Omit<Profile, "id" | "updated_at"> & {
  /** 아바타를 바꾸거나 지웠을 때 삭제할 이전 파일 경로 */
  removed_avatar_path?: string | null;
};

export async function saveProfile(input: ProfileInput): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const row = {
    id: 1,
    name: str(input.name),
    nickname: str(input.nickname),
    headline: str(input.headline),
    bio: typeof input.bio === "string" ? input.bio : "",
    avatar_url: nullable(input.avatar_url),
    school: str(input.school),
    major: str(input.major),
    status: str(input.status),
    links: cleanList(input.links, ["key", "label", "value"]).filter((l) => l.value),
    skills: (Array.isArray(input.skills) ? input.skills : [])
      .map((g) => ({ group: str(g?.group), items: strArray(g?.items) }))
      .filter((g) => g.group || g.items.length),
    certifications: cleanList(input.certifications, ["name", "date"]),
    activities: cleanList(input.activities, ["name", "period", "description"]),
  };

  const { error } = await supabase.from("profile").upsert(row);
  if (error) return fail(error);

  await removeStorageFiles(supabase, [input.removed_avatar_path]);
  updateTag("profile");
  return { ok: true };
}
