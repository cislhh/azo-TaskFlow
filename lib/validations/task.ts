import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题不能超过100个字符'),
  description: z.string().optional(),
  dueDate: z.coerce.date(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional()
})

export type TaskInput = z.input<typeof taskSchema>
export type TaskOutput = z.infer<typeof taskSchema>
