import { getProfile, getWorkBySlug } from "@/lib/queries";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "작업물";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [work, profile] = await Promise.all([getWorkBySlug(slug), getProfile()]);
  return renderOgImage({
    eyebrow: work?.menu?.name || "영상 작업물",
    title: work?.title ?? "작업물",
    siteName: profile.nickname || profile.name || "Portfolio",
  });
}
