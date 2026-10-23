import Link from "next/link";
import { ArrowRight, FolderGit2, Film, ListChecks, UserRound } from "lucide-react";
import { adminListMenu, adminListProjects, adminListWorks } from "@/lib/admin-queries";
import { PageHeader } from "./PageHeader";

export const instant = false;

export default async function AdminHome() {
  const [projects, works, menu] = await Promise.all([adminListProjects(), adminListWorks(), adminListMenu()]);

  const cards = [
    { href: "/admin/profile", label: "프로필", icon: UserRound, stat: "소개 · 링크 · 기술 스택" },
    {
      href: "/admin/projects",
      label: "프로젝트",
      icon: FolderGit2,
      stat: `${projects.length}개 · 공개 ${projects.filter((p) => p.is_public).length}개`,
    },
    {
      href: "/admin/works",
      label: "작업물",
      icon: Film,
      stat: `${works.length}개 · 공개 ${works.filter((w) => w.is_public).length}개`,
    },
    {
      href: "/admin/commission",
      label: "작업물 분류",
      icon: ListChecks,
      stat: `${menu.filter((m) => m.category === "video").length}개`,
    },
  ];

  return (
    <>
      <PageHeader title="대시보드" description="여기서 수정한 내용은 재배포 없이 사이트에 바로 반영돼요." />
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map(({ href, label, icon: Icon, stat }) => (
          <Link key={href} href={href} className="card card-hover flex items-center gap-4 p-5">
            <span className="rounded-xl bg-accent-soft p-3 text-accent">
              <Icon className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold">{label}</span>
              <span className="block text-sm text-muted">{stat}</span>
            </span>
            <ArrowRight className="size-4 text-muted" />
          </Link>
        ))}
      </div>
    </>
  );
}
