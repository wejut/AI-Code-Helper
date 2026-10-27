export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  status: 'streaming' | 'done' | 'error'
  error?: string
}
