import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowUpRight, CalendarDays, ChevronLeft, UserRound, Users } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Markdown } from "@/components/Markdown";
import { Gallery } from "@/components/site/Gallery";
import { getProjectBySlug } from "@/lib/queries";
import { formatPeriod, plainExcerpt } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "프로젝트를 찾을 수 없어요" };
  return {
    title: project.title,
    description: project.summary || plainExcerpt(project.description),
  };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}

async function ProjectDetail({ params }: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const period = formatPeriod(project.period_start, project.period_end, project.is_ongoing);
  const meta = [
    { icon: CalendarDays, label: "기간", value: period },
    { icon: Users, label: "팀 구성", value: project.team_info },
    { icon: UserRound, label: "역할", value: project.role },
  ].filter((m) => m.value);
  const links = [
    project.github_url && { label: "GitHub", url: project.github_url, github: true },
    project.demo_url && { label: "데모 보기", url: project.demo_url, github: false },
    ...project.etc_links.map((l) => ({ label: l.label || "링크", url: l.url, github: false })),
  ].filter((l): l is { label: string; url: string; github: boolean } => Boolean(l));

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/projects" className="inline-flex items-center gap-0.5 text-sm text-muted hover:text-foreground">
        <ChevronLeft className="size-4" /> 프로젝트 목록
      </Link>

      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
        {project.summary && <p className="mt-3 text-lg text-foreground/70">{project.summary}</p>}

        {meta.length > 0 && (
          <dl className="card mt-6 grid gap-4 p-5 sm:grid-cols-3">
            {meta.map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted">
                  <Icon className="size-3.5" /> {label}
                </dt>
                <dd className="mt-1 font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {project.tech_stack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.tech_stack.map((t) => (
              <li key={t}>
                <Link href={`/projects?tech=${encodeURIComponent(t)}`} className="tag bg-accent-soft px-3 py-1 text-sm text-accent hover:bg-accent/15">
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {links.map((l, i) => (
              <a key={`${l.url}-${i}`} href={l.url} target="_blank" rel="noreferrer" className={i === 0 ? "btn-primary" : "btn-outline"}>
                {l.github && <SiGithub className="size-4" />}
                {l.label}
                {!l.github && <ArrowUpRight className="size-4" />}
              </a>
            ))}
          </div>
        )}
      </header>

      {project.images.length > 0 && (
        <div className="mt-10">
          <Gallery images={project.images} title={project.title} />
        </div>
      )}

      {project.description.trim() && (
        <div className="card mt-10 p-6 sm:p-10">
          <Markdown>{project.description}</Markdown>
        </div>
      )}
    </article>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-4">
      <div className="h-4 w-24 rounded bg-line" />
      <div className="h-10 w-2/3 rounded-lg bg-line" />
      <div className="h-5 w-1/2 rounded bg-line" />
      <div className="card mt-6 h-24" />
      <div className="card aspect-video" />
    </div>
  );
}
