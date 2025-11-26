"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface MarkdownProps {
  content: string
  className?: string
}

/**
 * Renders markdown content with proper styling for chat messages.
 * Supports GitHub Flavored Markdown (tables, strikethrough, etc.)
 */
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Override default element styles for chat context
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),
        h1: ({ children }) => (
          <h1 className="mb-2 mt-4 text-lg font-semibold first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-2 mt-3 text-base font-semibold first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-1 mt-2 text-sm font-semibold first:mt-0">{children}</h3>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className
          if (isInline) {
            return (
              <code
                className="rounded bg-muted px-1 py-0.5 font-mono text-xs"
                {...props}
              >
                {children}
              </code>
            )
          }
          return (
            <code
              className={cn(
                "block overflow-x-auto rounded-md bg-muted p-2 font-mono text-xs",
                className
              )}
              {...props}
            >
              {children}
            </code>
          )
        },
        pre: ({ children }) => (
          <pre className="mb-2 overflow-x-auto rounded-md bg-muted p-0 last:mb-0">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-2 border-l-2 border-muted-foreground/30 pl-3 italic last:mb-0">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        hr: () => <hr className="my-3 border-muted" />,
        table: ({ children }) => (
          <div className="mb-2 overflow-x-auto last:mb-0">
            <table className="min-w-full text-xs">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-muted">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-2 py-1 text-left font-semibold">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-2 py-1">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  )
}
