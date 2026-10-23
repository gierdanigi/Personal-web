import type { Metadata } from "next";
import Image from "next/image";
import { Award, GraduationCap, Sparkles } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { PageTitle } from "@/components/site/SectionHeading";
import { SocialLinks } from "@/components/site/SocialLinks";
import { getProfile } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "소개",
  description: "학력, 기술 스택, 자격증, 활동",
};

export default async function AboutPage() {
  const profile = await getProfile();
  const hasEducation = profile.school || profile.major || profile.status;

  return (
    <>
      <PageTitle title="소개" />

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        {/* 왼쪽: 프로필 카드 */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 text-center">
            <div className="relative mx-auto size-28 overflow-hidden rounded-full bg-soft">
              {profile.avatar_url && (
                <Image src={profile.avatar_url} alt={profile.name} fill sizes="112px" className="object-cover" />
              )}
            </div>
            <h2 className="mt-4 text-xl font-bold">{profile.name}</h2>
            {profile.nickname && <p className="text-sm text-accent">{profile.nickname}</p>}
            {profile.headline && <p className="mt-3 text-sm text-foreground/70">{profile.headline}</p>}
            <SocialLinks links={profile.links} className="mt-5 justify-center" />
          </div>

          {hasEducation && (
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <GraduationCap className="size-4 text-accent" /> 학력
              </h3>
              <p className="mt-2 font-semibold">{profile.school}</p>
              <p className="text-sm text-foreground/70">{[profile.major, profile.status].filter(Boolean).join(" · ")}</p>
            </div>
          )}
        </aside>

        {/* 오른쪽: 본문 */}
        <div className="min-w-0 space-y-6">
          {profile.bio.trim() && (
            <section className="card p-6 sm:p-8">
              <Markdown>{profile.bio}</Markdown>
            </section>
          )}

          {profile.skills.length > 0 && (
            <section className="card p-6 sm:p-8">
              <h2 className="mb-5 text-lg font-bold">기술 스택</h2>
              <dl className="space-y-4">
                {profile.skills.map((group) => (
                  <div key={group.group} className="grid gap-2 sm:grid-cols-[7rem_1fr]">
                    <dt className="pt-0.5 text-sm font-semibold text-muted">{group.group}</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span key={item} className="tag bg-accent-soft px-3 py-1 text-sm text-accent">
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <div className="space-y-6">
            {profile.certifications.length > 0 && (
              <section className="card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Award className="size-5 text-accent" /> 자격증
                </h2>
                <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {profile.certifications.map((c, i) => (
                    <li key={`${c.name}-${i}`} className="flex items-baseline justify-between gap-3">
                      <span className="font-medium">{c.name}</span>
                      <span className="shrink-0 text-sm text-muted">{formatDate(c.date)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {profile.activities.length > 0 && (
              <section className="card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Sparkles className="size-5 text-accent" /> 활동
                </h2>
                <ol className="relative space-y-5 border-l-2 border-line pl-5">
                  {profile.activities.map((a, i) => (
                    <li key={`${a.name}-${i}`} className="relative">
                      <span className="absolute top-1.5 -left-[27px] size-3 rounded-full border-2 border-card bg-accent" />
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <p className="font-semibold">{a.name}</p>
                        <p className="text-sm text-muted">{a.period}</p>
                      </div>
                      {a.description && (
                        <p className="mt-1 text-sm whitespace-pre-line text-foreground/70">{a.description}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
