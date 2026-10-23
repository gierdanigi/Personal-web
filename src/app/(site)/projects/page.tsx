import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectGrid, ProjectsBrowser } from "@/components/site/ProjectsBrowser";
import { PageTitle } from "@/components/site/SectionHeading";
import { getPublicProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "프로젝트",
  description: "개발 프로젝트 목록",
};

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <>
      <PageTitle title="프로젝트" description="기술 스택을 눌러 필터링할 수 있어요." />
      {/* 필터는 URL(?tech=)을 읽으므로, 정적 셸에는 전체 목록을 먼저 보여줌 */}
      <Suspense fallback={<ProjectGrid projects={projects} />}>
        <ProjectsBrowser projects={projects} />
      </Suspense>
    </>
  );
}
