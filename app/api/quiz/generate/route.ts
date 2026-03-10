/**
 * 测验生成 API
 * 使用预设题目生成30道面试题，避免调用真实 AI
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { PRESET_QUESTIONS } from '@/lib/interview/preset-data'
import { createQuizSchema } from '@/lib/validations/quiz'

// 环境变量控制是否使用预设数据
const USE_PRESET_DATA = process.env.USE_PRESET_INTERVIEW_DATA === 'true' || true // 默认使用预设数据

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 验证请求
    const validationResult = createQuizSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const { resumeId } = validationResult.data

    // 获取简历及其分析结果
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    })

    if (!resume) {
      return NextResponse.json(
        { error: '简历不存在' },
        { status: 404 }
      )
    }

    // 检查简历是否已分析
    if (!resume.techStack || resume.techStack.length === 0) {
      return NextResponse.json(
        { error: '简历尚未分析，请先分析简历' },
        { status: 400 }
      )
    }

    // 使用预设题目
    const questionsResult = { questions: PRESET_QUESTIONS }

    // 模拟 AI 生成延迟（3-5秒）
    if (USE_PRESET_DATA) {
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000))
    }

    // 创建测验和题目
    const quiz = await prisma.quiz.create({
      data: {
        resumeId,
        status: 'DRAFT',
        questions: {
          create: questionsResult.questions.map((q, index) => {
            const questionData: any = {
              type: q.type,
              difficulty: q.difficulty,
              order: index + 1,
              text: q.text,
            }
            // 客观题才有这些字段
            if ('options' in q && q.options) {
              questionData.options = { options: q.options }
            }
            if ('correctAnswer' in q && q.correctAnswer) {
              questionData.correctAnswer = q.correctAnswer
            }
            if ('explanation' in q && q.explanation) {
              questionData.explanation = q.explanation
            }
            return questionData
          }),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        resumeId: quiz.resumeId,
        status: quiz.status,
        questionCount: quiz.questions.length,
        questions: quiz.questions,
        createdAt: quiz.createdAt,
      },
    }, { status: 201 })

  } catch (error) {
    console.error('测验生成失败:', error)

    const errorMessage = error instanceof Error
      ? error.message
      : '测验生成失败，请稍后重试'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
