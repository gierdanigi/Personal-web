import type { Metadata } from "next";
import { Clapperboard, Code2 } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { PageTitle } from "@/components/site/SectionHeading";
import { ContactButtons } from "@/components/site/SocialLinks";
import { getCommissionMenu, getProfile } from "@/lib/queries";
import { CATEGORY_LABEL, type Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "문의",
  description: "할 수 있는 작업과 문의 방법 (오픈채팅 · 디스코드)",
};

export default async function ContactPage() {
  const [profile, menu] = await Promise.all([getProfile(), getCommissionMenu()]);

  return (
    <>
      <Reveal>
        <PageTitle title="문의" description="이런 작업을 할 수 있어요. 자세한 내용은 편하게 물어봐 주세요." />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2">
        {(["video", "dev"] as Category[]).map((category, index) => {
          const items = menu.filter((m) => m.category === category);
          if (!items.length) return null;
          const Icon = category === "video" ? Clapperboard : Code2;

          return (
            <Reveal key={category} delay={index * 100} className="h-full">
              <section className="card h-full p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Icon className={cn("size-5", category === "video" ? "text-rose-500" : "text-sky-500")} />
                  {CATEGORY_LABEL[category]}
                </h2>
                <ul className="divide-y divide-line">
                  {items.map((item) => (
                    <li key={item.id} className={cn("py-3 first:pt-0 last:pb-0", !item.is_open && "opacity-50")}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{item.name}</p>
                        {!item.is_open && (
                          <span className="shrink-0 rounded-full bg-soft px-2 py-0.5 text-xs text-muted">마감</span>
                        )}
                      </div>
                      {item.description && <p className="mt-0.5 text-sm text-foreground/60">{item.description}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          );
        })}
      </div>
      {menu.length === 0 && <p className="text-muted">준비 중이에요.</p>}

      <Reveal>
        <section className="card mt-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-lg font-bold">문의하기</h2>
            <p className="mt-1 text-sm text-foreground/70">목록에 없는 작업도 가능한지 편하게 물어봐 주세요.</p>
          </div>
          <ContactButtons links={profile.links} size="lg" />
        </section>
      </Reveal>
    </>
  );
}
