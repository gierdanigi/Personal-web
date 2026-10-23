import { MenuManager } from "@/components/admin/MenuManager";
import { adminListMenu } from "@/lib/admin-queries";
import { PageHeader } from "../PageHeader";

export const instant = false;

export default async function AdminCommissionPage() {
  const menu = await adminListMenu();
  return (
    <>
      <PageHeader
        title="작업물 분류"
        description="작업물 페이지의 필터와 카드에 쓰이는 분류예요. 예: 컷편집 · 쇼츠, 가사 PV, 직캠 편집"
      />
      <MenuManager initial={menu} />
    </>
  );
}
