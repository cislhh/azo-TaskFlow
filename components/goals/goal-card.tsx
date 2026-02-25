'use client'

import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { Goal } from '@/types/goal'
import { Button } from '@/components/ui/button'
import { IconEdit } from '@tabler/icons-react'
import { Progress } from '@/components/ui/progress'

interface GoalCardProps {
  goal: Goal
  onEdit?: (goal: Goal) => void
}

export function GoalCard({ goal, onEdit }: GoalCardProps) {
  const isCompleted = goal.progress >= 100
  const isOverdue = new Date(goal.targetDate) < new Date() && !isCompleted

  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-medium flex-1">{goal.title}</h3>
        {onEdit && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(goal)}
            className="h-6 w-6 ml-2"
          >
            <IconEdit className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {goal.description && (
        <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">完成进度</span>
          <span className={cn(
            "font-medium",
            isCompleted ? "text-green-600" : "text-gray-900"
          )}>
            {goal.progress}%
          </span>
        </div>

        <Progress value={goal.progress} />

        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span className={cn(
            isOverdue && "text-red-600 font-medium"
          )}>
            目标日期: {format(new Date(goal.targetDate), 'yyyy-MM-dd')}
            {isOverdue && ' (已逾期)'}
          </span>
          {isCompleted && (
            <span className="text-green-600 font-medium">已完成</span>
          )}
        </div>
      </div>
    </div>
  )
}
