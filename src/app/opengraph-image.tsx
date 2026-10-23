import { getProfile } from "@/lib/queries";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "포트폴리오 · 커미션";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const profile = await getProfile();
  const siteName = profile.nickname || profile.name || "Portfolio";
  return renderOgImage({
    eyebrow: "포트폴리오 · 커미션",
    title: [profile.name, profile.nickname].filter(Boolean).join(" · ") || siteName,
    description: profile.headline,
    siteName,
  });
}
