"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { saveProject, type ProjectInput } from "@/actions/projects";
import type { EtcLink, Project } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { Field, Section, TagInput, Toggle } from "./fields";
import { MultiImageField } from "./ImageFields";
import { ListEditor } from "./ListEditor";
import { MarkdownEditor } from "./MarkdownEditor";
import { SaveBar } from "./SaveBar";
import { useSaveForm } from "./useSaveForm";
import { DeleteButton } from "./DeleteButton";

const DESCRIPTION_TEMPLATE = `## 개요

## 주요 기능
-

## 내가 한 일
-

## 트러블슈팅
### 문제
### 해결

## 배운 점
`;

const EMPTY: ProjectInput = {
  title: "",
  slug: "",
  summary: "",
  period_start: null,
  period_end: null,
  is_ongoing: false,
  team_info: "",
  role: "",
  tech_stack: [],
  description: DESCRIPTION_TEMPLATE,
  images: [],
  github_url: null,
  demo_url: null,
  etc_links: [],
  is_featured: false,
  is_public: false,
};

export function ProjectForm({ project, techSuggestions }: { project?: Project; techSuggestions: string[] }) {
  const router = useRouter();
  const initial: ProjectInput = project
    ? (({ sort_order: _s, created_at: _c, updated_at: _u, ...rest }) => rest)(project)
    : EMPTY;
  const form = useSaveForm<ProjectInput>(initial);
  const { value: v, set } = form;
  const isNew = !project;

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        form.submit(saveProject, (result) => {
          if (isNew && result.ok && result.data) router.replace(`/admin/projects/${result.data.id}`);
        });
      }}
    >
      <Section
        title="기본 정보"
        action={
          project?.is_public && (
            <Link href={`/projects/${project.slug}`} target="_blank" className="btn-ghost text-accent">
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
                // 새 프로젝트이고 slug를 아직 안 건드렸으면 자동 추천
                slug: isNew && (!p.slug || p.slug === slugify(p.title)) ? slugify(title) : p.slug,
              }));
            }}
          />
        </Field>
        <Field label="slug (주소)" hint={`/projects/${v.slug || "my-project"} — 영문 소문자, 숫자, 하이픈만`}>
          <input
            className="input font-mono"
            value={v.slug}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            placeholder="my-project"
            onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
          />
        </Field>
        <Field label="한 줄 요약">
          <input className="input" value={v.summary} onChange={(e) => set("summary", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="시작">
            <input
              className="input"
              type="date"
              value={v.period_start ?? ""}
              onChange={(e) => set("period_start", e.target.value || null)}
            />
          </Field>
          <Field label="종료">
            <input
              className="input"
              type="date"
              value={v.period_end ?? ""}
              disabled={v.is_ongoing}
              onChange={(e) => set("period_end", e.target.value || null)}
            />
          </Field>
          <div className="pb-2">
            <Toggle checked={v.is_ongoing} onChange={(x) => set("is_ongoing", x)} label="진행 중" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="팀 구성">
            <input
              className="input"
              value={v.team_info}
              placeholder="예: 4인 팀 / 개인"
              onChange={(e) => set("team_info", e.target.value)}
            />
          </Field>
          <Field label="맡은 역할">
            <input
              className="input"
              value={v.role}
              placeholder="예: 백엔드 · 인프라"
              onChange={(e) => set("role", e.target.value)}
            />
          </Field>
        </div>
        <Field label="기술 스택" hint="목록 페이지의 필터로 쓰여요.">
          <TagInput value={v.tech_stack} onChange={(x) => set("tech_stack", x)} suggestions={techSuggestions} />
        </Field>
      </Section>

      <Section title="본문" description="개요, 주요 기능, 내가 한 일, 트러블슈팅, 배운 점">
        <MarkdownEditor value={v.description} onChange={(x) => set("description", x)} rows={22} />
      </Section>

      <Section title="이미지" description="첫 번째 이미지가 카드 썸네일과 대표 이미지로 쓰여요.">
        <MultiImageField images={v.images} folder="projects" onChange={(x) => set("images", x)} />
      </Section>

      <Section title="링크">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="GitHub">
            <input
              className="input"
              type="url"
              value={v.github_url ?? ""}
              placeholder="https://github.com/..."
              onChange={(e) => set("github_url", e.target.value || null)}
            />
          </Field>
          <Field label="데모">
            <input
              className="input"
              type="url"
              value={v.demo_url ?? ""}
              placeholder="https://..."
              onChange={(e) => set("demo_url", e.target.value || null)}
            />
          </Field>
        </div>
        <Field label="기타 링크">
          <ListEditor<EtcLink>
            items={v.etc_links}
            onChange={(x) => set("etc_links", x)}
            createItem={() => ({ label: "", url: "" })}
            addLabel="링크 추가"
            emptyText="발표 자료, 블로그 글 등"
            renderFields={(l, update) => (
              <div className="grid gap-2 sm:grid-cols-[10rem_1fr]">
                <input
                  className="input"
                  value={l.label}
                  placeholder="이름"
                  onChange={(e) => update({ label: e.target.value })}
                />
                <input
                  className="input"
                  value={l.url}
                  placeholder="https://..."
                  onChange={(e) => update({ url: e.target.value })}
                />
              </div>
            )}
          />
        </Field>
      </Section>

      <Section title="노출 설정">
        <div className="flex flex-wrap gap-6">
          <Toggle checked={v.is_public} onChange={(x) => set("is_public", x)} label="공개" />
          <Toggle checked={v.is_featured} onChange={(x) => set("is_featured", x)} label="메인에 대표 프로젝트로 노출" />
        </div>
      </Section>

      <SaveBar pending={form.pending} status={form.status} dirty={form.dirty}>
        {project && <DeleteButton kind="project" id={project.id} title={project.title} />}
      </SaveBar>
    </form>
  );
}
