"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { saveWork, type WorkInput } from "@/actions/works";
import type { CommissionMenu, Work } from "@/lib/types";
import { getYouTubeId, slugify, youTubeThumbnail } from "@/lib/utils";
import { Field, Section, TagInput, Toggle } from "./fields";
import { SingleImageField } from "./ImageFields";
import { MarkdownEditor } from "./MarkdownEditor";
import { SaveBar } from "./SaveBar";
import { useSaveForm } from "./useSaveForm";
import { DeleteButton } from "./DeleteButton";

const EMPTY: WorkInput = {
  title: "",
  slug: "",
  category: "video",
  menu_id: null,
  thumbnail_url: null,
  thumbnail_path: null,
  video_url: null,
  demo_url: null,
  description: "",
  tools: [],
  work_date: null,
  is_featured: false,
  is_public: false,
};

export function WorkForm({
  work,
  menu,
  toolSuggestions,
}: {
  work?: Work;
  menu: CommissionMenu[];
  toolSuggestions: string[];
}) {
  const router = useRouter();
  const initial: WorkInput = work ? (({ sort_order: _s, created_at: _c, updated_at: _u, ...rest }) => rest)(work) : EMPTY;
  const form = useSaveForm<WorkInput>(initial);
  const { value: v, set } = form;
  const isNew = !work;
  const menuOptions = menu.filter((m) => m.category === "video");
  const youtubeId = getYouTubeId(v.video_url);
  const autoThumb = youTubeThumbnail(v.video_url);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        form.submit(saveWork, (result) => {
          if (isNew && result.ok && result.data) router.replace(`/admin/works/${result.data.id}`);
        });
      }}
    >
      <Section
        title="기본 정보"
        action={
          work?.is_public && (
            <Link href={`/works/${work.slug}`} target="_blank" className="btn-ghost text-accent">
              사이트에서 보기 <ExternalLink className="size-3.5" />
            </Link>
          )
        }
      >
        <Field label="제목">
          <input
            className="input"
            value={v.title}
            required
            onChange={(e) => {
              const title = e.target.value;
              form.setValue((p) => ({
                ...p,
                title,
                slug: isNew && (!p.slug || p.slug === slugify(p.title)) ? slugify(title) : p.slug,
              }));
            }}
          />
        </Field>
        <Field label="slug (주소)" hint={`/works/${v.slug || "my-work"} — 영문 소문자, 숫자, 하이픈만`}>
          <input
            className="input font-mono"
            value={v.slug}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            placeholder="my-work"
            onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="분류" hint="'할 수 있는 작업'의 영상 항목 중 하나">
            <select className="input" value={v.menu_id ?? ""} onChange={(e) => set("menu_id", e.target.value || null)}>
              <option value="">선택 안 함</option>
              {menuOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="작업일">
            <input
              className="input"
              type="date"
              value={v.work_date ?? ""}
              onChange={(e) => set("work_date", e.target.value || null)}
            />
          </Field>
        </div>
        <Field label="사용 툴">
          <TagInput value={v.tools} onChange={(x) => set("tools", x)} suggestions={toolSuggestions} />
        </Field>
      </Section>

      <Section title="미디어">
        <Field
          label="유튜브 링크"
          hint={
            v.video_url && !youtubeId ? (
              <span className="text-red-600">유튜브 주소를 인식하지 못했어요.</span>
            ) : (
              "watch, youtu.be, shorts 주소 모두 가능"
            )
          }
        >
          <input
            className="input"
            type="url"
            value={v.video_url ?? ""}
            placeholder="https://youtu.be/..."
            onChange={(e) => set("video_url", e.target.value || null)}
          />
        </Field>
        {youtubeId && (
          <div className="aspect-video w-full max-w-md overflow-hidden rounded-xl bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title="미리보기"
              className="size-full"
              allowFullScreen
            />
          </div>
        )}
        <Field label="데모 링크" hint="웹 작업물이면 실제 페이지 주소">
          <input
            className="input"
            type="url"
            value={v.demo_url ?? ""}
            placeholder="https://..."
            onChange={(e) => set("demo_url", e.target.value || null)}
          />
        </Field>
        <Field label="썸네일" hint={autoThumb && !v.thumbnail_url ? "비워 두면 유튜브 썸네일을 자동으로 써요." : undefined}>
          <SingleImageField
            url={v.thumbnail_url ?? (autoThumb && !v.thumbnail_url ? autoThumb : null)}
            folder="works"
            onChange={(img) =>
              form.setValue((p) => ({ ...p, thumbnail_url: img?.url ?? null, thumbnail_path: img?.path ?? null }))
            }
          />
        </Field>
      </Section>

      <Section title="설명" description="마크다운을 쓸 수 있어요.">
        <MarkdownEditor value={v.description} onChange={(x) => set("description", x)} rows={12} />
      </Section>

      <Section title="노출 설정">
        <div className="flex flex-wrap gap-6">
          <Toggle checked={v.is_public} onChange={(x) => set("is_public", x)} label="공개" />
          <Toggle checked={v.is_featured} onChange={(x) => set("is_featured", x)} label="메인에 대표 작업물로 노출" />
        </div>
      </Section>

      <SaveBar pending={form.pending} status={form.status} dirty={form.dirty}>
        {work && <DeleteButton kind="work" id={work.id} title={work.title} />}
      </SaveBar>
    </form>
  );
}
