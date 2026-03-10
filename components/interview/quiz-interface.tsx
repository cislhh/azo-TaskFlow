/**
 * 测验答题界面组件
 * 左右分栏布局：左侧上传和简历，右侧题目展示，下方答案判断
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { IconLoader2, IconCheck, IconX, IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { ResumeUploadCompact } from './resume-upload-compact'

interface Quiz {
  id: string
  status: string
  resume?: {
    id: string
    content: string
    techStack: string[]
    level: string | null
  } | null
  questions: Array<{
    id: string
    type: 'OBJECTIVE' | 'SUBJECTIVE'
    difficulty: 'EASY' | 'MEDIUM' | 'HARD'
    order: number
    text: string
    options?: { options: Array<{ id: string; text: string }> } | null
    correctAnswer?: string | null
    explanation?: string | null
  }>
}

interface QuizInterfaceProps {
  quiz: Quiz
}

interface AnswerResult {
  isCorrect: boolean | null
  correctAnswer?: string
  explanation?: string
}

export function QuizInterface({ quiz }: QuizInterfaceProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [answerResults, setAnswerResults] = useState<Record<number, AnswerResult>>({})

  const form = useForm({
    defaultValues: {} as Record<string, string>,
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        const res = await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizId: quiz.id, answers: value }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || '提交失败')
        }

        setSubmitted(true)
        setTimeout(() => {
          router.refresh()
        }, 1500)
      } catch (error) {
        console.error('提交失败:', error)
        alert(error instanceof Error ? error.message : '提交失败，请重试')
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const questions = quiz.questions
  const currentQ = questions[currentQuestion]
  const options = currentQ?.options?.options || []
  const currentResult = answerResults[currentQuestion]

  const difficultyColor = {
    EASY: 'bg-green-500/10 text-green-700 hover:bg-green-500/20',
    MEDIUM: 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20',
    HARD: 'bg-red-500/10 text-red-700 hover:bg-red-500/20',
  }

  const difficultyLabel = {
    EASY: '简单',
    MEDIUM: '中等',
    HARD: '困难',
  }

  // 判断答案对错
  const checkAnswer = () => {
    const userAnswer = form.state.values[currentQ.id]
    if (!userAnswer) return

    let result: AnswerResult

    if (currentQ.type === 'OBJECTIVE') {
      const isCorrect = userAnswer.toLowerCase() === currentQ.correctAnswer?.toLowerCase()
      result = {
        isCorrect,
        correctAnswer: currentQ.correctAnswer || '',
        explanation: currentQ.explanation || '',
      }
    } else {
      // 主观题只显示正确答案/参考答案
      result = {
        isCorrect: null,
        correctAnswer: currentQ.explanation || '暂无参考答案',
      }
    }

    setAnswerResults(prev => ({ ...prev, [currentQuestion]: result }))
  }

  // 下一题前先判断答案
  const handleNext = () => {
    if (!currentResult) {
      checkAnswer()
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  // 上一题
  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (submitted) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Card className="p-8 text-center">
          <IconCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">提交成功！</h3>
          <p className="text-muted-foreground">
            您的答案已提交，AI 正在评估中...
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] grid grid-cols-2 gap-6">
      {/* 左侧：上传和简历内容 */}
      <div className="flex flex-col gap-4 overflow-hidden">
        <ResumeUploadCompact onResumeUploaded={() => {}} />

        {/* 简历内容 */}
        {quiz.resume?.content && (
          <Card className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-muted/50">
              <h3 className="font-semibold">简历内容</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 text-sm whitespace-pre-wrap">
              {quiz.resume.content}
            </div>
          </Card>
        )}
      </div>

      {/* 右侧：题目展示和答案判断 */}
      <div className="flex flex-col gap-4 overflow-hidden">
        {/* 进度和难度 */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            题目 {currentQuestion + 1} / {questions.length}
          </div>
          <Badge className={difficultyColor[currentQ.difficulty]}>
            {difficultyLabel[currentQ.difficulty]}
          </Badge>
        </div>

        {/* 题目卡片 */}
        <Card className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-muted/50">
            <h3 className="font-semibold">题目 {currentQ.order}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {currentQ.type === 'OBJECTIVE' ? '单选题' : '简答题'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-base mb-6">{currentQ.text}</div>

            {currentQ.type === 'OBJECTIVE' ? (
              <form.Field
                name={currentQ.id}
                children={(field) => (
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(v) => {
                      field.handleChange(v)
                      // 清除当前题目的判断结果，因为用户改变了答案
                      setAnswerResults(prev => {
                        const newResults = { ...prev }
                        delete newResults[currentQuestion]
                        return newResults
                      })
                    }}
                    disabled={!!currentResult}
                  >
                    {options.map((option, index) => {
                      const letter = ['A', 'B', 'C', 'D'][index]
                      const optionText = typeof option === 'string' ? option : option.text
                      const optionId = typeof option === 'string' ? letter : option.id

                      // 答题后显示正确/错误状态
                      const isCorrectOption = currentResult?.correctAnswer?.toLowerCase() === optionId.toLowerCase()
                      const isSelected = field.state.value?.toLowerCase() === optionId.toLowerCase()
                      const showWrong = currentResult && currentResult.isCorrect === false && isSelected
                      const showCorrect = currentResult && isCorrectOption

                      return (
                        <div
                          key={letter}
                          className={`flex items-center space-x-2 p-3 border rounded-lg transition-colors ${
                            showWrong ? 'bg-red-500/10 border-red-500/30' :
                            showCorrect ? 'bg-green-500/10 border-green-500/30' :
                            'hover:bg-secondary/50'
                          } ${!!currentResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <RadioGroupItem value={optionId} id={`${currentQ.id}-${letter}`} disabled={!!currentResult} />
                          <label
                            htmlFor={`${currentQ.id}-${letter}`}
                            className={`flex-1 ${!!currentResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {letter}. {optionText}
                          </label>
                          {showCorrect && <IconCheck className="h-4 w-4 text-green-600" />}
                          {showWrong && <IconX className="h-4 w-4 text-red-600" />}
                        </div>
                      )
                    })}
                  </RadioGroup>
                )}
              />
            ) : (
              <form.Field
                name={currentQ.id}
                children={(field) => (
                  <Textarea
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      // 清除当前题目的判断结果
                      setAnswerResults(prev => {
                        const newResults = { ...prev }
                        delete newResults[currentQuestion]
                        return newResults
                      })
                    }}
                    placeholder="请输入您的答案..."
                    rows={8}
                    className="resize-none"
                    disabled={!!currentResult}
                  />
                )}
              />
            )}
          </div>

          {/* 答案判断区域 */}
          {currentResult && (
            <div className={`p-4 border-t ${
              currentResult.isCorrect === true ? 'bg-green-500/10 border-green-500/20' :
              currentResult.isCorrect === false ? 'bg-red-500/10 border-red-500/20' :
              'bg-blue-500/10 border-blue-500/20'
            }`}>
              {currentResult.isCorrect === true && (
                <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                  <IconCheck className="h-5 w-5" />
                  回答正确！
                </div>
              )}
              {currentResult.isCorrect === false && (
                <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
                  <IconX className="h-5 w-5" />
                  回答错误
                </div>
              )}
              {currentResult.isCorrect === null && (
                <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                  <IconCheck className="h-5 w-5" />
                  参考答案
                </div>
              )}
              {currentQ.type === 'OBJECTIVE' ? (
                <div className="text-sm">
                  <span className="text-muted-foreground">正确答案：</span>
                  <span className="font-medium">{currentResult.correctAnswer}</span>
                  {currentResult.explanation && (
                    <div className="mt-2 text-muted-foreground">
                      <span className="font-medium">解析：</span>{currentResult.explanation}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm whitespace-pre-wrap">{currentResult.correctAnswer}</div>
              )}
            </div>
          )}
        </Card>

        {/* 导航按钮 */}
        <div className="flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            上一题
          </Button>

          {!currentResult ? (
            <Button
              type="button"
              onClick={checkAnswer}
              disabled={!form.state.values[currentQ.id]}
              className="flex-1"
            >
              提交答案
            </Button>
          ) : currentQuestion === questions.length - 1 ? (
            <Button
              type="button"
              onClick={() => form.handleSubmit()}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  完成测验
                  <IconCheck className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1"
            >
              下一题
              <IconArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
