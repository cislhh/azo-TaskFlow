/**
 * 测验详情页面
 */

import { notFound } from 'next/navigation'
import { QuizInterface } from '@/components/interview/quiz-interface'
import { QuizResult } from '@/components/interview/quiz-result'
import { Button } from '@/components/ui/button'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

async function getQuiz(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/quiz/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getQuiz(id)

  if (!data) {
    notFound()
  }

  const { quiz } = data

  if (quiz.status === 'COMPLETED') {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Link href="/interview">
          <Button variant="ghost" className="mb-4">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
        </Link>
        <QuizResult quiz={quiz} />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link href="/interview">
        <Button variant="ghost" className="mb-4">
          <IconArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
      </Link>

      <QuizInterface quiz={quiz} />
    </div>
  )
}
