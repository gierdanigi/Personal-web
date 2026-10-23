"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import type { ResolvedLink } from "@/lib/links";

/**
 * 링크 버튼. URL이면 새 탭으로 열고, 디스코드 아이디처럼 URL이 아니면 클릭 시 복사.
 */
export function ContactLink({
  link,
  className,
  children,
  showCopied = true,
}: {
  link: ResolvedLink;
  className?: string;
  children: ReactNode;
  showCopied?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  if (link.href) {
    const external = link.href.startsWith("http");
    return (
      <a
        href={link.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={className}
        title={link.label}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      title={`${link.label}: ${link.value} (클릭해서 복사)`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(link.value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          prompt(`${link.label} 아이디`, link.value);
        }
      }}
    >
      {copied && showCopied ? (
        <>
          <Check className="size-4" aria-hidden /> 복사됨
        </>
      ) : (
        children
      )}
    </button>
  );
}
