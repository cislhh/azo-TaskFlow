/**
 * 面试页面布局组件 - 左右分栏
 * 使用 Compound Components Pattern
 */

import { cn } from '@/lib/utils'

interface InterviewLayoutProps {
  resumePanel: React.ReactNode
  quizPanel: React.ReactNode
}

export function InterviewLayout({ resumePanel, quizPanel }: InterviewLayoutProps) {
  return (
    <div className="grid grid-cols-2 gap-6 h-full px-6 pb-6">
      <div className="flex flex-col h-full overflow-hidden">
        {resumePanel}
      </div>
      <div className="flex flex-col h-full overflow-hidden">
        {quizPanel}
      </div>
    </div>
  )
}
