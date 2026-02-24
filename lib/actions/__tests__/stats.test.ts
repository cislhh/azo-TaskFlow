import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTaskStats } from '../stats'
import { prisma } from '@/lib/db'

// Mock Prisma Client
vi.mock('@/lib/db', () => ({
  prisma: {
    task: {
      count: vi.fn(),
      groupBy: vi.fn(),
      findMany: vi.fn()
    }
  }
}))

// Mock date-fns
vi.mock('date-fns', () => ({
  startOfDay: (date: Date) => date,
  endOfDay: (date: Date) => date,
  subDays: (date: Date, days: number) => {
    const result = new Date(date)
    result.setDate(result.getDate() - days)
    return result
  },
  format: (date: Date, formatStr: string) => {
    // 生成不同的日期字符串
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${month}-${day}`
  }
}))

describe('Server Actions - Stats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTaskStats', () => {
    it('should return complete task statistics', async () => {
      const mockCount = 10
      const mockGroupBy = [
        { status: 'TODO', _count: 5 },
        { status: 'IN_PROGRESS', _count: 3 },
        { status: 'COMPLETED', _count: 2 }
      ]
      const mockCompletedTasks = [
        {
          completedAt: new Date('2025-02-24'),
          priority: 'MEDIUM'
        }
      ]

      vi.mocked(prisma.task.count)
        .mockResolvedValueOnce(mockCount) // total
        .mockResolvedValueOnce(0)         // urgent
        .mockResolvedValueOnce(0)         // incomplete
        .mockResolvedValueOnce(0)         // inProgress
        .mockResolvedValueOnce(0)         // completedToday
      vi.mocked(prisma.task.groupBy).mockResolvedValue(mockGroupBy as any)
      vi.mocked(prisma.task.findMany).mockResolvedValue(mockCompletedTasks as any)

      const stats = await getTaskStats()

      expect(stats).toHaveProperty('total')
      expect(stats).toHaveProperty('urgent')
      expect(stats).toHaveProperty('incomplete')
      expect(stats).toHaveProperty('byStatus')
      expect(stats).toHaveProperty('completionTrend')
      expect(stats.byStatus).toHaveProperty('TODO')
      expect(stats.byStatus).toHaveProperty('IN_PROGRESS')
      expect(stats.byStatus).toHaveProperty('COMPLETED')
      expect(stats.byStatus).toHaveProperty('CANCELLED')
    })

    it('should calculate total tasks correctly', async () => {
      vi.mocked(prisma.task.count)
        .mockResolvedValueOnce(15) // total
        .mockResolvedValueOnce(0)  // urgent
        .mockResolvedValueOnce(0)  // incomplete
        .mockResolvedValueOnce(0)  // inProgress
        .mockResolvedValueOnce(0)  // completedToday
      vi.mocked(prisma.task.groupBy).mockResolvedValue([])
      vi.mocked(prisma.task.findMany).mockResolvedValue([])

      const stats = await getTaskStats()

      expect(stats.total).toBe(15)
    })

    it('should calculate urgent tasks correctly', async () => {
      vi.mocked(prisma.task.count)
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(3)  // urgent
        .mockResolvedValueOnce(0)  // incomplete
        .mockResolvedValueOnce(0)  // inProgress
        .mockResolvedValueOnce(0)  // completedToday
      vi.mocked(prisma.task.groupBy).mockResolvedValue([])
      vi.mocked(prisma.task.findMany).mockResolvedValue([])

      const stats = await getTaskStats()

      expect(stats.urgent).toBe(3)
    })

    it('should calculate incomplete tasks correctly', async () => {
      const mockGroupBy = [
        { status: 'TODO', _count: 5 },
        { status: 'IN_PROGRESS', _count: 3 }
      ]
      vi.mocked(prisma.task.count)
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(0)  // urgent
        .mockResolvedValueOnce(8)  // incomplete
        .mockResolvedValueOnce(0)  // inProgress
        .mockResolvedValueOnce(0)  // completedToday
      vi.mocked(prisma.task.groupBy).mockResolvedValue(mockGroupBy as any)
      vi.mocked(prisma.task.findMany).mockResolvedValue([])

      const stats = await getTaskStats()

      expect(stats.incomplete).toBe(8)
    })

    it('should build completion trend data', async () => {
      const mockCompletedTasks = [
        { completedAt: new Date('2025-02-24'), priority: 'MEDIUM' },
        { completedAt: new Date('2025-02-24'), priority: 'URGENT' }
      ]
      vi.mocked(prisma.task.count)
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(0)  // urgent
        .mockResolvedValueOnce(0)  // incomplete
        .mockResolvedValueOnce(0)  // inProgress
        .mockResolvedValueOnce(0)  // completedToday
      vi.mocked(prisma.task.groupBy).mockResolvedValue([])
      vi.mocked(prisma.task.findMany).mockResolvedValue(mockCompletedTasks as any)

      const stats = await getTaskStats()

      expect(stats.completionTrend).toHaveLength(7)
      expect(stats.completionTrend[0]).toHaveProperty('date')
      expect(stats.completionTrend[0]).toHaveProperty('daily')
      expect(stats.completionTrend[0]).toHaveProperty('weekly')
      expect(stats.completionTrend[0]).toHaveProperty('urgent')
    })

    it('should initialize all statuses to 0 if no tasks', async () => {
      vi.mocked(prisma.task.count)
        .mockResolvedValueOnce(0) // total
        .mockResolvedValueOnce(0) // urgent
        .mockResolvedValueOnce(0) // incomplete
        .mockResolvedValueOnce(0) // inProgress
        .mockResolvedValueOnce(0) // completedToday
      vi.mocked(prisma.task.groupBy).mockResolvedValue([])
      vi.mocked(prisma.task.findMany).mockResolvedValue([])

      const stats = await getTaskStats()

      expect(stats.byStatus.TODO).toBe(0)
      expect(stats.byStatus.IN_PROGRESS).toBe(0)
      expect(stats.byStatus.COMPLETED).toBe(0)
      expect(stats.byStatus.CANCELLED).toBe(0)
    })
  })
})
