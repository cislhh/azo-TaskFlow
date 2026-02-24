import { TaskList } from '@/components/tasks/task-list'
import { TaskCreateButton } from '@/components/tasks/task-create-button'
import { getTasks } from '@/lib/actions/tasks'
import { startOfWeek, endOfWeek } from 'date-fns'

export default async function WeeklyTasksPage() {
  const now = new Date()
  const tasks = await getTasks({
    startDate: startOfWeek(now),
    endDate: endOfWeek(now)
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">周任务</h2>
        <TaskCreateButton type="weekly" />
      </div>
      <TaskList tasks={tasks} />
    </div>
  )
}
