import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/**
 * 쿠키를 쓰지 않는 익명 클라이언트.
 * 'use cache' 안에서 공개 데이터를 읽을 때 사용 (RLS로 is_public만 보임).
 */
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
