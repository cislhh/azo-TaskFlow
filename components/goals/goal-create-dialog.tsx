'use client'

import { GoalFormDialog } from './goal-form-dialog'

interface GoalCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

/**
 * 向后兼容的创建目标对话框组件
 * 实际使用 GoalFormDialog 组件，固定为创建模式
 */
export function GoalCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: GoalCreateDialogProps) {
  return (
    <GoalFormDialog
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      onSuccess={onSuccess}
    />
  )
}
