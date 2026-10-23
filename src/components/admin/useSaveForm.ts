"use client";

import { useEffect, useState, useTransition } from "react";
import type { ActionResult } from "@/lib/types";
import type { SaveStatus } from "./SaveBar";

/** 폼 상태 + 저장 상태 + 변경 감지 + 페이지 이탈 경고 */
export function useSaveForm<T>(initial: T) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [status, setStatus] = useState<SaveStatus>({ type: "idle" });
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(value) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof T>(key: K, v: T[K]) => setValue((prev) => ({ ...prev, [key]: v }));

  function submit<R>(action: (value: T) => Promise<ActionResult<R>>, onSuccess?: (result: ActionResult<R>) => void) {
    startTransition(async () => {
      const snapshot = value;
      const result = await action(snapshot);
      if (result.ok) {
        setSaved(JSON.stringify(snapshot));
        setStatus({ type: "saved" });
        onSuccess?.(result);
      } else {
        setStatus({ type: "error", message: result.error });
      }
    });
  }

  return { value, setValue, set, status, setStatus, pending, dirty, submit };
}
