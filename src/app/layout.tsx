import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { cacheLife } from "next/cache";
import { getProfile } from "@/lib/queries";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  "use cache";
  cacheLife("days");
  const profile = await getProfile();
  const siteName = profile.nickname || profile.name || "Portfolio";
  const description = profile.headline || "영상 편집 · 웹 개발 포트폴리오";

  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${siteName} — 포트폴리오`, template: `%s | ${siteName}` },
    description,
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName,
      title: siteName,
      description,
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#f6f7f9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {/* JS가 꺼져 있으면 페이드인 없이 바로 보이게 */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
