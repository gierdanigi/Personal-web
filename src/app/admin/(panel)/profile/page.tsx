import { ProfileForm } from "@/components/admin/ProfileForm";
import { adminGetProfile } from "@/lib/admin-queries";
import { PageHeader } from "../PageHeader";

export const instant = false;

export default async function AdminProfilePage() {
  const profile = await adminGetProfile();
  return (
    <>
      <PageHeader title="프로필" description="메인 · 소개 페이지와 헤더 · 푸터의 연락처에 쓰여요." />
      <ProfileForm profile={profile} />
    </>
  );
}
