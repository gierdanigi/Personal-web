import type { Metadata } from "next";
import { Suspense } from "react";
import { PageTitle } from "@/components/site/SectionHeading";
import { WorkGrid, WorksBrowser } from "@/components/site/WorksBrowser";
import { getPublicWorks } from "@/lib/queries";

export const metadata: Metadata = {
  title: "작업물",
  description: "영상 편집 · 개발 커미션 작업물 갤러리",
};

export default async function WorksPage() {
  const works = await getPublicWorks();

  return (
    <>
      <PageTitle title="작업물" description="영상 편집과 개발 커미션 샘플이에요." />
      <Suspense fallback={<WorkGrid works={works} />}>
        <WorksBrowser works={works} />
      </Suspense>
    </>
  );
}
