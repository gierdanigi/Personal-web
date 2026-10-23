import type { LinkItem } from "./types";
import { isUrl } from "./utils";

/** 관리자 페이지에서 고를 수 있는 링크 종류. key로 아이콘을 매핑함 */
export const LINK_PRESETS: { key: string; label: string; placeholder: string }[] = [
  { key: "github", label: "GitHub", placeholder: "https://github.com/아이디" },
  { key: "blog", label: "블로그", placeholder: "https://..." },
  { key: "velog", label: "velog", placeholder: "https://velog.io/@아이디" },
  { key: "tistory", label: "티스토리", placeholder: "https://아이디.tistory.com" },
  { key: "x", label: "X", placeholder: "https://x.com/아이디" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@채널" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/아이디" },
  { key: "twitch", label: "Twitch", placeholder: "https://twitch.tv/아이디" },
  { key: "chzzk", label: "치지직", placeholder: "https://chzzk.naver.com/..." },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
  { key: "notion", label: "Notion", placeholder: "https://..." },
  { key: "email", label: "이메일", placeholder: "you@example.com" },
  { key: "openchat", label: "오픈채팅", placeholder: "https://open.kakao.com/o/..." },
  { key: "discord", label: "디스코드", placeholder: "디스코드 아이디 또는 서버 초대 링크" },
  { key: "custom", label: "기타", placeholder: "https://..." },
];

export const CONTACT_KEYS = ["openchat", "discord"];

export type ResolvedLink = LinkItem & {
  /** 실제로 이동할 주소. 없으면 클릭 시 value를 복사 */
  href: string | null;
};

export function resolveLink(link: LinkItem): ResolvedLink {
  const value = link.value.trim();
  if (link.key === "email" && !value.startsWith("mailto:")) {
    return { ...link, href: `mailto:${value}` };
  }
  return { ...link, href: isUrl(value) || value.startsWith("mailto:") ? value : null };
}

export function getContactLinks(links: LinkItem[]) {
  return links.filter((l) => CONTACT_KEYS.includes(l.key) && l.value.trim()).map(resolveLink);
}
