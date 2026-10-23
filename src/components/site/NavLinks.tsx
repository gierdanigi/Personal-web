"use client";

import { Suspense, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

/*
 * usePathname()은 동적 경로에서 요청 시점에만 값이 정해지므로 Suspense로 감싸고,
 * 정적 셸에는 활성 표시 없는 메뉴를 먼저 보여줌.
 */

function DesktopNav({ pathname, className }: { pathname: string | null; className?: string }) {
  return (
    <nav className={cn("items-center gap-1", className)}>
      {NAV_ITEMS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition",
            pathname?.startsWith(href) ? "bg-card text-foreground shadow-sm" : "text-foreground/60 hover:text-foreground",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

function ActiveDesktopNav({ className }: { className?: string }) {
  return <DesktopNav pathname={usePathname()} className={className} />;
}

export function NavLinks({ className }: { className?: string }) {
  return (
    <Suspense fallback={<DesktopNav pathname={null} className={className} />}>
      <ActiveDesktopNav className={className} />
    </Suspense>
  );
}

function MenuButton({ open, onClick }: { open: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      className="btn-ghost -mr-2 px-2"
      aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
      aria-expanded={open}
      onClick={onClick}
    >
      {open ? <X className="size-5" /> : <Menu className="size-5" />}
    </button>
  );
}

function MobileMenuInner({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  // 페이지가 바뀌면 메뉴 닫기
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <>
      <MenuButton open={open} onClick={() => setOpen(!open)} />
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-line bg-background px-4 pt-2 pb-5 shadow-lg">
          <nav className="flex flex-col">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-xl px-3 py-3 text-base font-medium",
                  pathname.startsWith(href) ? "bg-card text-accent" : "text-foreground/80",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      )}
    </>
  );
}

export function MobileMenu({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={className}>
      <Suspense fallback={<MenuButton open={false} />}>
        <MobileMenuInner>{children}</MobileMenuInner>
      </Suspense>
    </div>
  );
}
