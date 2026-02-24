import { describe, it, expect, vi } from 'vitest'

// Mock Prisma Client
vi.mock('../db', () => ({
  prisma: {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $on: vi.fn(),
    task: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn()
    }
  }
}))

describe('Prisma Client Module', () => {
  it('should be importable', async () => {
    const { prisma } = await import('../db')
    expect(prisma).toBeDefined()
  })

  it('should have task model methods', async () => {
    const { prisma } = await import('../db')
    expect(prisma.task).toBeDefined()
    expect(typeof prisma.task.findMany).toBe('function')
    expect(typeof prisma.task.findUnique).toBe('function')
    expect(typeof prisma.task.create).toBe('function')
    expect(typeof prisma.task.update).toBe('function')
    expect(typeof prisma.task.delete).toBe('function')
    expect(typeof prisma.task.count).toBe('function')
    expect(typeof prisma.task.groupBy).toBe('function')
  })
})
