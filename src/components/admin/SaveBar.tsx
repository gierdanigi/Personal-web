"use client";

import { Check, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export type SaveStatus = { type: "idle" } | { type: "saved" } | { type: "error"; message: string };

/** 폼 하단에 붙는 저장 바 */
export function SaveBar({
  pending,
  status,
  dirty,
  children,
}: {
  pending: boolean;
  status: SaveStatus;
  dirty?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t border-line bg-background/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          {status.type === "error" && <span className="text-red-600">{status.message}</span>}
          {status.type === "saved" && !dirty && (
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <Check className="size-4" /> 저장했어요. 사이트에 바로 반영돼요.
            </span>
          )}
          {dirty && status.type !== "error" && <span className="text-muted">저장하지 않은 변경 사항이 있어요.</span>}
        </p>
        <div className="flex items-center gap-2">
          {children}
          <button type="submit" className="btn-primary min-w-24" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
