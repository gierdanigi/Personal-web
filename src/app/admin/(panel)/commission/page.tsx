import { MenuManager } from "@/components/admin/MenuManager";
import { adminListMenu } from "@/lib/admin-queries";
import { PageHeader } from "../PageHeader";

export const instant = false;

export default async function AdminCommissionPage() {
  const menu = await adminListMenu();
  return (
    <>
      <PageHeader
        title="커미션 메뉴"
        description="메뉴를 눌러 가격 · 기간 · 수정 횟수를 편집해요. 마감으로 바꾸면 사이트에 '마감'으로 표시돼요."
      />
      <MenuManager initial={menu} />
    </>
  );
}
