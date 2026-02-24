/**
 * 任务实体类型定义（从数据库返回）
 */
export interface Task {
  id: string
  title: string
  description: string | null
  dueDate: Date
  priority: TaskPriority
  status: TaskStatus
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
}

/**
 * 任务优先级枚举
 */
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

/**
 * 任务状态枚举
 */
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

/**
 * 任务筛选条件
 */
export interface TaskFilters {
  startDate?: Date
  endDate?: Date
  status?: TaskStatus
  priority?: TaskPriority
}

/**
 * 任务统计数据
 */
export interface TaskStats {
  total: number
  urgent: number
  incomplete: number
  inProgress: number
  completedToday: number
  byStatus: Record<TaskStatus, number>
  completionTrend: CompletionTrendData[]
}

/**
 * 完成趋势数据点
 */
export interface CompletionTrendData {
  date: string
  daily: number
  weekly: number
  urgent: number
}

/**
 * 优先级显示标签映射
 */
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  URGENT: '紧急'
}

/**
 * 状态显示标签映射
 */
export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: '待办',
  IN_PROGRESS: '进行中',
  COMPLETED: '已完成',
  CANCELLED: '已取消'
}
