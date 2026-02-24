'use client'

import { Button } from '@/components/ui/button'
import { useUIStore } from '@/lib/stores/ui'

interface TaskCreateButtonProps {
  type: 'daily' | 'weekly'
}

export function TaskCreateButton({ type }: TaskCreateButtonProps) {
  const setIsOpen = useUIStore((state) => state.setCreateDialogOpen)

  return (
    <Button onClick={() => setIsOpen(true)}>
      创建任务
    </Button>
  )
}
