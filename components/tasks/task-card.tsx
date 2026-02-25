import { cn } from '@/lib/utils'
import type { Task, TaskPriority, TaskStatus } from '@/types/task'
import { PRIORITY_LABELS, STATUS_LABELS } from '@/types/task'
import { Button } from '@/components/ui/button'
import { IconEdit } from '@tabler/icons-react'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700'
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700'
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-medium">{task.title}</h3>
        <div className="flex gap-2 items-center">
          <span className={cn('px-2 py-1 rounded text-xs font-medium', PRIORITY_COLORS[task.priority])}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className={cn('px-2 py-1 rounded text-xs font-medium', STATUS_COLORS[task.status])}>
            {STATUS_LABELS[task.status]}
          </span>
          {onEdit && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onEdit(task)}
              className="h-6 w-6"
            >
              <IconEdit className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>截止日期: {new Date(task.dueDate).toLocaleDateString('zh-CN')}</span>
      </div>
    </div>
  )
}
