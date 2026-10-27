/**
 * Spring 的 SseEmitter 写出的帧是 `data:` 紧贴正文，换行会被改写成新的 `data:` 行。
 * 这里按 SSE 事件边界（空行）拆帧，并把同一事件里的 data 行用换行拼回去。
 * 不去掉 data 后面的空格，否则模型按 token 流式返回时，行首空格会被吃掉。
 */
export function createSseParser() {
  let buffer = ''

  const consume = (flush: boolean): string[] => {
    let text = buffer
    let hold = ''
    if (!flush && text.endsWith('\r')) {
      hold = '\r'
      text = text.slice(0, -1)
    }
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

    const blocks = text.split('\n\n')
    if (!flush) {
      buffer = (blocks.pop() ?? '') + hold
    } else {
      buffer = ''
    }

    const pieces: string[] = []
    for (const block of blocks) {
      const data = extractData(block)
      if (data !== null) pieces.push(data)
    }
    return pieces
  }

  return {
    push(chunk: string): string[] {
      buffer += chunk
      return consume(false)
    },
    flush(): string[] {
      return consume(true)
    },
  }
}

function extractData(block: string): string | null {
  const dataLines: string[] = []
  let hasData = false

  for (const line of block.split('\n')) {
    if (line.startsWith('data:')) {
      hasData = true
      dataLines.push(line.slice(5))
      continue
    }
  }

  if (!hasData) return null
  return unwrapSpringEvent(dataLines.join('\n'))
}

function unwrapSpringEvent(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return raw

  try {
    const parsed: unknown = JSON.parse(trimmed)
    if (!parsed || typeof parsed !== 'object') return raw
    const record = parsed as Record<string, unknown>
    const data = record.data
    const keys = Object.keys(record)
    const allowed = ['id', 'event', 'retry', 'comment', 'data']
    if (typeof data === 'string' && keys.every((key) => allowed.includes(key))) return data
    return raw
  } catch {
    return raw
  }
}
