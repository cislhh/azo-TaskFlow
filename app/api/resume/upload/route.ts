/**
 * 简历上传 API
 * 支持文本粘贴和 PDF 文件上传
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { extractTextFromPDF, cleanExtractedText } from '@/lib/pdf/parser'
import { resumeTextSchema } from '@/lib/validations/resume'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const text = formData.get('text') as string | null

    // 验证输入
    if (!file && !text) {
      return NextResponse.json(
        { error: '请提供简历文本或上传 PDF 文件' },
        { status: 400 }
      )
    }

    if (file && text) {
      return NextResponse.json(
        { error: '只能选择一种方式：文本粘贴或文件上传' },
        { status: 400 }
      )
    }

    let content: string
    let source: 'TEXT_PASTE' | 'PDF_UPLOAD'
    let filePath: string | null = null

    if (file) {
      // PDF 文件上传
      source = 'PDF_UPLOAD'
      const extractedText = await extractTextFromPDF(file)
      content = cleanExtractedText(extractedText)
      // TODO: 实际项目中应该保存文件到存储系统，这里暂时不保存文件
      // filePath = `/uploads/resumes/${resumeId}.pdf`
    } else {
      // 文本粘贴
      source = 'TEXT_PASTE'
      content = text || ''

      // 验证文本内容
      const validationResult = resumeTextSchema.safeParse({ content })
      if (!validationResult.success) {
        return NextResponse.json(
          { error: validationResult.error.issues[0].message },
          { status: 400 }
        )
      }
    }

    // 验证提取的文本内容
    if (content.length < 50) {
      return NextResponse.json(
        { error: '简历内容太少，请提供更详细的简历信息' },
        { status: 400 }
      )
    }

    if (content.length > 50000) {
      return NextResponse.json(
        { error: '简历内容过长，请控制在50000字符以内' },
        { status: 400 }
      )
    }

    // 保存到数据库
    const resume = await prisma.resume.create({
      data: {
        source,
        content,
        filePath,
        techStack: [], // 稍后通过 AI 分析填充
        projects: undefined,
        level: undefined,
        focusAreas: [],
      },
    })

    return NextResponse.json({
      success: true,
      resume: {
        id: resume.id,
        source: resume.source,
        content: resume.content,
        createdAt: resume.createdAt,
      },
    }, { status: 201 })

  } catch (error) {
    console.error('简历上传失败:', error)

    const errorMessage = error instanceof Error
      ? error.message
      : '上传失败，请稍后重试'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * GET /api/resume/upload
 * 获取所有简历列表
 */
export async function GET() {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        source: true,
        techStack: true,
        level: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { quizzes: true },
        },
      },
    })

    return NextResponse.json({ resumes })
  } catch (error) {
    console.error('获取简历列表失败:', error)
    return NextResponse.json(
      { error: '获取简历列表失败' },
      { status: 500 }
    )
  }
}
