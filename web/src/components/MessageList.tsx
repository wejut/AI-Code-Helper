import type { RefObject } from 'react'
import type { ChatMessage } from '../types'
import { EmptyState } from './EmptyState'
import { MarkdownContent } from './MarkdownContent'

interface MessageListProps {
  messages: ChatMessage[]
  listRef: RefObject<HTMLDivElement>
  onPick: (text: string) => void
}

export function MessageList({ messages, listRef, onPick }: MessageListProps) {
  return (
    <main ref={listRef} className="message-scroll min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-6 sm:px-6">
        {messages.length === 0 ? (
          <EmptyState onPick={onPick} />
        ) : (
          <div className="flex flex-col gap-6" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function MessageItem({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <article className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <span
        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-medium ${
          isUser ? 'bg-ink-900 text-paper-50' : 'bg-clay-500 text-white'
        }`}
      >
        {isUser ? '我' : '库'}
      </span>
      <div
        className={`min-w-0 max-w-[85%] overflow-hidden rounded-2xl px-4 py-3 sm:max-w-[78%] ${
          isUser
            ? 'rounded-br-md bg-ink-900 text-paper-50'
            : 'rounded-bl-md border border-ink-900/8 bg-white text-ink-900 shadow-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words text-[15px] leading-7">{message.content}</p>
        ) : message.status === 'streaming' && message.content.length === 0 ? (
          <p className="text-sm text-ink-500">正在查阅知识库…</p>
        ) : (
          <>
            {message.content && <MarkdownContent content={message.content} />}
            {message.status === 'streaming' && message.content.length > 0 && (
              <span className="stream-caret" aria-hidden="true" />
            )}
          </>
        )}
        {message.error && (
          <p className={`text-sm leading-6 text-red-700 ${message.content ? 'mt-3' : ''}`}>
            {message.error}
          </p>
        )}
      </div>
    </article>
  )
}
