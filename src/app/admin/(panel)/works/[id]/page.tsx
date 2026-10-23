import { WorkForm } from "@/components/admin/WorkForm";
import { adminGetWork, adminListMenu, adminListWorks } from "@/lib/admin-queries";
import { PageHeader } from "../../PageHeader";

export const instant = false;

export default async function EditWorkPage({ params }: PageProps<"/admin/works/[id]">) {
  const { id } = await params;
  const [work, works, menu] = await Promise.all([adminGetWork(id), adminListWorks(), adminListMenu()]);
  const toolSuggestions = [...new Set(works.flatMap((w) => w.tools))].sort();

  return (
    <>
      <PageHeader title={work.title} back={{ href: "/admin/works", label: "작업물 목록" }} />
      <WorkForm key={work.updated_at} work={work} menu={menu} toolSuggestions={toolSuggestions} />
    </>
  );
}
