"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, FolderGit2, Film, LayoutDashboard, ListChecks, LogOut, UserRound } from "lucide-react";
import { signOut } from "@/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/profile", label: "프로필", icon: UserRound },
  { href: "/admin/projects", label: "프로젝트", icon: FolderGit2 },
  { href: "/admin/works", label: "작업물", icon: Film },
  { href: "/admin/commission", label: "커미션 메뉴", icon: ListChecks },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <aside className="sticky top-0 z-30 border-b border-line bg-card md:h-screen md:w-56 md:shrink-0 md:border-r md:border-b-0">
      <div className="flex items-center justify-between px-4 py-3 md:block md:px-5 md:py-6">
        <Link href="/admin" className="font-bold">
          관리자
        </Link>
        <p className="hidden truncate text-xs text-muted md:mt-1 md:block">{email}</p>
        <div className="flex items-center gap-1 md:hidden">
          <Link href="/" target="_blank" className="btn-ghost px-2" aria-label="사이트 보기">
            <ExternalLink className="size-4" />
          </Link>
          <form action={signOut}>
            <button className="btn-ghost px-2" aria-label="로그아웃">
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-2 md:flex-col md:px-3 md:pb-0">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
              isActive(href) ? "bg-accent-soft text-accent" : "text-foreground/70 hover:bg-soft",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="hidden space-y-1 px-3 pt-6 md:block">
        <Link href="/" target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:bg-soft">
          <ExternalLink className="size-4" /> 사이트 보기
        </Link>
        <form action={signOut}>
          <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:bg-soft">
            <LogOut className="size-4" /> 로그아웃
          </button>
        </form>
      </div>
    </aside>
  );
}
