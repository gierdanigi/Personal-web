export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** "2025-03-01" → "2025.03" */
export function formatMonth(date: string | null | undefined) {
  if (!date) return "";
  const [y, m] = date.split("-");
  return m ? `${y}.${m}` : y;
}

/** "2025-03-01" → "2025.03.01" */
export function formatDate(date: string | null | undefined) {
  if (!date) return "";
  return date.slice(0, 10).replaceAll("-", ".");
}

export function formatPeriod(start: string | null, end: string | null, ongoing: boolean) {
  const s = formatMonth(start);
  const e = ongoing ? "진행 중" : formatMonth(end);
  if (!s && !e) return "";
  if (s && e && s === e) return s;
  return `${s}${s || e ? " ~ " : ""}${e}`.trim();
}

/** 유튜브 URL(watch, youtu.be, shorts, embed, live)에서 영상 ID 추출 */
export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const v = u.searchParams.get("v");
      if (v) return v;
      const match = u.pathname.match(/^\/(?:shorts|embed|live|v)\/([\w-]{6,})/);
      return match?.[1] ?? null;
    }
  } catch {
    // URL이 아님
  }
  return null;
}

export function isYouTubeShorts(url: string | null | undefined) {
  return Boolean(url && /youtube\.com\/shorts\//.test(url));
}

export function youTubeThumbnail(url: string | null | undefined) {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** 영문 · 숫자 제목에서 slug 추천. 한글만 있으면 빈 문자열 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

/** 마크다운 문법을 걷어낸 짧은 설명 (메타 description 용) */
export function plainExcerpt(markdown: string, length = 140) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

export function siteUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");
  return url.replace(/\/$/, "");
}
