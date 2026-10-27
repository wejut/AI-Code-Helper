interface HeaderProps {
  memoryId: number
  onNewSession: () => void
}

export function Header({ memoryId, onNewSession }: HeaderProps) {
  return (
    <header className="shrink-0 border-b border-white/10 bg-ink-950 text-paper-50">
      <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-clay-500 font-serif text-lg text-white">
            知
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-serif text-base leading-snug tracking-tight sm:text-xl">
              Java 与开发技术智能知识库
            </h1>
            <p className="truncate font-mono text-[11px] text-paper-200/70">会话 {memoryId}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNewSession}
          className="shrink-0 rounded-full border border-paper-50/25 px-4 py-1.5 text-sm text-paper-50 transition hover:border-paper-50 hover:bg-white/10"
        >
          新建会话
        </button>
      </div>
    </header>
  )
}
