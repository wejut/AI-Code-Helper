import { useCallback, useEffect, useRef, useState } from 'react'
import { streamChat } from './api/chat'
import { ChatInput } from './components/ChatInput'
import { Header } from './components/Header'
import { MessageList } from './components/MessageList'
import { createMemoryId } from './lib/memoryId'
import type { ChatMessage } from './types'

export default function App() {
  const [memoryId, setMemoryId] = useState(createMemoryId)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [streaming, setStreaming] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const streamingRef = useRef(false)
  const memoryIdRef = useRef(memoryId)
  memoryIdRef.current = memoryId

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    list.scrollTop = list.scrollHeight
  }, [messages])

  const finishStream = useCallback((controller: AbortController) => {
    if (abortRef.current !== controller) return
    abortRef.current = null
    streamingRef.current = false
    setStreaming(false)
  }, [])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    streamingRef.current = false
    setStreaming(false)
    setMessages((current) =>
      current.flatMap((message) => {
        if (message.status !== 'streaming') return [message]
        if (!message.content) return []
        return [{ ...message, status: 'done' as const }]
      }),
    )
  }, [])

  const newSession = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    streamingRef.current = false
    setStreaming(false)
    setMessages([])
    setDraft('')
    setMemoryId(createMemoryId())
  }, [])

  const send = useCallback(
    async (text: string) => {
      const content = text.trim()
      if (!content || streamingRef.current) return

      const controller = new AbortController()
      abortRef.current = controller
      streamingRef.current = true
      setStreaming(true)

      const assistantId = crypto.randomUUID()
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'user', content, status: 'done' },
        { id: assistantId, role: 'assistant', content: '', status: 'streaming' },
      ])
      setDraft('')

      try {
        await streamChat({
          memoryId: memoryIdRef.current,
          message: content,
          signal: controller.signal,
          onChunk: (chunk) => {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId
                  ? { ...message, content: message.content + chunk }
                  : message,
              ),
            )
          },
        })
        if (!controller.signal.aborted) {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId ? { ...message, status: 'done' } : message,
            ),
          )
        }
      } catch (error) {
        if (controller.signal.aborted) return
        const detail = error instanceof Error ? error.message : '请求失败'
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, status: 'error', error: detail }
              : message,
          ),
        )
      } finally {
        finishStream(controller)
      }
    },
    [finishStream],
  )

  return (
    <div className="flex h-full flex-col bg-paper-100 text-ink-900">
      <Header memoryId={memoryId} onNewSession={newSession} />
      <MessageList listRef={listRef} messages={messages} onPick={(text) => void send(text)} />
      <ChatInput
        value={draft}
        streaming={streaming}
        onChange={setDraft}
        onSend={() => void send(draft)}
        onStop={stop}
      />
    </div>
  )
}
