import { TaskPieChart } from '@/components/dashboard/task-pie-chart'
import { TaskStats } from '@/components/dashboard/task-stats'
import { TaskLineChart } from '@/components/dashboard/task-line-chart'
import { getTaskStats } from '@/lib/actions/stats'

export default async function DashboardPage() {
  const stats = await getTaskStats()

  return (
    <div className="grid grid-rows-[300px_1fr] gap-4 p-6">
      {/* 上半部分 */}
      <div className="grid grid-cols-2 gap-4">
        <TaskPieChart data={stats.byStatus} />
        <TaskStats stats={stats} />
      </div>

      {/* 下半部分 */}
      <TaskLineChart data={stats.completionTrend} />
    </div>
  )
}
