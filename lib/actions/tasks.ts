'use server'

import { prisma } from '@/lib/db'
import { taskSchema } from '@/lib/validations/task'
import type { TaskFilters, Task } from '@/types/task'

/**
 * 获取任务列表
 */
export async function getTasks(filters?: TaskFilters) {
  const { startDate, endDate, status, priority } = filters || {}

  const where = {
    ...(startDate && endDate && {
      dueDate: {
        gte: startDate,
        lte: endDate
      }
    }),
    ...(status && { status }),
    ...(priority && { priority })
  }

  return prisma.task.findMany({
    where,
    orderBy: { dueDate: 'asc' }
  })
}

/**
 * 创建新任务
 */
export async function createTask(data: unknown) {
  // 验证输入
  const result = taskSchema.safeParse(data)

  if (!result.success) {
    const errors = result.error.flatten()
    return {
      success: false,
      errors: errors.fieldErrors
    }
  }

  try {
    const task = await prisma.task.create({
      data: result.data
    })

    return { success: true, data: task }
  } catch (error) {
    console.error('创建任务失败:', error)
    return {
      success: false,
      error: '创建任务失败'
    }
  }
}

/**
 * 更新任务
 */
export async function updateTask(id: string, data: Partial<Task>) {
  const { status, completedAt, ...restData } = data

  try {
    const updateData: any = { ...restData }

    // 自动管理 completedAt
    if (status === 'COMPLETED') {
      updateData.status = status
      // 只有当没有明确提供 completedAt 时才自动设置
      if (!completedAt) {
        updateData.completedAt = new Date()
      } else {
        updateData.completedAt = completedAt
      }
    } else if (status !== undefined) {
      // 状态不是已完成，清除完成时间
      updateData.status = status
      updateData.completedAt = null
    } else if (completedAt !== undefined) {
      // 没有状态改变但明确设置了 completedAt
      updateData.completedAt = completedAt
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData
    })

    return { success: true, data: task }
  } catch (error) {
    console.error('更新任务失败:', error)
    return {
      success: false,
      error: '更新任务失败'
    }
  }
}

/**
 * 删除任务
 */
export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    console.error('删除任务失败:', error)
    return {
      success: false,
      error: '删除任务失败'
    }
  }
}
