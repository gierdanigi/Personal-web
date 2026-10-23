import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none prose-headings:tracking-tight prose-h2:mt-10 prose-h2:border-b prose-h2:border-line prose-h2:pb-2 prose-a:text-accent prose-img:rounded-xl prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-soft prose-code:px-1 prose-code:py-0.5 prose-code:font-medium prose-pre:rounded-xl",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ href, children, ...props }) => (
            <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" {...props}>
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
