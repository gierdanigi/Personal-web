"use client";

import { useState } from "react";
import Image from "next/image";
import type { ImageItem } from "@/lib/types";
import { cn } from "@/lib/utils";

/** 프로젝트 이미지: 큰 이미지 + 썸네일 선택 */
export function Gallery({ images, title }: { images: ImageItem[]; title: string }) {
  const [index, setIndex] = useState(0);
  if (!images.length) return null;
  const current = images[Math.min(index, images.length - 1)];

  return (
    <figure className="space-y-3">
      <div className="card relative aspect-video overflow-hidden">
        <Image
          src={current.url}
          alt={current.caption || title}
          fill
          sizes="(min-width: 1024px) 960px, 100vw"
          className="object-contain"
          priority={index === 0}
        />
      </div>
      {current.caption && <figcaption className="text-center text-sm text-muted">{current.caption}</figcaption>}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.path || img.url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}번째 이미지`}
              aria-current={i === index}
              className={cn(
                "relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg border-2 transition sm:w-28",
                i === index ? "border-accent" : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <Image src={img.url} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </figure>
  );
}
