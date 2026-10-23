"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function LoginForm() {
  const router = useRouter();
  const forbidden = useSearchParams().get("error") === "forbidden";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // 관리자가 아닌 계정으로 로그인된 상태면 세션을 정리
  useEffect(() => {
    if (forbidden && isSupabaseConfigured) createClient().auth.signOut();
  }, [forbidden]);

  if (!isSupabaseConfigured) {
    return (
      <p className="mt-6 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
        Supabase 환경변수가 설정되지 않았어요. README의 환경변수 항목을 확인해 주세요.
      </p>
    );
  }

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        const { error } = await createClient().auth.signInWithPassword({ email, password });
        if (error) {
          setError("이메일 또는 비밀번호가 올바르지 않아요.");
          setPending(false);
          return;
        }
        router.replace("/admin");
        router.refresh();
      }}
    >
      {forbidden && !error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">관리자 계정이 아니에요. 다시 로그인해 주세요.</p>
      )}
      <label className="block">
        <span className="label">이메일</span>
        <input
          className="input"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="label">비밀번호</span>
        <input
          className="input"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        로그인
      </button>
    </form>
  );
}
