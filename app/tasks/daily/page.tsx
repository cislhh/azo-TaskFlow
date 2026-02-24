import { TaskList } from '@/components/tasks/task-list'
import { TaskCreateButton } from '@/components/tasks/task-create-button'
import { getTasks } from '@/lib/actions/tasks'
import { startOfDay, endOfDay } from 'date-fns'

export default async function DailyTasksPage() {
  const today = new Date()
  const tasks = await getTasks({
    startDate: startOfDay(today),
    endDate: endOfDay(today)
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">日常任务</h2>
        <TaskCreateButton type="daily" />
      </div>
      <TaskList tasks={tasks} />
    </div>
  )
}
