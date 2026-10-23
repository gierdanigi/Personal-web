"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { uploadImage } from "@/lib/upload";
import type { ImageItem } from "@/lib/types";
import { SortableList } from "./SortableList";

function useUploader(folder: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (files: File[]) => {
    setUploading(true);
    setError(null);
    try {
      const results = [];
      for (const file of files) results.push(await uploadImage(file, folder));
      return results;
    } catch (e) {
      setError(e instanceof Error ? e.message : "업로드에 실패했어요.");
      return [];
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, upload };
}

/** 이미지 1장 (아바타 · 썸네일) */
export function SingleImageField({
  url,
  folder,
  onChange,
  aspect = "aspect-video",
  rounded = "rounded-xl",
}: {
  url: string | null;
  folder: string;
  onChange: (next: { url: string; path: string } | null) => void;
  aspect?: string;
  rounded?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploading, error, upload } = useUploader(folder);

  return (
    <div>
      <div className="flex items-end gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`relative ${aspect} w-40 shrink-0 overflow-hidden ${rounded} border border-dashed border-line bg-soft text-muted hover:border-accent`}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-xs">
              <ImagePlus className="size-5" />
              이미지 선택
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="size-5 animate-spin text-accent" />
            </span>
          )}
        </button>
        <div className="flex flex-col gap-2">
          <button type="button" className="btn-outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
            <Upload className="size-4" /> {url ? "변경" : "업로드"}
          </button>
          {url && (
            <button type="button" className="btn-ghost text-red-600" onClick={() => onChange(null)}>
              <Trash2 className="size-4" /> 제거
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const [result] = await upload([file]);
          if (result) onChange(result);
        }}
      />
    </div>
  );
}

/** 여러 장 (프로젝트 이미지) — 드래그로 순서 변경, 캡션 입력 */
export function MultiImageField({
  images,
  folder,
  onChange,
}: {
  images: ImageItem[];
  folder: string;
  onChange: (images: ImageItem[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploading, error, upload } = useUploader(folder);

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <SortableList
          items={images}
          getId={(img) => img.path || img.url}
          onReorder={onChange}
          className="space-y-2"
          renderItem={(img, handle, index) => (
            <div className="flex items-center gap-2 rounded-xl border border-line bg-card p-2">
              {handle}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="aspect-video w-28 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                {index === 0 && <span className="tag mb-1 bg-accent-soft text-accent">대표 이미지</span>}
                <input
                  className="input"
                  value={img.caption}
                  placeholder="캡션 (선택)"
                  onChange={(e) =>
                    onChange(images.map((it, i) => (i === index ? { ...it, caption: e.target.value } : it)))
                  }
                />
              </div>
              <button
                type="button"
                aria-label="이미지 삭제"
                className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
                onClick={() => onChange(images.filter((_, i) => i !== index))}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          )}
        />
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-soft/50 py-6 text-sm text-muted hover:border-accent hover:text-accent"
      >
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
        {uploading ? "업로드 중…" : "이미지 추가 (여러 장 선택 가능)"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (!files.length) return;
          const results = await upload(files);
          onChange([...images, ...results.map((r) => ({ ...r, caption: "" }))]);
        }}
      />
    </div>
  );
}
