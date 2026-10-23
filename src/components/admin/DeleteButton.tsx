"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { deleteProject } from "@/actions/projects";
import { deleteWork } from "@/actions/works";

const CONFIG = {
  project: { action: deleteProject, back: "/admin/projects" },
  work: { action: deleteWork, back: "/admin/works" },
};

export function DeleteButton({
  kind,
  id,
  title,
  compact,
}: {
  kind: keyof typeof CONFIG;
  id: string;
  title: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { action, back } = CONFIG[kind];

  return (
    <button
      type="button"
      className={compact ? "rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600" : "btn-danger"}
      disabled={pending}
      aria-label={`${title} 삭제`}
      onClick={() => {
        if (!confirm(`'${title}'을(를) 삭제할까요? 되돌릴 수 없어요.`)) return;
        startTransition(async () => {
          const result = await action(id);
          if (!result.ok) {
            alert(result.error);
            return;
          }
          if (!compact) router.replace(back);
          router.refresh();
        });
      }}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      {!compact && "삭제"}
    </button>
  );
}
