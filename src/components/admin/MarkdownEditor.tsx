"use client";

import { useState } from "react";
import { Markdown } from "@/components/Markdown";
import { cn } from "@/lib/utils";

/** 마크다운 편집기. 넓은 화면은 편집·미리보기를 나란히, 좁은 화면은 탭으로 전환 */
export function MarkdownEditor({
  value,
  onChange,
  rows = 18,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="flex items-center gap-1 border-b border-line bg-soft/60 px-2 py-1.5 lg:hidden">
        {(["edit", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-3 py-1 text-sm font-medium",
              tab === t ? "bg-card shadow-sm" : "text-muted",
            )}
          >
            {t === "edit" ? "편집" : "미리보기"}
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={cn(
            "w-full resize-y bg-card p-4 font-mono text-sm leading-relaxed outline-none lg:border-r lg:border-line",
            tab === "preview" && "hidden lg:block",
          )}
        />
        <div
          className={cn(
            "max-h-[70vh] min-h-48 overflow-y-auto bg-background/60 p-4",
            tab === "edit" && "hidden lg:block",
          )}
        >
          <p className="mb-3 hidden text-xs font-semibold tracking-wide text-muted lg:block">미리보기</p>
          {value.trim() ? (
            <Markdown className="prose-sm">{value}</Markdown>
          ) : (
            <p className="text-sm text-muted">내용을 입력하면 여기에 미리보기가 보여요.</p>
          )}
        </div>
      </div>
    </div>
  );
}
