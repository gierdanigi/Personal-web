import { createClient } from "./supabase/client";
import { STORAGE_BUCKET } from "./supabase/env";

const MAX_SIDE = 2000;

/** 큰 이미지는 브라우저에서 줄이고 webp로 변환 (gif는 애니메이션 유지를 위해 그대로) */
async function optimize(file: File): Promise<{ blob: Blob; ext: string }> {
  const passthroughExt = file.name.split(".").pop()?.toLowerCase() || "bin";
  if (file.type === "image/gif" || !file.type.startsWith("image/")) {
    return { blob: file, ext: passthroughExt };
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
    if (blob && blob.size < file.size) return { blob, ext: "webp" };
  } catch {
    // 변환 실패 시 원본 업로드
  }
  return { blob: file, ext: passthroughExt };
}

export async function uploadImage(file: File, folder: string) {
  const supabase = createClient();
  const { blob, ext } = await optimize(file);
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, blob, {
    contentType: blob.type || file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(`업로드 실패: ${error.message}`);

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}
