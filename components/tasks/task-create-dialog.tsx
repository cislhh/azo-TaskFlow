'use client'

import { TaskFormDialog } from './task-form-dialog'

interface TaskCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: 'daily' | 'weekly'
  onSuccess?: () => void
}

/**
 * 向后兼容的创建任务对话框组件
 * 实际使用 TaskFormDialog 组件，固定为创建模式
 */
export function TaskCreateDialog({
  open,
  onOpenChange,
  type,
  onSuccess,
}: TaskCreateDialogProps) {
  return (
    <TaskFormDialog
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      type={type}
      onSuccess={onSuccess}
    />
  )
}
