/**
 * 测验相关验证 Schema
 */

import { z } from 'zod'

/**
 * 创建测验验证
 */
export const createQuizSchema = z.object({
  resumeId: z.string().cuid('无效的简历 ID'),
})

/**
 * 提交答案验证（单题）
 */
export const submitAnswerSchema = z.object({
  questionId: z.string().cuid('无效的题目 ID'),
  answer: z.string().min(1, '答案不能为空'),
})

/**
 * 提交测验验证（所有答案）
 */
export const submitQuizSchema = z.object({
  quizId: z.string().cuid('无效的测验 ID'),
  answers: z.record(z.string().cuid(), z.string().min(1, '答案不能为空'))
    .refine((answers) => Object.keys(answers).length > 0, '至少需要提交一道题的答案'),
})

/**
 * 更新测验状态验证
 */
export const updateQuizStatusSchema = z.object({
  quizId: z.string().cuid('无效的测验 ID'),
  status: z.enum(['DRAFT', 'IN_PROGRESS', 'COMPLETED']),
})

/**
 * 测验 ID 验证
 */
export const quizIdSchema = z.object({
  quizId: z.string().cuid('无效的测验 ID'),
})

/**
 * 题目验证
 */
export const questionSchema = z.object({
  type: z.enum(['OBJECTIVE', 'SUBJECTIVE']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  text: z.string().min(10, '题干至少需要10个字符'),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, '正确答案不能为空'),
  explanation: z.string().min(10, '解析至少需要10个字符'),
})
  .refine((data) => {
    // 客观题必须有选项
    if (data.type === 'OBJECTIVE') {
      return data.options && data.options.length === 4
    }
    return true
  }, '客观题必须提供4个选项')

/**
 * 批量题目验证
 */
export const questionsSchema = z.object({
  questions: z.array(questionSchema).min(30, '必须生成30道题').max(30, '最多只能有30道题'),
})

export type CreateQuizInput = z.infer<typeof createQuizSchema>
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>
export type QuestionInput = z.infer<typeof questionSchema>
