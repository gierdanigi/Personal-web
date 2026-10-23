import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, GraduationCap, Sparkles } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { ProjectCard, WorkCard } from "@/components/site/Cards";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ContactButtons, SocialLinks } from "@/components/site/SocialLinks";
import { getProfile, getPublicProjects, getPublicWorks } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

const HOME_LIMIT = 6;

export default async function HomePage() {
  const [profile, projects, works] = await Promise.all([getProfile(), getPublicProjects(), getPublicWorks()]);

  // ★(메인 노출) 항목을 앞에, 나머지는 등록 순서대로
  const homeProjects = [...projects].sort((a, b) => Number(b.is_featured) - Number(a.is_featured)).slice(0, HOME_LIMIT);
  const homeWorks = [...works].sort((a, b) => Number(b.is_featured) - Number(a.is_featured)).slice(0, HOME_LIMIT);
  const education = [profile.school, profile.major, profile.status].filter(Boolean).join(" · ");
  const hasAbout = profile.bio.trim() || profile.skills.length > 0;
  const hasHistory = profile.certifications.length > 0 || profile.activities.length > 0;

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* 프로필 */}
      <section className="pt-4 sm:pt-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
          <Reveal>
            <div className="relative size-28 shrink-0 overflow-hidden rounded-full border-4 border-card bg-soft shadow-md sm:size-36">
              {profile.avatar_url && (
                <Image src={profile.avatar_url} alt={profile.name} fill sizes="144px" className="object-cover" priority />
              )}
            </div>
          </Reveal>
          <div className="min-w-0 flex-1">
            <Reveal delay={100}>
              {profile.nickname && <p className="font-semibold text-accent">{profile.nickname}</p>}
              <h1 className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">{profile.name || "이름을 입력해 주세요"}</h1>
            </Reveal>
            <Reveal delay={200}>
              {profile.headline && <p className="mt-4 text-lg text-foreground/70 sm:text-xl">{profile.headline}</p>}
              {education && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted">
                  <GraduationCap className="size-4" /> {education}
                </p>
              )}
            </Reveal>
            <Reveal delay={300}>
              <SocialLinks links={profile.links} className="mt-6" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 소개 · 기술 스택 */}
      {hasAbout && (
        <section id="about" className="scroll-mt-24">
          <Reveal>
            <SectionHeading title="소개" />
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
            {profile.bio.trim() && (
              <Reveal className="h-full">
                <div className="card h-full p-6 sm:p-8">
                  <Markdown>{profile.bio}</Markdown>
                </div>
              </Reveal>
            )}
            {profile.skills.length > 0 && (
              <Reveal delay={100} className={profile.bio.trim() ? "h-full" : "lg:col-span-2"}>
                <div className="card h-full p-6 sm:p-8">
                  <h3 className="mb-5 font-bold">기술 스택</h3>
                  <dl className="space-y-4">
                    {profile.skills.map((group) => (
                      <div key={group.group}>
                        <dt className="mb-1.5 text-xs font-semibold tracking-wide text-muted uppercase">{group.group}</dt>
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
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* 프로젝트 */}
      {homeProjects.length > 0 && (
        <section id="projects" className="scroll-mt-24">
          <Reveal>
            <SectionHeading
              title="프로젝트"
              description="직접 설계하고 만든 개발 프로젝트"
              href={projects.length > HOME_LIMIT ? "/projects" : undefined}
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {homeProjects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 100} className="h-full">
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* 작업물 */}
      {homeWorks.length > 0 && (
        <section id="works" className="scroll-mt-24">
          <Reveal>
            <SectionHeading
              title="작업물"
              description="영상 편집 작업"
              href={works.length > HOME_LIMIT ? "/works" : undefined}
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homeWorks.map((w, i) => (
              <Reveal key={w.id} delay={(i % 3) * 100} className="h-full">
                <WorkCard work={w} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* 자격증 · 활동 */}
      {hasHistory && (
        <section className="grid gap-5 md:grid-cols-2">
          {profile.activities.length > 0 && (
            <Reveal className={profile.certifications.length ? "h-full" : "md:col-span-2"}>
              <div className="card h-full p-6 sm:p-8">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
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
              </div>
            </Reveal>
          )}
          {profile.certifications.length > 0 && (
            <Reveal delay={100} className={profile.activities.length ? "h-full" : "md:col-span-2"}>
              <div className="card h-full p-6 sm:p-8">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
                  <Award className="size-5 text-accent" /> 자격증
                </h2>
                <ul className="space-y-3">
                  {profile.certifications.map((c, i) => (
                    <li key={`${c.name}-${i}`} className="flex items-baseline justify-between gap-3">
                      <span className="font-medium">{c.name}</span>
                      <span className="shrink-0 text-sm text-muted">{formatDate(c.date)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </section>
      )}

      {/* 문의 */}
      <Reveal>
        <section className="card relative overflow-hidden p-8 text-center sm:p-12">
          <div aria-hidden className="pointer-events-none absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-full bg-accent-soft blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl font-bold tracking-tight">함께 작업해요</h2>
            <p className="mt-2 text-foreground/70">영상 편집 · 개발 작업 문의는 언제든 편하게 연락 주세요.</p>
            <ContactButtons links={profile.links} size="lg" className="mt-6 justify-center" />
            <Link href="/contact" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-accent">
              할 수 있는 작업 보기 <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
