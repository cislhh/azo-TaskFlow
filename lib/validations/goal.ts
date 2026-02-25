import { z } from 'zod'

export const goalSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题不能超过100个字符'),
  description: z.string().optional(),
  targetDate: z.coerce.date(),
  progress: z.number().int().min(0, '进度不能小于0').max(100, '进度不能大于100').default(0)
})

export type GoalInput = z.input<typeof goalSchema>
export type GoalOutput = z.infer<typeof goalSchema>
