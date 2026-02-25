export interface Goal {
  id: string
  title: string
  description: string | null
  targetDate: Date
  progress: number
  createdAt: Date
  updatedAt: Date
}

export interface GoalInput {
  title: string
  description?: string
  targetDate: Date
  progress?: number
}
