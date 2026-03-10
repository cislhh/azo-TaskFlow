import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTasks, createTask, updateTask, deleteTask } from '../tasks'
import { prisma } from '@/lib/db'
import { taskSchema, type TaskOutput } from '@/lib/validations/task'

// Define types for better type safety
type TaskPriority = TaskOutput['priority']
type TaskStatus = TaskOutput['status']

// Mock Prisma Client
vi.mock('@/lib/db', () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}))

describe('Server Actions - Tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getTasks', () => {
    it('should return all tasks when no filters provided', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', dueDate: new Date(), priority: 'MEDIUM', status: 'TODO' },
        { id: '2', title: 'Task 2', dueDate: new Date(), priority: 'HIGH', status: 'IN_PROGRESS' }
      ]
      vi.mocked(prisma.task.findMany).mockResolvedValue(mockTasks as any)

      const result = await getTasks()

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { dueDate: 'asc' }
      })
      expect(result).toEqual(mockTasks)
    })

    it('should filter tasks by date range', async () => {
      const startDate = new Date('2025-02-01')
      const endDate = new Date('2025-02-28')
      const mockTasks = [{ id: '1', title: 'Task 1', dueDate: new Date(), priority: 'MEDIUM', status: 'TODO' }]
      vi.mocked(prisma.task.findMany).mockResolvedValue(mockTasks as any)

      await getTasks({ startDate, endDate })

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {
          dueDate: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { dueDate: 'asc' }
      })
    })

    it('should filter tasks by status', async () => {
      const mockTasks = [{ id: '1', title: 'Task 1', dueDate: new Date(), priority: 'MEDIUM', status: 'TODO' }]
      vi.mocked(prisma.task.findMany).mockResolvedValue(mockTasks as any)

      await getTasks({ status: 'TODO' })

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { status: 'TODO' },
        orderBy: { dueDate: 'asc' }
      })
    })

    it('should filter tasks by priority', async () => {
      const mockTasks = [{ id: '1', title: 'Task 1', dueDate: new Date(), priority: 'URGENT', status: 'TODO' }]
      vi.mocked(prisma.task.findMany).mockResolvedValue(mockTasks as any)

      await getTasks({ priority: 'URGENT' })

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { priority: 'URGENT' },
        orderBy: { dueDate: 'asc' }
      })
    })

    it('should handle database errors', async () => {
      vi.mocked(prisma.task.findMany).mockRejectedValue(new Error('Database error'))

      await expect(getTasks()).rejects.toThrow('Database error')
    })
  })

  describe('createTask', () => {
    const validTaskData = {
      title: 'New Task',
      description: 'Task description',
      dueDate: '2025-02-25',
      priority: 'MEDIUM' as const
    }

    it('should create a new task successfully', async () => {
      const mockTask = {
        id: '123',
        title: 'New Task',
        description: 'Task description',
        dueDate: new Date('2025-02-25'),
        priority: 'MEDIUM' as TaskPriority,
        status: 'TODO' as TaskStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null
      }
      vi.mocked(prisma.task.create).mockResolvedValue(mockTask as any)

      const result = await createTask(validTaskData)

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'New Task',
          priority: 'MEDIUM'
        })
      })
      expect(result).toEqual({ success: true, data: mockTask })
    })

    it('should validate task data with zod schema', async () => {
      const invalidData = {
        title: '', // Empty title should fail
        dueDate: '2025-02-25',
        priority: 'MEDIUM' as const
      }

      const result = await createTask(invalidData)

      expect(result.success).toBe(false)
      expect(result).toHaveProperty('errors')
      expect(prisma.task.create).not.toHaveBeenCalled()
    })

    it('should handle database errors during creation', async () => {
      vi.mocked(prisma.task.create).mockRejectedValue(new Error('Failed to create'))

      const result = await createTask(validTaskData)

      expect(result).toEqual({
        success: false,
        error: '创建任务失败'
      })
    })
  })

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const mockTask = {
        id: '123',
        title: 'Updated Task',
        description: 'Updated description',
        dueDate: new Date(),
        priority: 'HIGH' as TaskPriority,
        status: 'IN_PROGRESS' as TaskStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null
      }
      vi.mocked(prisma.task.update).mockResolvedValue(mockTask as any)

      const result = await updateTask('123', { status: 'IN_PROGRESS' })

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: {
          status: 'IN_PROGRESS',
          completedAt: null
        }
      })
      expect(result).toEqual({ success: true, data: mockTask })
    })

    it('should set completedAt when status is COMPLETED', async () => {
      const mockTask = {
        id: '123',
        title: 'Task',
        status: 'COMPLETED',
        completedAt: new Date()
      } as any
      vi.mocked(prisma.task.update).mockResolvedValue(mockTask)

      await updateTask('123', { status: 'COMPLETED' })

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: {
          status: 'COMPLETED',
          completedAt: expect.any(Date)
        }
      })
    })

    it('should clear completedAt when status is not COMPLETED', async () => {
      const mockTask = {
        id: '123',
        title: 'Task',
        status: 'TODO',
        completedAt: null
      } as any
      vi.mocked(prisma.task.update).mockResolvedValue(mockTask)

      await updateTask('123', { status: 'TODO' })

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: {
          status: 'TODO',
          completedAt: null
        }
      })
    })

    it('should handle update errors', async () => {
      vi.mocked(prisma.task.update).mockRejectedValue(new Error('Update failed'))

      const result = await updateTask('123', { status: 'TODO' })

      expect(result).toEqual({
        success: false,
        error: '更新任务失败'
      })
    })
  })

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      vi.mocked(prisma.task.delete).mockResolvedValue({ id: '123' } as any)

      const result = await deleteTask('123')

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: '123' }
      })
      expect(result).toEqual({ success: true })
    })

    it('should handle delete errors', async () => {
      vi.mocked(prisma.task.delete).mockRejectedValue(new Error('Delete failed'))

      const result = await deleteTask('123')

      expect(result).toEqual({
        success: false,
        error: '删除任务失败'
      })
    })
  })
})
