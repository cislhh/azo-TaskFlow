import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const today = new Date()
  const dateStr = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className={cn('h-16 border-b bg-white px-6 flex items-center justify-between', className)}>
      <h1 className="text-xl font-semibold">任务管理系统</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{dateStr}</span>
      </div>
    </header>
  )
}
