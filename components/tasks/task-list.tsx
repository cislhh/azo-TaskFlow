'use client'

import { useState } from 'react'
import type { Task } from '@/types/task'
import { TaskCard } from './task-card'
import { TaskFormDialog } from './task-form-dialog'

interface TaskListProps {
  tasks: Task[]
  onRefresh?: () => void
}

export function TaskList({ tasks, onRefresh }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingTask(null)
    onRefresh?.()
  }

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      setEditingTask(null)
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        暂无任务
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={handleEdit} />
        ))}
      </div>

      {/* 编辑对话框 */}
      {editingTask && (
        <TaskFormDialog
          open={isEditDialogOpen}
          onOpenChange={handleEditDialogChange}
          mode="edit"
          task={editingTask}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  )
}
