import "server-only";
import { ImageResponse } from "next/og";
import { cacheLife } from "next/cache";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * 한글 글리프가 필요한 글자만 Google Fonts에서 받아옴 (satori 기본 폰트는 한글 미지원).
 * 실패하면 null → 기본 폰트로 렌더링.
 */
async function loadKoreanFont(text: string): Promise<string | null> {
  "use cache";
  cacheLife("max");
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`,
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const buffer = await fetch(url).then((r) => r.arrayBuffer());
    return Buffer.from(buffer).toString("base64");
  } catch {
    return null;
  }
}

export async function renderOgImage({
  eyebrow,
  title,
  description,
  siteName,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  siteName: string;
}) {
  const text = `${eyebrow}${title}${description ?? ""}${siteName}`;
  const font = await loadKoreanFont(text);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #eef0ff 0%, #f6f7f9 55%, #ffffff 100%)",
          color: "#16181d",
          fontFamily: font ? "NotoSansKR" : undefined,
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#4f5bd5", fontWeight: 700 }}>{eyebrow}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: title.length > 24 ? 64 : 80, fontWeight: 700, lineHeight: 1.15 }}>
            {title}
          </div>
          {description && (
            <div style={{ display: "flex", fontSize: 32, color: "#6b7280", lineHeight: 1.4 }}>
              {description.length > 70 ? `${description.slice(0, 70)}…` : description}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, fontWeight: 700 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: "#4f5bd5" }} />
          {siteName}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font ? [{ name: "NotoSansKR", data: Buffer.from(font, "base64"), weight: 700, style: "normal" }] : undefined,
    },
  );
}
