'use client'

import { Button } from '@/components/ui/button'

interface TaskCreateButtonProps {
  type: 'daily' | 'weekly'
  onClick?: () => void
  children?: React.ReactNode
}

export function TaskCreateButton({
  type,
  onClick,
  children,
}: TaskCreateButtonProps) {
  // type prop 可用于未来的自定义行为（如不同的按钮文本）
  return (
    <Button onClick={onClick}>
      {children || '创建任务'}
    </Button>
  )
}
