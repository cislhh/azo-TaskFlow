'use client'

import { useState, useEffect } from 'react'
import { TaskList } from '@/components/tasks/task-list'
import { TaskCreateButton } from '@/components/tasks/task-create-button'
import { TaskCreateDialog } from '@/components/tasks/task-create-dialog'
import { getTasks } from '@/lib/actions/tasks'
import { startOfDay, endOfDay } from 'date-fns'
import type { Task } from '@/types/task'

export default function DailyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 初始加载任务
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setIsLoading(true)
    const today = new Date()
    const fetchedTasks = await getTasks({
      startDate: startOfDay(today),
      endDate: endOfDay(today)
    })
    setTasks(fetchedTasks)
    setIsLoading(false)
  }

  const handleCreateSuccess = () => {
    // 刷新任务列表
    loadTasks()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">日常任务</h2>
        <TaskCreateButton onClick={() => setIsDialogOpen(true)} />
      </div>
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : (
        <TaskList tasks={tasks} onRefresh={loadTasks} />
      )}
      <TaskCreateDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}
