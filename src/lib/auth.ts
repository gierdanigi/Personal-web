import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";

export function isAdminEmail(email: string | null | undefined) {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(admin && email && email.toLowerCase() === admin);
}

/** 현재 로그인한 관리자. 관리자가 아니면 null */
export async function getAdmin() {
  // 항상 요청 시점에 세션을 확인 (빌드 때 정적으로 굳지 않도록)
  await connection();
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return { supabase, user };
}

/** 관리자 페이지 · Server Action 진입 시 호출. 관리자가 아니면 로그인 페이지로 */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login?error=forbidden");
  return admin;
}
