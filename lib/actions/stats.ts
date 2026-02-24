'use server'

import { prisma } from '@/lib/db'
import { startOfDay, endOfDay, subDays, format } from 'date-fns'
import type { TaskStats, TaskStatus } from '@/types/task'

/**
 * 获取任务统计数据
 */
export async function getTaskStats(): Promise<TaskStats> {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)
  const weekAgo = subDays(now, 7)

  // 并行查询所有统计数据
  const [
    total,
    urgent,
    incomplete,
    inProgress,
    completedToday,
    tasksByStatus,
    completionTrend
  ] = await Promise.all([
    // 总任务数
    prisma.task.count(),

    // 紧急任务数
    prisma.task.count({ where: { priority: 'URGENT' } }),

    // 未完成任务数
    prisma.task.count({
      where: { status: { in: ['TODO', 'IN_PROGRESS'] } }
    }),

    // 进行中任务数
    prisma.task.count({ where: { status: 'IN_PROGRESS' } }),

    // 今日完成任务数
    prisma.task.count({
      where: {
        status: 'COMPLETED',
        completedAt: { gte: todayStart, lte: todayEnd }
      }
    }),

    // 按状态统计
    prisma.task.groupBy({
      by: ['status'],
      _count: true
    }),

    // 过去7天完成趋势
    prisma.task.findMany({
      where: {
        status: 'COMPLETED',
        completedAt: { gte: weekAgo }
      },
      select: {
        completedAt: true,
        priority: true
      }
    })
  ])

  // 处理按状态统计
  const byStatus: Record<TaskStatus, number> = {
    TODO: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0
  }

  tasksByStatus.forEach((item) => {
    byStatus[item.status as TaskStatus] = item._count
  })

  // 处理完成趋势（按日期聚合）
  const trendMap = new Map<string, { daily: number; weekly: number; urgent: number }>()

  for (let i = 6; i >= 0; i--) {
    const date = format(subDays(now, i), 'MM-dd')
    trendMap.set(date, { daily: 0, weekly: 0, urgent: 0 })
  }

  completionTrend.forEach((task) => {
    if (!task.completedAt) return
    const date = format(task.completedAt, 'MM-dd')
    const entry = trendMap.get(date)

    if (entry) {
      entry.daily += 1
      if (task.priority === 'URGENT') {
        entry.urgent += 1
      }
    }
  })

  const completionTrendArray = Array.from(trendMap.entries()).map(([date, counts]) => ({
    date,
    ...counts
  }))

  return {
    total,
    urgent,
    incomplete,
    inProgress,
    completedToday,
    byStatus,
    completionTrend: completionTrendArray
  }
}
