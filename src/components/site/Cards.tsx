import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FolderGit2, Play } from "lucide-react";
import type { Project, WorkWithMenu } from "@/lib/types";
import { cn, formatDate, formatPeriod, youTubeThumbnail } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  const cover = project.images[0]?.url;
  const period = formatPeriod(project.period_start, project.period_end, project.is_ongoing);

  return (
    <Link href={`/projects/${project.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/9] bg-soft">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted/50">
            <FolderGit2 className="size-10" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted">
          {period && <span>{period}</span>}
          {project.team_info && (
            <>
              {period && <span aria-hidden>·</span>}
              <span>{project.team_info}</span>
            </>
          )}
        </div>
        <h3 className="mt-1.5 text-lg font-bold tracking-tight">{project.title}</h3>
        {project.summary && <p className="mt-1 line-clamp-2 text-sm text-foreground/70">{project.summary}</p>}
        {project.tech_stack.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {project.tech_stack.slice(0, 6).map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
            {project.tech_stack.length > 6 && <li className="tag">+{project.tech_stack.length - 6}</li>}
          </ul>
        )}
      </div>
    </Link>
  );
}

export function workThumbnail(work: Pick<WorkWithMenu, "thumbnail_url" | "video_url">) {
  return work.thumbnail_url ?? youTubeThumbnail(work.video_url);
}

export function WorkCard({ work, className }: { work: WorkWithMenu; className?: string }) {
  const thumb = workThumbnail(work);

  return (
    <Link href={`/works/${work.slug}`} className={cn("card card-hover group block h-full overflow-hidden", className)}>
      <div className="relative aspect-video bg-soft">
        {thumb && (
          <Image
            src={thumb}
            alt=""
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        )}
        {work.video_url && (
          <span className="absolute right-2.5 bottom-2.5 inline-flex size-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur">
            <Play className="size-3.5 fill-current" />
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate font-bold">{work.title}</h3>
        <p className="mt-0.5 truncate text-sm text-muted">
          {[work.menu?.name, formatDate(work.work_date)].filter(Boolean).join(" · ") || " "}
        </p>
      </div>
    </Link>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="card px-6 py-16 text-center text-sm text-muted">{children}</div>;
}
