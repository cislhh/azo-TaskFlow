'use client'

import { useState, useEffect } from 'react'
import { GoalList } from '@/components/goals/goal-list'
import { GoalCreateButton } from '@/components/goals/goal-create-button'
import { GoalCreateDialog } from '@/components/goals/goal-create-dialog'
import { getGoals } from '@/lib/actions/goals'
import type { Goal } from '@/types/goal'

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    setIsLoading(true)
    const fetchedGoals = await getGoals()
    setGoals(fetchedGoals)
    setIsLoading(false)
  }

  const handleCreateSuccess = () => {
    loadGoals()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">目标</h2>
        <GoalCreateButton onClick={() => setIsDialogOpen(true)} />
      </div>
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : (
        <GoalList goals={goals} onRefresh={loadGoals} />
      )}
      <GoalCreateDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}
