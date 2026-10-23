import { ProjectForm } from "@/components/admin/ProjectForm";
import { adminListProjects } from "@/lib/admin-queries";
import { PageHeader } from "../../PageHeader";

export const instant = false;

export default async function NewProjectPage() {
  const projects = await adminListProjects();
  const techSuggestions = [...new Set(projects.flatMap((p) => p.tech_stack))].sort();

  return (
    <>
      <PageHeader title="새 프로젝트" back={{ href: "/admin/projects", label: "프로젝트 목록" }} />
      <ProjectForm techSuggestions={techSuggestions} />
    </>
  );
}
