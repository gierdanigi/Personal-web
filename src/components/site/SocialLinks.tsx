import { resolveLink } from "@/lib/links";
import type { LinkItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ContactLink } from "./ContactLink";
import { LinkIcon } from "./LinkIcon";

/** 아이콘만 있는 링크 줄 (메인 · 푸터) */
export function SocialLinks({ links, className }: { links: LinkItem[]; className?: string }) {
  const items = links.filter((l) => l.value.trim()).map(resolveLink);
  if (!items.length) return null;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((link, i) => (
        <li key={`${link.key}-${i}`}>
          <ContactLink
            link={link}
            showCopied={false}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-line bg-card text-foreground/70 transition hover:border-accent/40 hover:text-accent"
          >
            <LinkIcon name={link.key} className="size-[18px]" />
            <span className="sr-only">{link.label}</span>
          </ContactLink>
        </li>
      ))}
    </ul>
  );
}

/** 오픈채팅 · 디스코드 문의 버튼 */
export function ContactButtons({
  links,
  size = "md",
  className,
}: {
  links: LinkItem[];
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const contacts = links.filter((l) => ["openchat", "discord"].includes(l.key) && l.value.trim()).map(resolveLink);
  if (!contacts.length) return null;

  const sizeClass = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  }[size];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {contacts.map((link, i) => (
        <ContactLink
          key={`${link.key}-${i}`}
          link={link}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl font-semibold transition",
            sizeClass,
            link.key === "openchat"
              ? "bg-[#FEE500] text-[#191600] hover:brightness-95"
              : "bg-[#5865F2] text-white hover:brightness-110",
          )}
        >
          <LinkIcon name={link.key} className="size-4" />
          {link.label || (link.key === "openchat" ? "오픈채팅" : "디스코드")}
          {!link.href && size !== "sm" && <span className="font-normal opacity-80">{link.value}</span>}
        </ContactLink>
      ))}
    </div>
  );
}
