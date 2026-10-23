import { getProfile, getProjectBySlug } from "@/lib/queries";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "프로젝트";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, profile] = await Promise.all([getProjectBySlug(slug), getProfile()]);
  return renderOgImage({
    eyebrow: project?.tech_stack.slice(0, 4).join(" · ") || "Project",
    title: project?.title ?? "프로젝트",
    description: project?.summary,
    siteName: profile.nickname || profile.name || "Portfolio",
  });
}
