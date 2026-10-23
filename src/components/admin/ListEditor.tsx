"use client";

import { useState, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SortableList } from "./SortableList";

/**
 * 객체 배열 편집기 (링크, 자격증, 활동 등).
 * renderFields로 항목별 입력칸을 그리고, 추가/삭제/순서 변경을 처리함.
 */
export function ListEditor<T>({
  items,
  onChange,
  createItem,
  renderFields,
  addLabel = "항목 추가",
  emptyText = "아직 항목이 없어요.",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderFields: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  addLabel?: string;
  emptyText?: string;
}) {
  // 순서 변경 시에도 입력 포커스가 유지되도록 항목마다 고정 key 부여
  const [keys] = useState(() => new WeakMap<object, string>());
  const keyOf = (item: T) => {
    const obj = item as object;
    let key = keys.get(obj);
    if (!key) {
      key = crypto.randomUUID();
      keys.set(obj, key);
    }
    return key;
  };

  const update = (index: number, patch: Partial<T>) => {
    const prev = items[index];
    const next = { ...prev, ...patch };
    keys.set(next as object, keyOf(prev));
    onChange(items.map((it, i) => (i === index ? next : it)));
  };

  return (
    <div className="space-y-2">
      {items.length === 0 && <p className="text-sm text-muted">{emptyText}</p>}
      <SortableList
        items={items}
        getId={keyOf}
        onReorder={onChange}
        className="space-y-2"
        renderItem={(item, handle, index) => (
          <div className="flex items-start gap-1.5 rounded-xl border border-line bg-background/50 p-2.5">
            <div className="pt-1">{handle}</div>
            <div className="min-w-0 flex-1">{renderFields(item, (patch) => update(index, patch), index)}</div>
            <button
              type="button"
              aria-label="삭제"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="mt-0.5 rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )}
      />
      <button type="button" className="btn-outline" onClick={() => onChange([...items, createItem()])}>
        <Plus className="size-4" /> {addLabel}
      </button>
    </div>
  );
}
