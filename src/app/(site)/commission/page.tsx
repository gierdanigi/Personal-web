import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clapperboard, Code2 } from "lucide-react";
import { PageTitle } from "@/components/site/SectionHeading";
import { ContactButtons } from "@/components/site/SocialLinks";
import { getCommissionMenu, getProfile, getPublicWorks } from "@/lib/queries";
import { CATEGORY_LABEL, type Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "커미션",
  description: "영상 편집 · 개발 커미션으로 받는 작업과 문의 방법",
};

export default async function CommissionPage() {
  const [profile, menu, works] = await Promise.all([getProfile(), getCommissionMenu(), getPublicWorks()]);
  const sampleCount = new Map<string, number>();
  works.forEach((w) => w.menu_id && sampleCount.set(w.menu_id, (sampleCount.get(w.menu_id) ?? 0) + 1));

  return (
    <>
      <PageTitle title="커미션" description="이런 작업을 받고 있어요. 자세한 내용은 편하게 문의해 주세요." />

      <div className="grid gap-6 md:grid-cols-2">
        {(["video", "dev"] as Category[]).map((category) => {
          const items = menu.filter((m) => m.category === category);
          if (!items.length) return null;
          const Icon = category === "video" ? Clapperboard : Code2;

          return (
            <section key={category} id={category} className="card scroll-mt-24 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <Icon className={cn("size-5", category === "video" ? "text-rose-500" : "text-sky-500")} />
                {CATEGORY_LABEL[category]}
              </h2>
              <ul className="divide-y divide-line">
                {items.map((item) => {
                  const samples = sampleCount.get(item.id) ?? 0;
                  return (
                    <li
                      key={item.id}
                      id={`menu-${item.id}`}
                      className={cn("scroll-mt-24 py-3 first:pt-0 last:pb-0", !item.is_open && "opacity-50")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{item.name}</p>
                        {!item.is_open && (
                          <span className="shrink-0 rounded-full bg-soft px-2 py-0.5 text-xs text-muted">마감</span>
                        )}
                      </div>
                      {item.description && <p className="mt-0.5 text-sm text-foreground/60">{item.description}</p>}
                      {samples > 0 && (
                        <Link
                          href={`/works?category=${category}&menu=${item.id}`}
                          className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-accent hover:underline"
                        >
                          작업물 {samples}개 보기 <ArrowRight className="size-3" />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
      {menu.length === 0 && <p className="text-muted">준비 중이에요.</p>}

      <section className="card mt-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-lg font-bold">문의하기</h2>
          <p className="mt-1 text-sm text-foreground/70">목록에 없는 작업도 가능한지 편하게 물어봐 주세요.</p>
        </div>
        <ContactButtons links={profile.links} size="lg" />
      </section>
    </>
  );
}
