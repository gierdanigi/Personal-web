import Link from "next/link";
import { Plus } from "lucide-react";
import { reorderProjects, setProjectFlag } from "@/actions/projects";
import { ItemList } from "@/components/admin/ItemList";
import { adminListProjects } from "@/lib/admin-queries";
import { formatPeriod } from "@/lib/utils";
import { PageHeader } from "../PageHeader";

export const instant = false;

export default async function AdminProjectsPage() {
  const projects = await adminListProjects();

  return (
    <>
      <PageHeader
        title="프로젝트"
        description="끌어서 순서를 바꾸고, ★로 메인 노출을 정해요."
        action={
          <Link href="/admin/projects/new" className="btn-primary">
            <Plus className="size-4" /> 새로 만들기
          </Link>
        }
      />
      <ItemList
        kind="project"
        onReorder={reorderProjects}
        onFlag={setProjectFlag}
        items={projects.map((p) => ({
          id: p.id,
          title: p.title,
          subtitle: [formatPeriod(p.period_start, p.period_end, p.is_ongoing), p.tech_stack.slice(0, 4).join(", ")]
            .filter(Boolean)
            .join(" · "),
          thumbnail: p.images[0]?.url ?? null,
          is_public: p.is_public,
          is_featured: p.is_featured,
        }))}
      />
    </>
  );
}
