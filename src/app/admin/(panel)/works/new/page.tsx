import { WorkForm } from "@/components/admin/WorkForm";
import { adminListMenu, adminListWorks } from "@/lib/admin-queries";
import { PageHeader } from "../../PageHeader";

export const instant = false;

export default async function NewWorkPage() {
  const [works, menu] = await Promise.all([adminListWorks(), adminListMenu()]);
  const toolSuggestions = [...new Set(works.flatMap((w) => w.tools))].sort();

  return (
    <>
      <PageHeader title="새 작업물" back={{ href: "/admin/works", label: "작업물 목록" }} />
      <WorkForm menu={menu} toolSuggestions={toolSuggestions} />
    </>
  );
}
