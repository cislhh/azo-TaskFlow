import { describe, it, expect } from 'vitest'
import { taskSchema } from '../task'

describe('taskSchema', () => {
  const validTaskData = {
    title: '完成项目文档',
    description: '编写项目的技术文档和用户手册',
    dueDate: '2025-02-25',
    priority: 'MEDIUM' as const,
    status: 'TODO' as const
  }

  describe('valid data', () => {
    it('should validate a complete valid task', () => {
      const result = taskSchema.safeParse(validTaskData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('完成项目文档')
        expect(result.data.description).toBe('编写项目的技术文档和用户手册')
        expect(result.data.priority).toBe('MEDIUM')
        expect(result.data.status).toBe('TODO')
      }
    })

    it('should validate task with only required fields', () => {
      const minimalTask = {
        title: '简单任务',
        dueDate: '2025-02-25',
        priority: 'LOW' as const
      }
      const result = taskSchema.safeParse(minimalTask)
      expect(result.success).toBe(true)
    })

    it('should accept all priority values', () => {
      const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const
      priorities.forEach(priority => {
        const result = taskSchema.safeParse({
          ...validTaskData,
          priority
        })
        expect(result.success).toBe(true)
      })
    })

    it('should accept all status values', () => {
      const statuses = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const
      statuses.forEach(status => {
        const result = taskSchema.safeParse({
          ...validTaskData,
          status
        })
        expect(result.success).toBe(true)
      })
    })
  })

  describe('title validation', () => {
    it('should reject empty title', () => {
      const result = taskSchema.safeParse({
        ...validTaskData,
        title: ''
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        const errors = result.error.issues
        const titleError = errors.find(e => e.path[0] === 'title')
        expect(titleError?.message).toContain('不能为空')
      }
    })

    it('should reject title longer than 100 characters', () => {
      const longTitle = 'A'.repeat(101)
      const result = taskSchema.safeParse({
        ...validTaskData,
        title: longTitle
      })
      expect(result.success).toBe(false)
    })

    it('should accept title with exactly 100 characters', () => {
      const validTitle = 'A'.repeat(100)
      const result = taskSchema.safeParse({
        ...validTaskData,
        title: validTitle
      })
      expect(result.success).toBe(true)
    })
  })

  describe('description validation', () => {
    it('should accept empty description', () => {
      const result = taskSchema.safeParse({
        ...validTaskData,
        description: ''
      })
      expect(result.success).toBe(true)
    })

    it('should accept undefined description', () => {
      const result = taskSchema.safeParse({
        title: '任务',
        dueDate: '2025-02-25',
        priority: 'MEDIUM' as const
      })
      expect(result.success).toBe(true)
    })
  })

  describe('dueDate validation', () => {
    it('should accept valid date string', () => {
      const result = taskSchema.safeParse({
        ...validTaskData,
        dueDate: '2025-12-31'
      })
      expect(result.success).toBe(true)
    })

    it('should accept date object', () => {
      const result = taskSchema.safeParse({
        ...validTaskData,
        dueDate: new Date('2025-12-31')
      })
      expect(result.success).toBe(true)
    })

    it('should convert string to Date object', () => {
      const result = taskSchema.safeParse(validTaskData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.dueDate).toBeInstanceOf(Date)
      }
    })
  })

  describe('priority validation', () => {
    it('should reject invalid priority', () => {
      const result = taskSchema.safeParse({
        ...validTaskData,
        priority: 'INVALID'
      })
      expect(result.success).toBe(false)
    })
  })

  describe('status validation', () => {
    it('should reject invalid status', () => {
      const result = taskSchema.safeParse({
        ...validTaskData,
        status: 'INVALID'
      })
      expect(result.success).toBe(false)
    })
  })

  describe('type inference', () => {
    it('should export TaskInput type', () => {
      // Type test - if this compiles, the type is exported correctly
      const taskInput: import('../task').TaskInput = validTaskData
      expect(taskInput).toBeDefined()
    })
  })
})
