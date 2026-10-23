"use client";

import { useState, useTransition, type ReactNode } from "react";
import { ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
import { deleteMenuItem, reorderMenu, saveMenuItem, type MenuInput } from "@/actions/commission";
import type { Category, CommissionMenu } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Field } from "./fields";
import { SortableList } from "./SortableList";

/** 작업물 분류 관리: 펼쳐서 이름 수정, 드래그 정렬 */
export function MenuManager({ initial }: { initial: CommissionMenu[] }) {
  const [menu, setMenu] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const run = (action: () => Promise<{ ok: boolean; error?: string }>, rollback: CommissionMenu[]) => {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error ?? "저장에 실패했어요.");
        setMenu(rollback);
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
      {(["video"] as Category[]).map((category) => {
        const items = menu.filter((m) => m.category === category);
        return (
          <section key={category} className="card p-5 sm:p-6">
            <h2 className="mb-4 text-base font-bold">
              분류 <span className="text-muted">{items.length}</span>
            </h2>
            <SortableList
              items={items}
              getId={(m) => m.id}
              className="space-y-2"
              onReorder={(next) => {
                const before = menu;
                setMenu([...menu.filter((m) => m.category !== category), ...next]);
                run(() => reorderMenu(next.map((m) => m.id)), before);
              }}
              renderItem={(item, handle) => (
                <MenuRow
                  item={item}
                  handle={handle}
                  onSaved={(saved) => setMenu((list) => list.map((m) => (m.id === saved.id ? saved : m)))}
                  onDelete={() => {
                    if (!confirm(`'${item.name}' 분류를 삭제할까요? 이 분류로 지정된 작업물은 분류가 비워져요.`)) return;
                    const before = menu;
                    setMenu(menu.filter((m) => m.id !== item.id));
                    run(() => deleteMenuItem(item.id), before);
                  }}
                />
              )}
            />
            <NewMenuItem category={category} onCreated={(created) => setMenu((list) => [...list, created])} />
          </section>
        );
      })}
    </div>
  );
}

function MenuFields({ value, onChange }: { value: MenuInput; onChange: (v: MenuInput) => void }) {
  const set = <K extends keyof MenuInput>(key: K, v: MenuInput[K]) => onChange({ ...value, [key]: v });
  return (
    <div className="grid gap-3">
      <Field label="분류 이름">
        <input className="input" value={value.name} required onChange={(e) => set("name", e.target.value)} />
      </Field>
    </div>
  );
}

function MenuRow({
  item,
  handle,
  onSaved,
  onDelete,
}: {
  item: CommissionMenu;
  handle: ReactNode;
  onSaved: (saved: CommissionMenu) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<MenuInput>(item);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-line bg-card">
      <div className="flex items-center gap-2 p-2.5">
        {handle}
        <button
          type="button"
          onClick={() => {
            setDraft(item);
            setOpen(!open);
          }}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{item.name}</span>
          </span>
          <ChevronDown className={cn("size-4 shrink-0 text-muted transition", open && "rotate-180")} />
        </button>
      </div>
      {open && (
        <form
          className="border-t border-line p-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            startTransition(async () => {
              const result = await saveMenuItem({ ...draft, id: item.id, is_open: true });
              if (result.ok && result.data) {
                onSaved(result.data);
                setOpen(false);
              } else if (!result.ok) setError(result.error);
            });
          }}
        >
          <MenuFields value={draft} onChange={setDraft} />
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-4 flex justify-between gap-2">
            <button type="button" className="btn-danger" onClick={onDelete}>
              <Trash2 className="size-4" /> 삭제
            </button>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
                취소
              </button>
              <button type="submit" className="btn-primary" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" />} 저장
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

function NewMenuItem({ category, onCreated }: { category: Category; onCreated: (item: CommissionMenu) => void }) {
  const empty: MenuInput = {
    category,
    name: "",
    description: "",
    is_open: true,
  };
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(empty);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button type="button" className="btn-outline mt-3" onClick={() => setOpen(true)}>
        <Plus className="size-4" /> 분류 추가
      </button>
    );
  }

  return (
    <form
      className="mt-3 rounded-xl border border-accent/30 bg-accent-soft/40 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await saveMenuItem(draft);
          if (result.ok && result.data) {
            onCreated(result.data);
            setDraft(empty);
            setOpen(false);
          } else if (!result.ok) setError(result.error);
        });
      }}
    >
      <MenuFields value={draft} onChange={setDraft} />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
          취소
        </button>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />} 추가
        </button>
      </div>
    </form>
  );
}
