'use client'

import { useState } from 'react'
import type { Goal } from '@/types/goal'
import { GoalCard } from './goal-card'
import { GoalFormDialog } from './goal-form-dialog'

interface GoalListProps {
  goals: Goal[]
  onRefresh?: () => void
}

export function GoalList({ goals, onRefresh }: GoalListProps) {
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingGoal(null)
    onRefresh?.()
  }

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      setEditingGoal(null)
    }
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        暂无目标
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onEdit={handleEdit} />
        ))}
      </div>

      {/* 编辑对话框 */}
      {editingGoal && (
        <GoalFormDialog
          open={isEditDialogOpen}
          onOpenChange={handleEditDialogChange}
          mode="edit"
          goal={editingGoal}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  )
}
