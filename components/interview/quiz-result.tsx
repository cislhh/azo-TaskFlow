/**
 * 测验结果组件
 * 显示测验得分、详细结果和反馈
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Quiz, Question, QuizStatus } from '@prisma/client'

interface QuizResultProps {
  quiz: Quiz & {
    questions: Question[]
  }
}

export function QuizResult({ quiz }: QuizResultProps) {
  const correctCount = quiz.questions.filter(q => q.isCorrect).length
  const totalCount = quiz.questions.length
  const accuracyRate = Math.round((correctCount / totalCount) * 100)

  const statusColor: Record<QuizStatus, string> = {
    DRAFT: 'bg-gray-500/10 text-gray-700',
    IN_PROGRESS: 'bg-blue-500/10 text-blue-700',
    COMPLETED: 'bg-green-500/10 text-green-700',
  }

  return (
    <>
      {/* 结果概览 */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">测验结果</h2>
            <div className="text-5xl font-bold text-primary mb-2">{quiz.score}</div>
            <div className="text-muted-foreground mb-8">分</div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
              <div>
                <div className="text-2xl font-bold">{correctCount}</div>
                <div className="text-sm text-muted-foreground">正确</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{totalCount - correctCount}</div>
                <div className="text-sm text-muted-foreground">错误</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{accuracyRate}%</div>
                <div className="text-sm text-muted-foreground">正确率</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/interview/mistakes">
                <Button variant="outline">查看错题</Button>
              </Link>
              <Link href="/interview/statistics">
                <Button variant="outline">统计数据</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详细结果 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>详细结果</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quiz.questions.map((q) => (
              <QuestionResult key={q.id} question={q} />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

interface QuestionResultProps {
  question: Question
}

function QuestionResult({ question }: QuestionResultProps) {
  const difficultyColor: Record<string, string> = {
    EASY: 'bg-green-500/10 text-green-700',
    MEDIUM: 'bg-yellow-500/10 text-yellow-700',
    HARD: 'bg-red-500/10 text-red-700',
  }

  const difficultyLabel: Record<string, string> = {
    EASY: '简单',
    MEDIUM: '中等',
    HARD: '困难',
  }

  return (
    <div
      className={`p-4 rounded-lg border ${
        question.isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">题目 {question.order}</span>
            <Badge className={difficultyColor[question.difficulty]}>
              {difficultyLabel[question.difficulty]}
            </Badge>
            <div className={`text-sm ${question.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {question.isCorrect ? '✓ 正确' : '✗ 错误'}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{question.text}</div>
        </div>
      </div>

      {question.type === 'OBJECTIVE' ? (
        <div className="text-sm">
          <span className="text-muted-foreground">您的答案：</span>
          {question.userAnswer || '未作答'}
          {!question.isCorrect && question.correctAnswer && (
            <>
              <span className="mx-2">|</span>
              <span className="text-green-700">正确答案：{question.correctAnswer}</span>
            </>
          )}
        </div>
      ) : (
        question.aiEvaluation && (
          <div className="mt-3 p-3 bg-background rounded text-sm">
            <div className="font-medium mb-1">评分：{(question.aiEvaluation as any).score}/10</div>
            <div className="text-muted-foreground">{(question.aiEvaluation as any).feedback}</div>
          </div>
        )
      )}
    </div>
  )
}
