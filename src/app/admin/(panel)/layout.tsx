import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "./AdminNav";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

// 관리자 화면은 매 요청 세션을 확인하므로 정적 셸 대신 서버 렌더링을 기다림
export const instant = false;

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { user } = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav email={user.email ?? ""} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
