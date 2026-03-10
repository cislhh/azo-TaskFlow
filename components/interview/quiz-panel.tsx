/**
 * 答题面板组件 - 右侧
 * 优化后的 UI/UX 设计
 */

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { IconCheck, IconX, IconArrowLeft, IconArrowRight } from '@tabler/icons-react'

interface Quiz {
  id: string
  status: string
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

interface QuizPanelProps {
  quiz: Quiz
}

interface AnswerResult {
  isCorrect: boolean | null
  correctAnswer?: string
  explanation?: string
}

export function QuizPanel({ quiz }: QuizPanelProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [answerResults, setAnswerResults] = useState<Record<number, AnswerResult>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const questions = quiz.questions
  const currentQ = questions[currentQuestion]
  const options = currentQ?.options?.options || []
  const currentResult = answerResults[currentQuestion]
  const userAnswer = answers[currentQ.id]

  const difficultyConfig = {
    EASY: {
      color: 'bg-green-50 text-green-700 border-green-200',
      label: '简单'
    },
    MEDIUM: {
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      label: '中等'
    },
    HARD: {
      color: 'bg-red-50 text-red-700 border-red-200',
      label: '困难'
    },
  }

  // 判断答案
  const checkAnswer = () => {
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
      // 主观题：优先使用 correctAnswer，如果没有则使用 explanation
      const referenceAnswer = currentQ.correctAnswer || currentQ.explanation || '暂无参考答案'
      result = {
        isCorrect: null,
        correctAnswer: referenceAnswer,
        explanation: currentQ.explanation || '',
      }
    }

    setAnswerResults(prev => ({ ...prev, [currentQuestion]: result }))
  }

