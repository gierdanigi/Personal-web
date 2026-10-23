import { MenuManager } from "@/components/admin/MenuManager";
import { adminListMenu } from "@/lib/admin-queries";
import { PageHeader } from "../PageHeader";

export const instant = false;

export default async function AdminCommissionPage() {
  const menu = await adminListMenu();
  return (
    <>
      <PageHeader
        title="할 수 있는 작업"
        description="문의 페이지에 보여줄 작업 종류예요. 영상 항목은 작업물의 세부 분류로도 쓰여요. 마감으로 바꾸면 '마감'으로 표시돼요."
      />
      <MenuManager initial={menu} />
    </>
  );
}
