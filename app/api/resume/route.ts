/**
 * 简历列表 API
 * 获取所有简历和删除单个简历
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/resume
 * 获取所有简历列表
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [resumes, total] = await Promise.all([
      prisma.resume.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          source: true,
          techStack: true,
          level: true,
          focusAreas: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { quizzes: true },
          },
        },
      }),
      prisma.resume.count(),
    ])

    return NextResponse.json({
      success: true,
      resumes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取简历列表失败:', error)
    return NextResponse.json(
      { error: '获取简历列表失败' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/resume
 * 批量删除简历（通过 body 传递 ids）
 */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { ids } = body as { ids: string[] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: '请提供要删除的简历 ID 列表' },
        { status: 400 }
      )
    }

    await prisma.resume.deleteMany({
      where: {
        id: { in: ids },
      },
    })

    return NextResponse.json({
      success: true,
      message: `已删除 ${ids.length} 个简历`,
    })
  } catch (error) {
    console.error('删除简历失败:', error)
    return NextResponse.json(
      { error: '删除简历失败' },
      { status: 500 }
    )
  }
}
