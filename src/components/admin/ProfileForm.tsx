"use client";

import { useState } from "react";
import { saveProfile, type ProfileInput } from "@/actions/profile";
import { LINK_PRESETS } from "@/lib/links";
import type { Activity, Certification, LinkItem, Profile, SkillGroup } from "@/lib/types";
import { Field, Section, TagInput } from "./fields";
import { SingleImageField } from "./ImageFields";
import { ListEditor } from "./ListEditor";
import { MarkdownEditor } from "./MarkdownEditor";
import { SaveBar } from "./SaveBar";
import { useSaveForm } from "./useSaveForm";

type FormValue = Omit<ProfileInput, "removed_avatar_path"> & { avatar_path: string | null };

/** 공개 URL에서 버킷 내부 경로 추출: .../object/public/media/avatar/x.webp → avatar/x.webp */
function pathFromPublicUrl(url: string | null) {
  const match = url?.match(/\/object\/public\/media\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const { id: _id, updated_at: _u, ...rest } = profile;
  const form = useSaveForm<FormValue>({ ...rest, avatar_path: pathFromPublicUrl(profile.avatar_url) });
  const { value: v, set } = form;
  // 마지막으로 저장된 아바타 경로 — 바뀌면 저장할 때 이전 파일을 지움
  const [savedAvatarPath, setSavedAvatarPath] = useState(() => pathFromPublicUrl(profile.avatar_url));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.submit(
          ({ avatar_path, ...input }) =>
            saveProfile({
              ...input,
              removed_avatar_path: savedAvatarPath && savedAvatarPath !== avatar_path ? savedAvatarPath : null,
            }),
          () => setSavedAvatarPath(v.avatar_path),
        );
      }}
      className="space-y-5"
    >
      <Section title="기본 정보" description="메인 페이지 상단에 보여요.">
        <Field label="프로필 사진">
          <SingleImageField
            url={v.avatar_url}
            folder="avatar"
            aspect="aspect-square"
            rounded="rounded-full"
            onChange={(img) => form.setValue((p) => ({ ...p, avatar_url: img?.url ?? null, avatar_path: img?.path ?? null }))}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="이름">
            <input className="input" value={v.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="닉네임">
            <input className="input" value={v.nickname} onChange={(e) => set("nickname", e.target.value)} />
          </Field>
        </div>
        <Field label="한 줄 소개">
          <input
            className="input"
            value={v.headline}
            placeholder="예: 영상 편집하는 백엔드 개발자"
            onChange={(e) => set("headline", e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="학교">
            <input className="input" value={v.school} onChange={(e) => set("school", e.target.value)} />
          </Field>
          <Field label="전공">
            <input className="input" value={v.major} onChange={(e) => set("major", e.target.value)} />
          </Field>
          <Field label="상태">
            <input
              className="input"
              value={v.status}
              placeholder="예: 3학년 재학"
              onChange={(e) => set("status", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="상세 소개" description="소개 페이지 본문이에요. 마크다운을 쓸 수 있어요.">
        <MarkdownEditor value={v.bio} onChange={(bio) => set("bio", bio)} rows={14} />
      </Section>

      <Section
        title="링크"
        description="오픈채팅 · 디스코드는 헤더, 푸터, 커미션 페이지의 문의 버튼으로도 쓰여요. 디스코드에 아이디를 적으면 클릭 시 복사돼요."
      >
        <ListEditor<LinkItem>
          items={v.links}
          onChange={(links) => set("links", links)}
          createItem={() => ({ key: "github", label: "GitHub", value: "" })}
          addLabel="링크 추가"
          renderFields={(link, update) => {
            const preset = LINK_PRESETS.find((p) => p.key === link.key);
            return (
              <div className="grid gap-2 sm:grid-cols-[9rem_9rem_1fr]">
                <select
                  className="input"
                  value={link.key}
                  onChange={(e) => {
                    const next = LINK_PRESETS.find((p) => p.key === e.target.value);
                    const labelWasDefault = !link.label || link.label === preset?.label;
                    update({ key: e.target.value, ...(labelWasDefault && next ? { label: next.label } : {}) });
                  }}
                >
                  {LINK_PRESETS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <input
                  className="input"
                  value={link.label}
                  placeholder="표시 이름"
                  onChange={(e) => update({ label: e.target.value })}
                />
                <input
                  className="input"
                  value={link.value}
                  placeholder={preset?.placeholder ?? "https://..."}
                  onChange={(e) => update({ value: e.target.value })}
                />
              </div>
            );
          }}
        />
      </Section>

      <Section title="기술 스택" description="그룹별로 묶어서 보여줘요. 예: Backend / Cloud / Frontend / Video">
        <ListEditor<SkillGroup>
          items={v.skills}
          onChange={(skills) => set("skills", skills)}
          createItem={() => ({ group: "", items: [] })}
          addLabel="그룹 추가"
          renderFields={(group, update) => (
            <div className="grid gap-2 sm:grid-cols-[9rem_1fr]">
              <input
                className="input"
                value={group.group}
                placeholder="그룹 이름"
                onChange={(e) => update({ group: e.target.value })}
              />
              <TagInput value={group.items} onChange={(items) => update({ items })} placeholder="기술 입력 후 Enter" />
            </div>
          )}
        />
      </Section>

      <Section title="자격증">
        <ListEditor<Certification>
          items={v.certifications}
          onChange={(certifications) => set("certifications", certifications)}
          createItem={() => ({ name: "", date: "" })}
          addLabel="자격증 추가"
          renderFields={(c, update) => (
            <div className="grid gap-2 sm:grid-cols-[1fr_11rem]">
              <input
                className="input"
                value={c.name}
                placeholder="자격증 이름"
                onChange={(e) => update({ name: e.target.value })}
              />
              <input className="input" type="date" value={c.date} onChange={(e) => update({ date: e.target.value })} />
            </div>
          )}
        />
      </Section>

      <Section title="활동" description="동아리, 대외활동, 수상 등">
        <ListEditor<Activity>
          items={v.activities}
          onChange={(activities) => set("activities", activities)}
          createItem={() => ({ name: "", period: "", description: "" })}
          addLabel="활동 추가"
          renderFields={(a, update) => (
            <div className="grid gap-2">
              <div className="grid gap-2 sm:grid-cols-[1fr_12rem]">
                <input
                  className="input"
                  value={a.name}
                  placeholder="활동 이름"
                  onChange={(e) => update({ name: e.target.value })}
                />
                <input
                  className="input"
                  value={a.period}
                  placeholder="2024.03 ~ 현재"
                  onChange={(e) => update({ period: e.target.value })}
                />
              </div>
              <textarea
                className="input"
                rows={2}
                value={a.description}
                placeholder="설명"
                onChange={(e) => update({ description: e.target.value })}
              />
            </div>
          )}
        />
      </Section>

      <SaveBar pending={form.pending} status={form.status} dirty={form.dirty} />
    </form>
  );
}
