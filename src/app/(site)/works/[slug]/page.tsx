import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight, ChevronLeft } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { Reveal } from "@/components/site/Reveal";
import { workThumbnail } from "@/components/site/Cards";
import { YouTubeEmbed } from "@/components/site/YouTubeEmbed";
import { getWorkBySlug } from "@/lib/queries";
import { formatDate, getYouTubeId, plainExcerpt } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/works/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return { title: "작업물을 찾을 수 없어요" };
  return {
    title: work.title,
    description: plainExcerpt(work.description) || "영상 작업물",
  };
}

export default function WorkPage({ params }: PageProps<"/works/[slug]">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="card aspect-video" />
        </div>
      }
    >
      <WorkDetail params={params} />
    </Suspense>
  );
}

async function WorkDetail({ params }: Pick<PageProps<"/works/[slug]">, "params">) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  const hasVideo = Boolean(getYouTubeId(work.video_url));
  const thumb = workThumbnail(work);

  return (
    <Reveal>
      <article className="mx-auto max-w-4xl">
        <Link href="/works" className="inline-flex items-center gap-0.5 text-sm text-muted hover:text-foreground">
          <ChevronLeft className="size-4" /> 작업물 목록
        </Link>

        <header className="mt-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {work.menu && (
              <Link href={`/works?menu=${work.menu.id}`} className="tag bg-accent-soft text-accent hover:bg-accent/15">
                {work.menu.name}
              </Link>
            )}
            {work.work_date && <span className="text-muted">{formatDate(work.work_date)}</span>}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{work.title}</h1>
        </header>

        <div className="mt-8">
          {hasVideo ? (
            <YouTubeEmbed url={work.video_url!} title={work.title} />
          ) : (
            thumb && (
              <div className="card relative aspect-video overflow-hidden">
                <Image
                  src={thumb}
                  alt={work.title}
                  fill
                  sizes="(min-width: 1024px) 896px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            )
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="min-w-0">
            {work.description.trim() ? (
              <div className="card p-6 sm:p-8">
                <Markdown>{work.description}</Markdown>
              </div>
            ) : null}
          </div>
          <aside className="space-y-4 md:order-last">
            {work.tools.length > 0 && (
              <div className="card p-5">
                <p className="text-xs font-semibold text-muted">사용 툴</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {work.tools.map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {work.demo_url && (
              <a href={work.demo_url} target="_blank" rel="noreferrer" className="btn-outline w-full">
                결과물 보러 가기 <ArrowUpRight className="size-4" />
              </a>
            )}
            <Link href="/#contact" className="card card-hover block bg-accent-soft/60 p-5">
              <p className="text-sm font-semibold">이런 작업이 필요하신가요?</p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-accent">
                문의하기 <ArrowRight className="size-4" />
              </p>
            </Link>
          </aside>
        </div>
      </article>
    </Reveal>
  );
}
