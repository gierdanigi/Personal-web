import { ProjectForm } from "@/components/admin/ProjectForm";
import { adminGetProject, adminListProjects } from "@/lib/admin-queries";
import { PageHeader } from "../../PageHeader";

export const instant = false;

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const [project, projects] = await Promise.all([adminGetProject(id), adminListProjects()]);
  const techSuggestions = [...new Set(projects.flatMap((p) => p.tech_stack))].sort();

  return (
    <>
      <PageHeader title={project.title} back={{ href: "/admin/projects", label: "프로젝트 목록" }} />
      <ProjectForm key={project.updated_at} project={project} techSuggestions={techSuggestions} />
    </>
  );
}
