/**
 * 简历分析 API
 * 使用预设数据返回分析结果，避免调用真实 AI
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { PRESET_ANALYSIS_RESULT } from '@/lib/interview/preset-data'

// 环境变量控制是否使用预设数据
const USE_PRESET_DATA = process.env.USE_PRESET_INTERVIEW_DATA === 'true' || true // 默认使用预设数据

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { resumeId } = body

    if (!resumeId) {
      return NextResponse.json(
        { error: '缺少简历 ID' },
        { status: 400 }
      )
    }

    // 获取简历
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    })

    if (!resume) {
      return NextResponse.json(
        { error: '简历不存在' },
        { status: 404 }
      )
    }

    // 使用预设分析结果
    const analysisResult = PRESET_ANALYSIS_RESULT

    // 模拟 AI 分析延迟（2-3秒）
    if (USE_PRESET_DATA) {
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))
    }

    // 更新简历，保存分析结果
    const updatedResume = await prisma.resume.update({
      where: { id: resumeId },
      data: {
        techStack: analysisResult.techStack,
        projects: analysisResult.projects,
        level: analysisResult.level,
        focusAreas: analysisResult.focusAreas,
      },
    })

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      resume: updatedResume,
    })

  } catch (error) {
    console.error('简历分析失败:', error)

    const errorMessage = error instanceof Error
      ? error.message
      : '分析失败，请稍后重试'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
