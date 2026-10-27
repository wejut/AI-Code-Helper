const MIN_MEMORY_ID = 100_000
const MAX_MEMORY_ID = 999_999

export function createMemoryId(): number {
  const span = MAX_MEMORY_ID - MIN_MEMORY_ID + 1
  return Math.floor(Math.random() * span) + MIN_MEMORY_ID
}
