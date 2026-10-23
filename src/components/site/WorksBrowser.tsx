"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORY_LABEL, type Category, type WorkWithMenu } from "@/lib/types";
import { EmptyState, WorkCard } from "./Cards";
import { FilterChips } from "./FilterChips";

export function WorkGrid({ works }: { works: WorkWithMenu[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {works.map((w) => (
        <WorkCard key={w.id} work={w} />
      ))}
    </div>
  );
}

/** 카테고리(?category=video) · 커미션 메뉴(?menu=id) 필터 */
export function WorksBrowser({ works }: { works: WorkWithMenu[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category");
  const category: Category | "" = rawCategory === "video" || rawCategory === "dev" ? rawCategory : "";
  const menuId = searchParams.get("menu") ?? "";

  const update = (next: { category?: string; menu?: string }) => {
    const params = new URLSearchParams();
    const c = next.category ?? category;
    const m = next.menu ?? "";
    if (c) params.set("category", c);
    if (m) params.set("menu", m);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const inCategory = category ? works.filter((w) => w.category === category) : works;
  const filtered = menuId ? inCategory.filter((w) => w.menu_id === menuId) : inCategory;

  // 현재 카테고리에 있는 커미션 메뉴만 세부 필터로
  const menus = new Map<string, { name: string; count: number }>();
  inCategory.forEach((w) => {
    if (!w.menu) return;
    const prev = menus.get(w.menu.id);
    menus.set(w.menu.id, { name: w.menu.name, count: (prev?.count ?? 0) + 1 });
  });

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <FilterChips
          value={category}
          onChange={(c) => update({ category: c, menu: "" })}
          options={[
            { value: "" as const, label: "전체", count: works.length },
            ...(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => ({
              value: c,
              label: CATEGORY_LABEL[c],
              count: works.filter((w) => w.category === c).length,
            })),
          ]}
        />
        {category && menus.size > 0 && (
          <FilterChips
            size="sm"
            value={menuId}
            onChange={(m) => update({ menu: m })}
            options={[
              { value: "", label: "전체" },
              ...[...menus.entries()].map(([id, m]) => ({ value: id, label: m.name, count: m.count })),
            ]}
          />
        )}
      </div>
      {filtered.length ? <WorkGrid works={filtered} /> : <EmptyState>해당하는 작업물이 아직 없어요.</EmptyState>}
    </div>
  );
}
