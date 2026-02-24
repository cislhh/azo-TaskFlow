'use client'

import Link from 'next/link'
import { useUIStore } from '@/lib/stores/ui'
import { cn } from '@/lib/utils'

interface AsideProps {
  className?: string
}

const navItems = [
  { href: '/', label: '任务总览', value: 'dashboard' },
  { href: '/tasks/daily', label: '日常任务', value: 'daily' },
  { href: '/tasks/weekly', label: '周任务', value: 'weekly' }
] as const

export function Aside({ className }: AsideProps) {
  const currentView = useUIStore((state) => state.currentView)

  return (
    <aside className={cn('border-r bg-gray-50 p-4', className)}>
      <nav className="grid gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentView === item.value
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
