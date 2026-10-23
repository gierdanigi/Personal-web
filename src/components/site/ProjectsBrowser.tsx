"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Project } from "@/lib/types";
import { EmptyState, ProjectCard } from "./Cards";
import { FilterChips } from "./FilterChips";
import { Reveal } from "./Reveal";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {projects.map((p, i) => (
        <Reveal key={p.id} delay={(i % 2) * 90} className="h-full">
          <ProjectCard project={p} />
        </Reveal>
      ))}
    </div>
  );
}

/** 기술 스택 필터 (?tech=Next.js) */
export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tech = searchParams.get("tech") ?? "";

  const counts = new Map<string, number>();
  projects.forEach((p) => p.tech_stack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  const techs = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const filtered = tech ? projects.filter((p) => p.tech_stack.includes(tech)) : projects;

  const select = (next: string) => {
    const params = new URLSearchParams(searchParams);
    if (next) params.set("tech", next);
    else params.delete("tech");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {techs.length > 0 && (
        <FilterChips
          value={tech}
          onChange={select}
          options={[
            { value: "", label: "전체", count: projects.length },
            ...techs.map(([t, c]) => ({ value: t, label: t, count: c })),
          ]}
        />
      )}
      {filtered.length ? (
        <ProjectGrid projects={filtered} />
      ) : (
        <EmptyState>{tech ? `${tech}를 사용한 프로젝트가 없어요.` : "아직 공개된 프로젝트가 없어요."}</EmptyState>
      )}
    </div>
  );
}
