import { cn, getYouTubeId, isYouTubeShorts } from "@/lib/utils";

export function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const id = getYouTubeId(url);
  if (!id) return null;
  const shorts = isYouTubeShorts(url);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-black shadow-sm",
        shorts ? "mx-auto aspect-[9/16] w-full max-w-sm" : "aspect-video w-full",
      )}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title={title}
        className="size-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
