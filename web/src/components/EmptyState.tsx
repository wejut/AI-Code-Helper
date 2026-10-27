const SUGGESTIONS = [
  {
    title: 'Java SE',
    text: 'HashMap 的底层结构是什么？JDK 8 之后有哪些变化？',
  },
  {
    title: 'Spring',
    text: '说一下 Spring Bean 的生命周期，以及常见扩展点。',
  },
  {
    title: 'Maven',
    text: 'Maven 依赖冲突应该怎么排查？dependency mediation 是什么意思？',
  },
  {
    title: '面试题',
    text: '请出一道 Java 并发面试题，并给出参考答案和易错点。',
  },
]

interface EmptyStateProps {
  onPick: (text: string) => void
}

export function EmptyState({ onPick }: EmptyStateProps) {
  return (
    <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center px-2 py-10">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-clay-600">Java Knowledge</p>
      <h2 className="mt-3 text-balance font-serif text-4xl leading-tight text-ink-900 sm:text-5xl">
        从 Java 体系开始提问
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-7 text-ink-500 sm:text-base">
        检索 Java SE、Spring、Maven 等后端知识，查询开发工具语法，或直接要一道面试题。回答会按知识库内容实时流出。
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onPick(item.text)}
            className="rounded-2xl border border-ink-900/10 bg-white/80 px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-clay-500/40 hover:shadow-dock"
          >
            <span className="text-xs font-medium tracking-wide text-clay-600">{item.title}</span>
            <span className="mt-2 block text-sm leading-6 text-ink-900">{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
