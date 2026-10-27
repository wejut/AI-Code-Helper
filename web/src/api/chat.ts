import { createSseParser } from '../lib/parseSse'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export function buildChatUrl(memoryId: number, message: string): string {
  const params = new URLSearchParams({
    memoryId: String(memoryId),
    message,
  })
  return `${API_BASE_URL}/ai/chat?${params.toString()}`
}

interface StreamChatOptions {
  memoryId: number
  message: string
  signal: AbortSignal
  onChunk: (chunk: string) => void
}

export async function streamChat({
  memoryId,
  message,
  signal,
  onChunk,
}: StreamChatOptions): Promise<void> {
  let response: Response
  try {
    response = await fetch(buildChatUrl(memoryId, message), {
      method: 'GET',
      headers: { Accept: 'text/event-stream' },
      cache: 'no-store',
      signal,
    })
  } catch (error) {
    if (signal.aborted) throw error
    throw new Error('无法连接知识库服务，请确认后端已在 http://localhost:8081 启动。')
  }

  if (!response.ok) {
    const detail = (await response.text()).trim()
    const friendly =
      !detail || detail.includes('<') || detail.length > 300
        ? `知识库服务响应异常（${response.status}）。请确认后端已在 http://localhost:8081 启动。`
        : detail
    throw new Error(friendly)
  }

  if (!response.body) {
    throw new Error('浏览器没有拿到可读的响应流。')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  const parser = createSseParser()

  const emit = (pieces: string[]) => {
    for (const piece of pieces) onChunk(piece)
  }

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      emit(parser.push(decoder.decode(value, { stream: true })))
    }
    emit(parser.push(decoder.decode()))
    emit(parser.flush())
  } finally {
    reader.releaseLock()
  }
}
