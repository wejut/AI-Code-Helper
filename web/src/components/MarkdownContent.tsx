import { useEffect, useRef, useState, type ReactNode, isValidElement } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.min.css'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-body prose prose-stone max-w-none text-[15px] leading-7 prose-p:my-2 prose-headings:mb-2 prose-headings:mt-4 prose-headings:font-serif prose-headings:text-ink-900 prose-strong:text-ink-900 prose-a:text-clay-600 prose-pre:bg-transparent prose-pre:p-0 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
        components={{
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            )
          },
          pre({ children }) {
            return <CodeBlock>{children}</CodeBlock>
          },
        }}
      >
        {closeOpenFence(content)}
      </ReactMarkdown>
    </div>
  )
}

function closeOpenFence(source: string): string {
  const fenceCount = source.match(/```/g)?.length ?? 0
  if (fenceCount % 2 === 1) return `${source}\n\`\`\``
  return source
}

function CodeBlock({ children }: { children?: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const language = readLanguage(children)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1400)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    const text = preRef.current?.innerText ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="relative my-3">
      <div className="absolute right-2 top-2 flex items-center gap-2">
        {language && (
          <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-paper-200">
            {language}
          </span>
        )}
        <button
          type="button"
          onClick={copy}
          className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-paper-50 transition hover:bg-white/20"
        >
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre ref={preRef}>{children}</pre>
    </div>
  )
}

function readLanguage(children: ReactNode): string | null {
  const child = Array.isArray(children) ? children[0] : children
  if (!isValidElement<{ className?: string }>(child)) return null
  const className = child.props.className ?? ''
  const match = /language-([\w-]+)/.exec(className)
  return match?.[1] ?? null
}