  // 下一题（先判断再切换）
  const handleNext = () => {
    if (!currentResult) {
      checkAnswer()
    } else if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  // 上一题
  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // 提交所有答案
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: quiz.id, answers }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '提交失败')
      }

      // 延迟跳转，让用户看到 loading 状态
      await new Promise(resolve => setTimeout(resolve, 500))
      window.location.href = `/interview/quiz/${quiz.id}`
    } catch (error) {
      console.error('提交失败:', error)
      alert(error instanceof Error ? error.message : '提交失败，请重试')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* 提交中的全屏遮罩 */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-slate-900">正在提交测验...</p>
              <p className="text-sm text-slate-500">请稍候，正在生成您的测验结果</p>
            </div>
          </div>
        </div>
      )}

      <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* 头部：进度和难度 */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">
            题目 <span className="font-semibold text-slate-900">{currentQuestion + 1}</span>
            <span className="text-slate-400"> / </span>
            {questions.length}
          </span>
          <Badge
            variant="secondary"
            className={`text-xs border ${difficultyConfig[currentQ.difficulty].color}`}
          >
            {difficultyConfig[currentQ.difficulty].label}
          </Badge>
        </div>
        {/* 进度条 */}
        <div className="mt-3 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 题目内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="text-base text-slate-900 mb-6 leading-relaxed">{currentQ.text}</div>

        {currentQ.type === 'OBJECTIVE' ? (
          <RadioGroup
            value={userAnswer || ''}
            onValueChange={(v) => {
              setAnswers(prev => ({ ...prev, [currentQ.id]: v }))
              setAnswerResults(prev => {
                const newResults = { ...prev }
                delete newResults[currentQuestion]
                return newResults
              })
            }}
            disabled={!!currentResult}
            className="space-y-2"
          >
            {options.map((option, index) => {
              const letter = ['A', 'B', 'C', 'D'][index]
              const optionText = typeof option === 'string' ? option : option.text
              const optionId = typeof option === 'string' ? letter : option.id

              const isCorrectOption = currentResult?.correctAnswer?.toLowerCase() === optionId.toLowerCase()
              const isSelected = userAnswer?.toLowerCase() === optionId.toLowerCase()
              const showWrong = currentResult && currentResult.isCorrect === false && isSelected
              const showCorrect = currentResult && isCorrectOption

              return (
                <div
                  key={letter}
                  onClick={() => {
                    if (!currentResult) {
                      setAnswers(prev => ({ ...prev, [currentQ.id]: optionId }))
                      setAnswerResults(prev => {
                        const newResults = { ...prev }
                        delete newResults[currentQuestion]
                        return newResults
                      })
                    }
                  }}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all duration-200 ${
                    showWrong ? 'bg-red-50 border-red-300' :
                    showCorrect ? 'bg-green-50 border-green-300' :
                    'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                  } ${!!currentResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <RadioGroupItem
                    value={optionId}
                    id={`${currentQ.id}-${letter}`}
                    disabled={!!currentResult}
                    className="border-slate-300 text-slate-600 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <label
                    htmlFor={`${currentQ.id}-${letter}`}
                    className={`flex-1 text-sm cursor-pointer leading-relaxed ${
                      !!currentResult ? 'cursor-not-allowed' : ''
                    } ${showCorrect ? 'text-green-700 font-medium' : 'text-slate-700'}`}
                  >
                    <span className="font-semibold text-slate-500 mr-2">{letter}.</span>
                    {optionText}
                  </label>
                  {showCorrect && <IconCheck className="h-5 w-5 text-green-600 shrink-0" />}
                  {showWrong && <IconX className="h-5 w-5 text-red-600 shrink-0" />}
                </div>
              )
            })}
          </RadioGroup>
        ) : (
          <Textarea
            value={userAnswer || ''}
            onChange={(e) => {
              setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))
              setAnswerResults(prev => {
                const newResults = { ...prev }
                delete newResults[currentQuestion]
                return newResults
              })
            }}
            placeholder="请输入您的答案..."
            rows={8}
            className="resize-none text-sm border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            disabled={!!currentResult}
          />
        )}
      </div>

      {/* 答案判断区域 - 固定在底部 */}
      {currentResult && (
        <div className={`p-4 border-t transition-all duration-300 ${
          currentResult.isCorrect === true ? 'bg-green-50 border-green-200' :
          currentResult.isCorrect === false ? 'bg-red-50 border-red-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`shrink-0 rounded-full p-1.5 ${
              currentResult.isCorrect === true ? 'bg-green-500' :
              currentResult.isCorrect === false ? 'bg-red-500' :
              'bg-blue-500'
            }`}>
              {currentResult.isCorrect === true ? (
                <IconCheck className="h-4 w-4 text-white" />
              ) : currentResult.isCorrect === false ? (
                <IconX className="h-4 w-4 text-white" />
              ) : (
                <IconCheck className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="flex-1 text-sm">
              {currentResult.isCorrect === true && (
                <p className="font-semibold text-green-700 mb-2">回答正确！</p>
              )}
              {currentResult.isCorrect === false && (
                <p className="font-semibold text-red-700 mb-2">回答错误</p>
              )}
              {currentResult.isCorrect === null && (
                <p className="font-semibold text-blue-700 mb-2">参考答案</p>
              )}
              {currentQ.type === 'OBJECTIVE' ? (
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-600">正确答案：</span>
                    <span className="font-semibold text-slate-900 ml-1">{currentResult.correctAnswer}</span>
                  </div>
                  {currentResult.explanation && (
                    <div className="text-slate-600">
                      <span className="font-medium">解析：</span>
                      {currentResult.explanation}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {currentResult.correctAnswer}
                  </div>
                  {currentResult.explanation && (
                    <div className="text-slate-600 mt-2">
                      <span className="font-medium">解析：</span>
                      {currentResult.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 导航按钮 - 固定在底部 */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="default"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="flex-1 border-slate-300 hover:bg-slate-100 hover:border-slate-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            上一题
          </Button>

          {!currentResult ? (
            <Button
              onClick={checkAnswer}
              disabled={!userAnswer}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              提交答案
            </Button>
          ) : currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
            >
              完成测验
              <IconCheck className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              下一题
              <IconArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
    </>
  )
}
