import { useEffect, useRef } from 'react'

interface ChatInputProps {
  value: string
  streaming: boolean
  onChange: (value: string) => void
  onSend: () => void
  onStop: () => void
}

export function ChatInput({ value, streaming, onChange, onSend, onStop }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const canSend = value.trim().length > 0 && !streaming

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 168)}px`
  }, [value])

  return (
    <footer className="shrink-0 bg-gradient-to-t from-paper-100 via-paper-100 to-transparent px-4 pb-4 pt-2 sm:px-6">
      <form
        className="mx-auto max-w-3xl"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSend) onSend()
        }}
      >
        <div className="rounded-3xl border border-ink-900/10 bg-white p-2 shadow-dock">
          <label htmlFor="question" className="sr-only">
            向知识库提问
          </label>
          <textarea
            id="question"
            ref={textareaRef}
            rows={1}
            value={value}
            placeholder="询问 Java、Spring、Maven，或让我出一道面试题"
            className="max-h-40 w-full resize-none bg-transparent px-3 py-2 text-[15px] leading-7 text-ink-900 outline-none placeholder:text-ink-500/70"
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' || event.shiftKey) return
              if (event.nativeEvent.isComposing) return
              event.preventDefault()
              if (canSend) onSend()
            }}
          />
          <div className="flex items-center justify-between gap-3 px-2 pb-1">
            <p className="text-xs text-ink-500">
              Enter 发送，Shift + Enter 换行
              {streaming ? ' · 回答完成后才能再次发送' : ''}
            </p>
            <div className="flex items-center gap-2">
              {streaming && (
                <button
                  type="button"
                  onClick={onStop}
                  className="rounded-full px-3 py-1.5 text-sm text-ink-700 transition hover:bg-paper-200"
                >
                  停止生成
                </button>
              )}
              <button
                type="submit"
                disabled={!canSend}
                className="rounded-full bg-clay-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-clay-600 disabled:cursor-not-allowed disabled:bg-ink-900/15 disabled:text-ink-500"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </form>
    </footer>
  )
}
