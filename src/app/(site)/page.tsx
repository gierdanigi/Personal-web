import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clapperboard, Code2, GraduationCap } from "lucide-react";
import { ProjectCard, WorkCard } from "@/components/site/Cards";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ContactButtons, SocialLinks } from "@/components/site/SocialLinks";
import { getCommissionMenu, getProfile, getPublicProjects, getPublicWorks } from "@/lib/queries";
import type { Category } from "@/lib/types";

export default async function HomePage() {
  const [profile, projects, works, menu] = await Promise.all([
    getProfile(),
    getPublicProjects(),
    getPublicWorks(),
    getCommissionMenu(),
  ]);

  // 대표로 지정한 항목이 없으면 최신순으로 채움
  const featuredProjects = (projects.some((p) => p.is_featured) ? projects.filter((p) => p.is_featured) : projects).slice(0, 4);
  const featuredWorks = (works.some((w) => w.is_featured) ? works.filter((w) => w.is_featured) : works).slice(0, 6);
  const education = [profile.school, profile.major, profile.status].filter(Boolean).join(" · ");

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* 프로필 */}
      <section className="card relative overflow-hidden p-6 sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-accent-soft blur-3xl"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-4 border-card bg-soft shadow-md sm:size-32">
            {profile.avatar_url && (
              <Image src={profile.avatar_url} alt={profile.name} fill sizes="128px" className="object-cover" priority />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-accent">{profile.nickname}</p>
            <h1 className="mt-0.5 text-3xl font-bold tracking-tight sm:text-4xl">{profile.name || "이름을 입력해 주세요"}</h1>
            {profile.headline && <p className="mt-2 text-lg text-foreground/70">{profile.headline}</p>}
            {education && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted">
                <GraduationCap className="size-4" /> {education}
              </p>
            )}
            <SocialLinks links={profile.links} className="mt-5" />
          </div>
        </div>
        <div className="relative mt-8 flex flex-wrap gap-2 border-t border-line pt-6">
          <Link href="/commission" className="btn-primary">
            커미션 안내 <ArrowRight className="size-4" />
          </Link>
          <Link href="/about" className="btn-outline">
            더 알아보기
          </Link>
          <ContactButtons links={profile.links} className="sm:ml-auto" />
        </div>
      </section>

      {/* 대표 프로젝트 */}
      {featuredProjects.length > 0 && (
        <section>
          <SectionHeading title="대표 프로젝트" description="직접 설계하고 만든 개발 프로젝트" href="/projects" />
          <div className="grid gap-5 sm:grid-cols-2">
            {featuredProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* 대표 작업물 */}
      {featuredWorks.length > 0 && (
        <section>
          <SectionHeading title="작업물" description="영상 편집 · 개발 커미션 샘플" href="/works" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWorks.map((w) => (
              <WorkCard key={w.id} work={w} />
            ))}
          </div>
        </section>
      )}

      {/* 커미션 바로가기 */}
      <section>
        <SectionHeading title="커미션" description="영상과 개발, 두 가지 작업을 받고 있어요." href="/commission" linkLabel="메뉴판 보기" />
        <div className="grid gap-4 md:grid-cols-2">
          {(["video", "dev"] as Category[]).map((category) => {
            const items = menu.filter((m) => m.category === category);
            const openCount = items.filter((m) => m.is_open).length;
            const Icon = category === "video" ? Clapperboard : Code2;
            return (
              <Link key={category} href={`/commission#${category}`} className="card card-hover group p-6">
                <div className="flex items-center justify-between">
                  <span
                    className={
                      category === "video"
                        ? "rounded-xl bg-rose-50 p-2.5 text-rose-500"
                        : "rounded-xl bg-sky-50 p-2.5 text-sky-500"
                    }
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xs font-medium text-muted">
                    {openCount > 0 ? `${openCount}개 메뉴 접수 중` : "현재 마감"}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold">{category === "video" ? "영상 커미션" : "개발 커미션"}</h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {items.map((m) => (
                    <li key={m.id} className={m.is_open ? "tag" : "tag text-muted line-through"}>
                      {m.name}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  자세히 보기 <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
