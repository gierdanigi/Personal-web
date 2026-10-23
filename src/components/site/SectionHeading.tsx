import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  title,
  description,
  href,
  linkLabel = "전체 보기",
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted hover:text-accent">
          {linkLabel} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

export function PageTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8 sm:mb-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description && <p className="mt-2 text-foreground/60">{description}</p>}
    </div>
  );
}
