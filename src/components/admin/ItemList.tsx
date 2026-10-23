"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Star } from "lucide-react";
import type { ActionResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Toggle } from "./fields";
import { SortableList } from "./SortableList";
import { DeleteButton } from "./DeleteButton";

export type ListItem = {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string | null;
  is_public: boolean;
  is_featured: boolean;
};

/** 프로젝트 · 작업물 관리 목록: 드래그 정렬, 공개 · 대표 토글, 수정 · 삭제 */
export function ItemList({
  items: initialItems,
  kind,
  onReorder,
  onFlag,
}: {
  items: ListItem[];
  kind: "project" | "work";
  onReorder: (ids: string[]) => Promise<ActionResult>;
  onFlag: (id: string, field: "is_public" | "is_featured", value: boolean) => Promise<ActionResult>;
}) {
  const [items, setItems] = useState(initialItems);
  // 삭제 등으로 서버 데이터가 새로 오면 목록을 교체
  const [prevInitial, setPrevInitial] = useState(initialItems);
  if (initialItems !== prevInitial) {
    setPrevInitial(initialItems);
    setItems(initialItems);
  }
  const [optimistic, applyOptimistic] = useOptimistic(items);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const base = kind === "project" ? "/admin/projects" : "/admin/works";

  const run = (next: ListItem[], action: () => Promise<ActionResult>) => {
    setError(null);
    startTransition(async () => {
      applyOptimistic(next);
      const result = await action();
      if (result.ok) setItems(next);
      else setError(result.error);
    });
  };

  if (initialItems.length === 0) {
    return (
      <div className="card p-10 text-center text-sm text-muted">
        아직 등록된 항목이 없어요. 오른쪽 위 <b>새로 만들기</b>로 추가해 보세요.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
      <SortableList
        items={optimistic}
        getId={(i) => i.id}
        onReorder={(next) => run(next, () => onReorder(next.map((i) => i.id)))}
        className="space-y-2"
        renderItem={(item, handle) => (
          <div className={cn("card flex items-center gap-3 p-3", !item.is_public && "bg-soft/40")}>
            {handle}
            <div className="relative aspect-video w-20 shrink-0 overflow-hidden rounded-lg bg-soft sm:w-28">
              {item.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.thumbnail} alt="" className="absolute inset-0 size-full object-cover" />
              )}
            </div>
            <Link href={`${base}/${item.id}`} className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate font-semibold">
                {item.is_featured && <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />}
                {item.title}
              </p>
              <p className="truncate text-sm text-muted">{item.subtitle}</p>
            </Link>
            <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
              <Toggle
                checked={item.is_public}
                label="공개"
                onChange={(value) =>
                  run(
                    optimistic.map((i) => (i.id === item.id ? { ...i, is_public: value } : i)),
                    () => onFlag(item.id, "is_public", value),
                  )
                }
              />
              <button
                type="button"
                title="메인 노출"
                aria-label="메인 노출 전환"
                aria-pressed={item.is_featured}
                onClick={() =>
                  run(
                    optimistic.map((i) => (i.id === item.id ? { ...i, is_featured: !item.is_featured } : i)),
                    () => onFlag(item.id, "is_featured", !item.is_featured),
                  )
                }
                className="hidden rounded-lg p-2 hover:bg-soft sm:inline-flex"
              >
                <Star className={cn("size-4", item.is_featured ? "fill-amber-400 text-amber-400" : "text-muted")} />
              </button>
            </div>
            <div className="hidden shrink-0 items-center sm:flex">
              <Link href={`${base}/${item.id}`} className="rounded-lg p-2 text-muted hover:bg-soft" aria-label="수정">
                <Pencil className="size-4" />
              </Link>
              <DeleteButton kind={kind} id={item.id} title={item.title} compact />
            </div>
          </div>
        )}
      />
    </div>
  );
}
