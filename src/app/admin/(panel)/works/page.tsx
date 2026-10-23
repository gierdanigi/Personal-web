import Link from "next/link";
import { Plus } from "lucide-react";
import { reorderWorks, setWorkFlag } from "@/actions/works";
import { ItemList } from "@/components/admin/ItemList";
import { adminListMenu, adminListWorks } from "@/lib/admin-queries";
import { formatDate, youTubeThumbnail } from "@/lib/utils";
import { PageHeader } from "../PageHeader";

export const instant = false;

export default async function AdminWorksPage() {
  const [works, menu] = await Promise.all([adminListWorks(), adminListMenu()]);
  const menuName = new Map(menu.map((m) => [m.id, m.name]));

  return (
    <>
      <PageHeader
        title="작업물"
        description="영상 작업물. 개발 결과물은 프로젝트에 등록해요. 끌어서 순서를 바꾸고, ★로 메인 노출을 정해요."
        action={
          <Link href="/admin/works/new" className="btn-primary">
            <Plus className="size-4" /> 새로 만들기
          </Link>
        }
      />
      <ItemList
        kind="work"
        onReorder={reorderWorks}
        onFlag={setWorkFlag}
        items={works.map((w) => ({
          id: w.id,
          title: w.title,
          subtitle: [w.category === "dev" && "⚠️ 개발 분류 (사이트에 안 보임 · 프로젝트로 옮겨 주세요)", w.menu_id && menuName.get(w.menu_id), formatDate(w.work_date)]
            .filter(Boolean)
            .join(" · "),
          thumbnail: w.thumbnail_url ?? youTubeThumbnail(w.video_url),
          is_public: w.is_public,
          is_featured: w.is_featured,
        }))}
      />
    </>
  );
}
