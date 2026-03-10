/**
 * 面试练习主页面 - 左右分栏布局
 * 左侧：简历上传和内容展示
 * 右侧：答题区域（题目、选项、答案判断）
 */

import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { IconLoader2 } from '@tabler/icons-react'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { ResumePanel } from '@/components/interview/resume-panel'
import { QuizPanel } from '@/components/interview/quiz-panel'

async function getQuizzes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/quiz`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch quizzes')
  }

  return res.json()
}

export default async function InterviewPage() {
  const data = await getQuizzes()
  const quizzes = data.quizzes || []

  // 获取最新的进行中或草稿状态的测验
  const activeQuiz = quizzes.find((q: any) =>
    q.status === 'IN_PROGRESS' || q.status === 'DRAFT'
  ) || quizzes[0] || null

  return (
    <div className="h-[calc(100vh-5rem)]">
      <InterviewLayout
        resumePanel={<ResumePanel />}
        quizPanel={
          <Suspense fallback={<QuizPanelSkeleton />}>
            <QuizPanelWrapper quizId={activeQuiz?.id} />
          </Suspense>
        }
      />
    </div>
  )
}

async function QuizPanelWrapper({ quizId }: { quizId: string | null }) {
  if (!quizId) {
    return <QuizPanelEmpty />
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/quiz/${quizId}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return <QuizPanelError />
  }

  const data = await res.json()

  if (data.quiz?.status === 'COMPLETED') {
    return <QuizPanelCompleted quizId={quizId} />
  }

  return <QuizPanel quiz={data.quiz} />
}

function QuizPanelSkeleton() {
  return (
    <Card className="h-full flex items-center justify-center">
      <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </Card>
  )
}

function QuizPanelEmpty() {
  return (
    <Card className="h-full flex items-center justify-center p-8 text-center">
      <div>
        <h3 className="text-lg font-semibold mb-2">开始面试练习</h3>
        <p className="text-sm text-muted-foreground">
          在左侧上传简历，AI 将为您生成面试题
        </p>
      </div>
    </Card>
  )
}

function QuizPanelError() {
  return (
    <Card className="h-full flex items-center justify-center p-8 text-center">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-destructive">加载失败</h3>
        <p className="text-sm text-muted-foreground">
          无法加载测验数据，请重试
        </p>
      </div>
    </Card>
  )
}

function QuizPanelCompleted({ quizId }: { quizId: string }) {
  return (
    <Card className="h-full flex items-center justify-center p-8 text-center">
      <div>
        <h3 className="text-lg font-semibold mb-2">测验已完成</h3>
        <p className="text-sm text-muted-foreground mb-4">
          查看您的测验结果
        </p>
        <a
          href={`/interview/quiz/${quizId}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2"
        >
          查看结果
        </a>
      </div>
    </Card>
  )
}
