/**
 * 简历相关验证 Schema
 */

import { z } from 'zod'

/**
 * 简历内容验证（文本粘贴）
 */
export const resumeTextSchema = z.object({
  content: z.string()
    .min(50, '简历内容至少需要50个字符')
    .max(50000, '简历内容不能超过50000个字符'),
})

/**
 * 简历文件验证（PDF 上传）
 */
export const resumeFileSchema = z.object({
  file: z.any()
    .refine((file) => file instanceof File, '请选择有效的文件')
    .refine((file) => file?.type === 'application/pdf', '仅支持 PDF 格式')
    .refine((file) => file?.size <= 5 * 1024 * 1024, '文件大小不能超过 5MB'),
})

/**
 * 简历分析结果验证
 */
export const resumeAnalysisSchema = z.object({
  techStack: z.array(z.string()).min(1, '至少需要一个技术栈'),
  projects: z.array(z.object({
    name: z.string().min(1, '项目名称不能为空'),
    technologies: z.array(z.string()).min(1, '至少需要一个技术'),
    responsibilities: z.array(z.string()).min(1, '至少需要一个职责'),
    achievements: z.array(z.string()),
  })),
  level: z.enum(['junior', 'mid', 'senior']),
  focusAreas: z.array(z.string()).min(1, '至少需要一个重点考察领域'),
})

/**
 * 创建简历验证
 */
export const createResumeSchema = z.object({
  source: z.enum(['TEXT_PASTE', 'PDF_UPLOAD']),
  content: z.string().optional(),
  filePath: z.string().optional(),
})
  .refine((data) => {
    if (data.source === 'TEXT_PASTE') {
      return data.content && data.content.length >= 50
    }
    return true
  }, '文本内容至少需要50个字符')

/**
 * 简历 ID 验证
 */
export const resumeIdSchema = z.object({
  resumeId: z.string().cuid('无效的简历 ID'),
})

export type ResumeTextInput = z.infer<typeof resumeTextSchema>
export type ResumeAnalysisInput = z.infer<typeof resumeAnalysisSchema>
export type CreateResumeInput = z.infer<typeof createResumeSchema>
