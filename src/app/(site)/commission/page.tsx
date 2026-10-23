import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clapperboard, Clock, Code2, RefreshCw, Wallet } from "lucide-react";
import { PageTitle } from "@/components/site/SectionHeading";
import { ContactButtons } from "@/components/site/SocialLinks";
import { getCommissionMenu, getProfile, getPublicWorks } from "@/lib/queries";
import { CATEGORY_LABEL, type Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "커미션",
  description: "영상 편집 · 개발 커미션 메뉴판과 문의 방법",
};

export default async function CommissionPage() {
  const [profile, menu, works] = await Promise.all([getProfile(), getCommissionMenu(), getPublicWorks()]);
  const sampleCount = new Map<string, number>();
  works.forEach((w) => w.menu_id && sampleCount.set(w.menu_id, (sampleCount.get(w.menu_id) ?? 0) + 1));

  return (
    <>
      <PageTitle title="커미션" description="가격 · 작업 기간 · 수정 횟수를 확인하고 편하게 문의해 주세요." />

      <section className="card mb-12 flex flex-col gap-4 bg-gradient-to-br from-accent-soft to-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-lg font-bold">문의하기</h2>
          <p className="mt-1 text-sm text-foreground/70">
            원하는 메뉴와 참고 자료, 희망 일정을 함께 보내 주시면 견적을 안내해 드려요.
          </p>
        </div>
        <ContactButtons links={profile.links} size="lg" />
      </section>

      <div className="space-y-14">
        {(["video", "dev"] as Category[]).map((category) => {
          const items = menu.filter((m) => m.category === category);
          if (!items.length) return null;
          const Icon = category === "video" ? Clapperboard : Code2;

          return (
            <section key={category} id={category} className="scroll-mt-24">
              <h2 className="section-title mb-5 flex items-center gap-2">
                <Icon className={cn("size-6", category === "video" ? "text-rose-500" : "text-sky-500")} />
                {CATEGORY_LABEL[category]} 커미션
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item) => {
                  const samples = sampleCount.get(item.id) ?? 0;
                  const stats = [
                    { icon: Wallet, label: "가격", value: item.price_text },
                    { icon: Clock, label: "기간", value: item.duration_text },
                    { icon: RefreshCw, label: "수정", value: item.revision_text },
                  ];
                  return (
                    <article
                      key={item.id}
                      id={`menu-${item.id}`}
                      className={cn("card flex scroll-mt-24 flex-col p-6 target:ring-2 target:ring-accent", !item.is_open && "opacity-60")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            item.is_open ? "bg-emerald-50 text-emerald-600" : "bg-soft text-muted",
                          )}
                        >
                          {item.is_open ? "접수 중" : "마감"}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-2 text-sm whitespace-pre-line text-foreground/70">{item.description}</p>
                      )}
                      <dl className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-background p-3">
                        {stats.map(({ icon: StatIcon, label, value }) => (
                          <div key={label} className="min-w-0">
                            <dt className="flex items-center gap-1 text-xs text-muted">
                              <StatIcon className="size-3.5" /> {label}
                            </dt>
                            <dd className="mt-0.5 text-sm font-semibold">{value || "문의"}</dd>
                          </div>
                        ))}
                      </dl>
                      {samples > 0 && (
                        <Link
                          href={`/works?category=${category}&menu=${item.id}`}
                          className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-accent hover:underline"
                        >
                          샘플 작업물 {samples}개 보기 <ArrowRight className="size-4" />
                        </Link>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
        {menu.length === 0 && <p className="text-muted">준비 중이에요.</p>}
      </div>

      <section className="card mt-14 p-6 text-center sm:p-10">
        <h2 className="text-xl font-bold">원하는 메뉴가 없나요?</h2>
        <p className="mt-2 text-sm text-foreground/70">메뉴에 없는 작업도 가능한지 편하게 물어봐 주세요.</p>
        <ContactButtons links={profile.links} className="mt-5 justify-center" />
      </section>
    </>
  );
}
