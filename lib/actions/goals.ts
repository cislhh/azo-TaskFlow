'use server'

import { prisma } from '@/lib/db'
import { goalSchema } from '@/lib/validations/goal'
import type { Goal } from '@/types/goal'

/**
 * 获取所有目标
 */
export async function getGoals() {
  return prisma.goal.findMany({
    orderBy: { targetDate: 'asc' }
  })
}

/**
 * 创建新目标
 */
export async function createGoal(data: unknown) {
  // 验证输入
  const result = goalSchema.safeParse(data)

  if (!result.success) {
    const errors = result.error.flatten()
    return {
      success: false,
      errors: errors.fieldErrors
    }
  }

  try {
    const goal = await prisma.goal.create({
      data: result.data
    })

    return { success: true, data: goal }
  } catch (error) {
    console.error('创建目标失败:', error)
    return {
      success: false,
      error: '创建目标失败'
    }
  }
}

/**
 * 更新目标
 */
export async function updateGoal(id: string, data: Partial<Goal>) {
  try {
    const goal = await prisma.goal.update({
      where: { id },
      data
    })

    return { success: true, data: goal }
  } catch (error) {
    console.error('更新目标失败:', error)
    return {
      success: false,
      error: '更新目标失败'
    }
  }
}

/**
 * 删除目标
 */
export async function deleteGoal(id: string) {
  try {
    await prisma.goal.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    console.error('删除目标失败:', error)
    return {
      success: false,
      error: '删除目标失败'
    }
  }
}
