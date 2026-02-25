'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AsideProps {
  className?: string
}

const navItems = [
  { href: '/', label: '任务总览' },
  { href: '/tasks/daily', label: '日常任务' },
  { href: '/tasks/weekly', label: '周任务' }
] as const

export function Aside({ className }: AsideProps) {
  const pathname = usePathname()

  return (
    <aside className={cn('border-r bg-gray-50 p-4', className)}>
      <nav className="grid gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
