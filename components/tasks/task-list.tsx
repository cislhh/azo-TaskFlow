import type { Task } from '@/types/task'
import { TaskCard } from './task-card'

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        暂无任务
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
