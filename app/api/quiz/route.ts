/**
 * 测验列表 API
 * 获取所有测验列表
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const quizzes = await prisma.quiz.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        resume: {
          select: {
            id: true,
            techStack: true,
            level: true,
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      quizzes,
    })
  } catch (error) {
    console.error('获取测验列表失败:', error)
    return NextResponse.json(
      { error: '获取测验列表失败' },
      { status: 500 }
    )
  }
}
