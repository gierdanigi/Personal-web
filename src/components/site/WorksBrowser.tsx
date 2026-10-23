"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { WorkWithMenu } from "@/lib/types";
import { EmptyState, WorkCard } from "./Cards";
import { FilterChips } from "./FilterChips";
import { Reveal } from "./Reveal";

export function WorkGrid({ works }: { works: WorkWithMenu[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {works.map((w, i) => (
        <Reveal key={w.id} delay={(i % 3) * 90} className="h-full">
          <WorkCard work={w} />
        </Reveal>
      ))}
    </div>
  );
}

/** 분류 필터 (?menu=id) */
export function WorksBrowser({ works }: { works: WorkWithMenu[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const menuId = searchParams.get("menu") ?? "";

  const select = (next: string) => {
    router.replace(next ? `${pathname}?menu=${next}` : pathname, { scroll: false });
  };

  const menus = new Map<string, { name: string; count: number }>();
  works.forEach((w) => {
    if (!w.menu) return;
    const prev = menus.get(w.menu.id);
    menus.set(w.menu.id, { name: w.menu.name, count: (prev?.count ?? 0) + 1 });
  });
  const filtered = menuId ? works.filter((w) => w.menu_id === menuId) : works;

  return (
    <div className="space-y-6">
      {menus.size > 0 && (
        <FilterChips
          value={menuId}
          onChange={select}
          options={[
            { value: "", label: "전체", count: works.length },
            ...[...menus.entries()].map(([id, m]) => ({ value: id, label: m.name, count: m.count })),
          ]}
        />
      )}
      {filtered.length ? <WorkGrid works={filtered} /> : <EmptyState>아직 공개된 작업물이 없어요.</EmptyState>}
    </div>
  );
}
