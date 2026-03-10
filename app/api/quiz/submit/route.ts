/**
 * 测验提交 API
 * 处理用户提交的答案，评分并记录错题
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { glmClient } from '@/lib/ai/client'
import {
  ANSWER_EVALUATION_SYSTEM_PROMPT,
  generateAnswerEvaluationPrompt,
  type AnswerEvaluationResult,
} from '@/lib/ai/prompts/answer-evaluation'
import { submitQuizSchema } from '@/lib/validations/quiz'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 验证请求
    const validationResult = submitQuizSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const { quizId, answers } = validationResult.data

    // 获取测验和题目
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json(
        { error: '测验不存在' },
        { status: 404 }
      )
    }

    if (quiz.status === 'COMPLETED') {
      return NextResponse.json(
        { error: '该测验已完成' },
        { status: 400 }
      )
    }

    const questions = quiz.questions
    const objectiveQuestions = questions.filter(q => q.type === 'OBJECTIVE')
    const subjectiveQuestions = questions.filter(q => q.type === 'SUBJECTIVE')

    // 1. 评分客观题
    const objectiveResults = objectiveQuestions.map(q => {
      const userAnswer = answers[q.id] || ''
      const isCorrect = userAnswer.trim().toUpperCase() === q.correctAnswer?.trim().toUpperCase()

      return {
        questionId: q.id,
        userAnswer,
        isCorrect,
        correctAnswer: q.correctAnswer,
        score: isCorrect ? 10 : 0, // 每题10分
      }
    })

    // 2. 评分主观题（使用 AI）
    let subjectiveResults: Array<{
      questionId: string
      userAnswer: string
      score: number
      feedback: string
      improvements: string[]
      keyPoints: string[]
    }> = []

    if (subjectiveQuestions.length > 0) {
      try {
        const evaluationMessages: Array<{ role: 'system' | 'user'; content: string }> = [
          {
            role: 'system',
            content: ANSWER_EVALUATION_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: generateAnswerEvaluationPrompt(
              subjectiveQuestions.map(q => ({
                id: q.id,
                text: q.text,
                correctAnswer: q.correctAnswer || '',
              })),
              answers
            ),
          },
        ]

        const evaluationResult = await glmClient.chatJSON<AnswerEvaluationResult>(
          evaluationMessages,
          {
            temperature: 0.3,
            maxTokens: 4096,
          }
        )

        subjectiveResults = evaluationResult.evaluations.map(e => ({
          questionId: e.questionId,
          userAnswer: answers[e.questionId] || '',
          score: e.score,
          feedback: e.feedback,
          improvements: e.improvements,
          keyPoints: e.keyPoints,
        }))
      } catch (error) {
        console.error('AI 评估主观题失败:', error)
        // 如果 AI 评估失败，给个默认分数
        subjectiveResults = subjectiveQuestions.map(q => ({
          questionId: q.id,
          userAnswer: answers[q.id] || '',
          score: 0,
          feedback: '评估失败，请联系管理员',
          improvements: [],
          keyPoints: [],
        }))
      }
    }

    // 3. 更新题目的用户答案和评分
    const updatePromises = questions.map(q => {
      const userAnswer = answers[q.id] || ''
      let isCorrect: boolean | null = null
      let aiEvaluation: any = null

      if (q.type === 'OBJECTIVE') {
        const result = objectiveResults.find(r => r.questionId === q.id)
        isCorrect = result?.isCorrect ?? false
      } else {
        const result = subjectiveResults.find(r => r.questionId === q.id)
        if (result) {
          isCorrect = result.score >= 7 // 7分以上算正确
          aiEvaluation = {
            score: result.score,
            feedback: result.feedback,
            improvements: result.improvements,
            keyPoints: result.keyPoints,
          }
        }
      }

      return prisma.question.update({
        where: { id: q.id },
        data: {
          userAnswer,
          isCorrect,
          aiEvaluation,
        },
      })
    })

    await Promise.all(updatePromises)

    // 4. 计算总分
    const objectiveScore = objectiveResults.reduce((sum, r) => sum + r.score, 0)
    const subjectiveScore = subjectiveResults.reduce((sum, r) => sum + r.score, 0)
    const totalScore = Math.round((objectiveScore + subjectiveScore) / questions.length * 10) // 转换为百分制

    // 5. 更新测验状态
    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        status: 'COMPLETED',
        score: totalScore,
        completedAt: new Date(),
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      result: {
        quizId: updatedQuiz.id,
        score: totalScore,
        objectiveScore,
        subjectiveScore,
        objectiveResults,
        subjectiveResults,
        totalQuestions: questions.length,
        completedAt: updatedQuiz.completedAt,
      },
    })

  } catch (error) {
    console.error('测验提交失败:', error)

    const errorMessage = error instanceof Error
      ? error.message
      : '测验提交失败，请稍后重试'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
