import { cn } from '@/lib/utils'

interface TaskStatsProps {
  stats: {
    total: number
    urgent: number
    incomplete: number
    inProgress: number
    completedToday: number
  }
}

export function TaskStats({ stats }: TaskStatsProps) {
  const items = [
    { label: '总任务数', value: stats.total, color: 'bg-blue-50 text-blue-700' },
    { label: '紧急任务', value: stats.urgent, color: 'bg-red-50 text-red-700' },
    { label: '未完成', value: stats.incomplete, color: 'bg-gray-50 text-gray-700' },
    { label: '进行中', value: stats.inProgress, color: 'bg-yellow-50 text-yellow-700' },
    { label: '今日完成', value: stats.completedToday, color: 'bg-green-50 text-green-700' }
  ]

  return (
    <div className="border rounded-lg p-4 bg-white h-full">
      <h3 className="text-lg font-semibold mb-4">任务总览</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className={cn('p-4 rounded-lg', item.color)}>
            <div className="text-sm opacity-80">{item.label}</div>
            <div className="text-3xl font-bold mt-1">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
