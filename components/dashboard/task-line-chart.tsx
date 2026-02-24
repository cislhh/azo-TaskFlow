'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TaskLineChartProps {
  data: Array<{ date: string; daily: number; weekly: number; urgent: number }>
}

export function TaskLineChart({ data }: TaskLineChartProps) {
  return (
    <div className="border rounded-lg p-4 bg-white h-full">
      <h3 className="text-lg font-semibold mb-4">完成任务趋势</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Line type="monotone" dataKey="daily" stroke="#3b82f6" name="日常任务" strokeWidth={2} />
          <Line type="monotone" dataKey="weekly" stroke="#8b5cf6" name="周任务" strokeWidth={2} />
          <Line type="monotone" dataKey="urgent" stroke="#ef4444" name="紧急任务" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
