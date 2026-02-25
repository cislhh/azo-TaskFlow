'use client'

import { Button } from '@/components/ui/button'

interface GoalCreateButtonProps {
  onClick?: () => void
  children?: React.ReactNode
}

export function GoalCreateButton({
  onClick,
  children,
}: GoalCreateButtonProps) {
  return (
    <Button onClick={onClick}>
      {children || '创建目标'}
    </Button>
  )
}
