/**
 * 测验详情 API
 * 获取单个测验的详细信息
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        resume: {
          select: {
            id: true,
            content: true,
            techStack: true,
            level: true,
          },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json(
        { error: '测验不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      quiz,
    })
  } catch (error) {
    console.error('获取测验详情失败:', error)
    return NextResponse.json(
      { error: '获取测验详情失败' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/quiz/[id]
 * 删除测验
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.quiz.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: '测验已删除',
    })
  } catch (error) {
    console.error('删除测验失败:', error)
    return NextResponse.json(
      { error: '删除测验失败' },
      { status: 500 }
    )
  }
}
