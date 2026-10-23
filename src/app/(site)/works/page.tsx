import type { Metadata } from "next";
import { Suspense } from "react";
import { Reveal } from "@/components/site/Reveal";
import { PageTitle } from "@/components/site/SectionHeading";
import { WorkGrid, WorksBrowser } from "@/components/site/WorksBrowser";
import { getPublicWorks } from "@/lib/queries";

export const metadata: Metadata = {
  title: "작업물",
  description: "영상 편집 작업물 갤러리",
};

export default async function WorksPage() {
  const works = await getPublicWorks();

  return (
    <>
      <Reveal>
        <PageTitle title="작업물" description="영상 편집 작업물이에요." />
      </Reveal>
      <Suspense fallback={<WorkGrid works={works} />}>
        <WorksBrowser works={works} />
      </Suspense>
    </>
  );
}
