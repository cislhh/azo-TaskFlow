# 个人日程管理系统设计文档

**日期**: 2025-02-24
**技术栈**: Next.js 16 + Prisma 6 + PostgreSQL + shadcn/ui + Tailwind CSS + Zustand

---

## 1. 整体架构

### 技术架构概览

**架构原则**：服务端优先，客户端状态最小化

- **Next.js 16 App Router**：充分利用服务端组件（RSC）和部分渲染
- **Prisma 6 + PostgreSQL**：类型安全的数据库访问
- **Zod**：API和Server Actions的输入验证
- **Zustand**：仅用于UI交互状态（模态框、侧边栏展开等）
- **shadcn/ui + Tailwind CSS**：无渐变色、Grid布局为主

### 数据模型设计

```prisma
enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model Task {
  id          String       @id @default(cuid())
  title       String
  description String?
  dueDate     DateTime
  priority    TaskPriority @default(MEDIUM)
  status      TaskStatus   @default(TODO)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  completedAt DateTime?

  @@index([dueDate])
  @@index([status])
}
```

**设计说明**：
- 通过`dueDate`区分日常任务（当天）和周任务（本周范围内）
- 优先级：低/中/高/紧急
- 状态：待办/进行中/已完成/已取消
- `completedAt`记录完成时间，用于统计分析

---

## 2. 布局结构

### Grid 布局设计

**整体布局**：采用 Grid 布局，避免不必要的 Flexbox

```
布局结构：
┌─────────────────────────────────────┐
│           Header (固定高度)           │
├─────────┬───────────────────────────┤
│         │                           │
│  Aside  │         Main              │
│  (固定  │      (自适应宽度)          │
│  宽度)  │                           │
│         │                           │
└─────────┴───────────────────────────┘
```

```tsx
// 全局布局结构
<div className="grid grid-rows-[auto_1fr] grid-cols-[240px_1fr] min-h-screen">
  {/* Header - 横跨两列 */}
  <header className="col-span-2 h-16 border-b" />

  {/* Aside - 左侧导航 */}
  <aside className="border-r" />

  {/* Main - 主内容区 */}
  <main className="overflow-auto" />
</div>
```

### Main 区域布局 - 任务总览

**三分布局**（Grid 实现）

```
┌─────────────────────────────────────┐
│  饼图区域    │    数字统计区域        │ ← 各占 50% 宽度，固定高度
├─────────────────────────────────────┤
│                                     │
│          折线图区域                  │ ← 占据剩余高度
│                                     │
└─────────────────────────────────────┘
```

```tsx
<div className="grid grid-rows-[300px_1fr] gap-4 p-4">
  {/* 上半部分：左右两等分 */}
  <div className="grid grid-cols-2 gap-4">
    {/* 任务状态饼图 */}
    <div className="border rounded-lg p-4" />
    {/* 数字统计 */}
    <div className="grid grid-cols-3 gap-4">
      <div className="border rounded-lg p-4">总数</div>
      <div className="border rounded-lg p-4">紧急</div>
      <div className="border rounded-lg p-4">未完成</div>
      {/* ...更多统计卡片 */}
    </div>
  </div>

  {/* 下半部分：折线图 */}
  <div className="border rounded-lg p-4" />
</div>
```

### 日常任务 / 周任务列表布局

```tsx
<div className="grid grid-rows-[auto_1fr] gap-4">
  {/* 操作栏 */}
  <div className="flex items-center justify-between">
    <h2>日常任务</h2>
    <Button>新建任务</Button>
  </div>

  {/* 任务列表 - 使用 Grid 排列卡片 */}
  <div className="grid grid-cols-1 gap-3">
    {/* 任务卡片 */}
  </div>
</div>
```

**设计要点**：
- 全局使用 `grid` 而非 `flex` 作为主要布局方式
- Header 固定高度 64px
- Aside 固定宽度 240px
- 所有间距使用统一的 `gap-4`
- 不使用渐变色，纯色背景

---

## 3. 组件架构与服务端/客户端分离

### 组件架构树

```
app/
├── layout.tsx              # 根布局（服务端组件）
├── page.tsx                # 首页 = 任务总览（服务端组件）
│
├── tasks/
│   ├── daily/
│   │   └── page.tsx        # 日常任务页（服务端组件）
│   └── weekly/
│       └── page.tsx        # 周任务页（服务端组件）
│
└── api/                    # API Routes（如需要）

components/
├── layout/
│   ├── header.tsx          # 顶部导航（服务端组件）
│   ├── aside.tsx           # 侧边栏（客户端组件 - Zustand）
│   └── main-layout.tsx     # 布局容器（服务端组件）
│
├── dashboard/
│   ├── task-pie-chart.tsx  # 饼图（客户端组件）
│   ├── task-stats.tsx      # 数字统计（服务端组件）
│   └── task-line-chart.tsx # 折线图（客户端组件）
│
├── tasks/
│   ├── task-list.tsx       # 任务列表（服务端组件）
│   ├── task-card.tsx       # 任务卡片（服务端组件）
│   ├── task-create-dialog.tsx  # 创建任务弹窗（客户端组件）
│   └── task-form.tsx       # 任务表单（客户端组件）
│
└── ui/                     # shadcn 组件（已有）

lib/
├── db.ts                   # Prisma 客户端
├── actions/
│   ├── tasks.ts            # 任务相关 Server Actions
│   └── stats.ts            # 统计数据 Server Actions
├── validations/
│   └── task.ts             # Zod 验证 schema
└── stores/
    └── ui.ts               # Zustand UI 状态
```

### 服务端组件 vs 客户端组件划分原则

**服务端组件（默认）**：
- ✅ 数据获取和渲染
- ✅ 列表展示
- ✅ 表单容器（但提交逻辑用 Server Actions）
- ✅ 统计卡片

**客户端组件（明确标记 "use client"）**：
- ✅ 需要用户交互的模态框/弹窗
- ✅ 图表组件（使用 recharts）
- ✅ 表单输入和实时验证
- ✅ Zustand 状态管理

### Server Actions 设计

```typescript
// lib/actions/tasks.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { taskSchema } from '@/lib/validations/task'

export async function getTasks(filters?: TaskFilters) {
  // 服务端查询
}

export async function createTask(data: z.infer<typeof taskSchema>) {
  // 验证 + 创建
}

export async function updateTask(id: string, data: Partial<Task>) {
  // 更新
}

export async function deleteTask(id: string) {
  // 删除
}

export async function getTaskStats() {
  // 返回统计数据：总数、紧急数、未完成数等
}
```

### Zod 验证 Schema

```typescript
// lib/validations/task.ts
import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100),
  description: z.string().optional(),
  dueDate: z.coerce.date(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional()
})

export type TaskInput = z.infer<typeof taskSchema>
```

### Zustand UI 状态（最小化）

```typescript
// lib/stores/ui.ts
import { create } from 'zustand'

interface UIState {
  // 模态框状态
  isCreateDialogOpen: boolean
  setCreateDialogOpen: (open: boolean) => void

  // 当前页面视图
  currentView: 'dashboard' | 'daily' | 'weekly'
  setCurrentView: (view: UIState['currentView']) => void
}

export const useUIStore = create<UIState>((set) => ({
  isCreateDialogOpen: false,
  setCreateDialogOpen: (open) => set({ isCreateDialogOpen: open }),
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view })
}))
```

### 数据流示例

```
用户点击"创建任务"按钮
  ↓
触发 Zustand: useUIStore.setCreateDialogOpen(true)
  ↓
客户端组件 TaskCreateDialog 渲染表单
  ↓
用户提交表单
  ↓
调用 Server Action: createTask(formData)
  ↓
Zod 验证 → Prisma 创建 → 返回结果
  ↓
服务端重新渲染，显示新数据
```

### Tailwind CSS 类名顺序规范

```typescript
// 推荐顺序（参考 Tailwind 官方建议）
<div className="
  w-full h-64           /* 1. 尺寸 */
  grid grid-cols-2      /* 2. 布局 */
  gap-4                 /* 3. 间距 */
  p-4                   /* 4. 内边距 */
  border rounded-lg     /* 5. 边框/圆角 */
  bg-white text-gray-900 /* 6. 颜色 */
  shadow-sm             /* 7. 阴影 */
  hover:shadow-md       /* 8. 伪类 */
  transition-shadow     /* 9. 过渡 */
"/>
```

---

## 4. 路由结构与页面实现

### 路由结构

```
/                    # 任务总览（Dashboard）
/tasks/daily         # 日常任务
/tasks/weekly        # 周任务
```

### 页面实现详解

#### 根布局 (`app/layout.tsx`)

```tsx
import type { ReactNode } from 'react'
import { MainLayout } from '@/components/layout/main-layout'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 text-gray-900">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}
```

#### 主布局容器 (`components/layout/main-layout.tsx`)

```tsx
// 服务端组件
import { Header } from './header'
import { Aside } from './aside'

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-rows-[auto_1fr] grid-cols-[240px_1fr] min-h-screen">
      <Header className="col-span-2 row-start-1" />
      <Aside className="row-start-2" />
      <main className="row-start-2 overflow-auto bg-white">
        {children}
      </main>
    </div>
  )
}
```

#### 顶部导航 (`components/layout/header.tsx`)

```tsx
// 服务端组件
export function Header({ className }: { className?: string }) {
  return (
    <header className={cn("h-16 border-b bg-white px-6 flex items-center justify-between", className)}>
      <h1 className="text-xl font-semibold">任务管理系统</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{new Date().toLocaleDateString('zh-CN')}</span>
      </div>
    </header>
  )
}
```

#### 侧边栏 (`components/layout/aside.tsx`)

```tsx
// 客户端组件 - 使用 Zustand 管理当前视图
'use client'

import Link from 'next/link'
import { useUIStore } from '@/lib/stores/ui'

export function Aside({ className }: { className?: string }) {
  const currentView = useUIStore((state) => state.currentView)

  const navItems = [
    { href: '/', label: '任务总览', value: 'dashboard' },
    { href: '/tasks/daily', label: '日常任务', value: 'daily' },
    { href: '/tasks/weekly', label: '周任务', value: 'weekly' }
  ] as const

  return (
    <aside className={cn("border-r bg-gray-50 p-4", className)}>
      <nav className="grid gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              currentView === item.value
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

#### 任务总览页 (`app/page.tsx`)

```tsx
// 服务端组件
import { TaskPieChart } from '@/components/dashboard/task-pie-chart'
import { TaskStats } from '@/components/dashboard/task-stats'
import { TaskLineChart } from '@/components/dashboard/task-line-chart'
import { getTaskStats } from '@/lib/actions/stats'

export default async function DashboardPage() {
  const stats = await getTaskStats()

  return (
    <div className="grid grid-rows-[300px_1fr] gap-4 p-6">
      {/* 上半部分 */}
      <div className="grid grid-cols-2 gap-4">
        <TaskPieChart data={stats.byStatus} />
        <TaskStats stats={stats} />
      </div>

      {/* 下半部分 */}
      <TaskLineChart data={stats.completionTrend} />
    </div>
  )
}
```

#### 日常任务页 (`app/tasks/daily/page.tsx`)

```tsx
// 服务端组件
import { TaskList } from '@/components/tasks/task-list'
import { TaskCreateButton } from '@/components/tasks/task-create-button'
import { getTasks } from '@/lib/actions/tasks'

export default async function DailyTasksPage() {
  const today = new Date()
  const tasks = await getTasks({
    startDate: startOfDay(today),
    endDate: endOfDay(today)
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">日常任务</h2>
        <TaskCreateButton type="daily" />
      </div>
      <TaskList tasks={tasks} />
    </div>
  )
}
```

#### 创建任务弹窗 (`components/tasks/task-create-dialog.tsx`)

```tsx
// 客户端组件
'use client'

import { useState } from 'react'
import { useUIStore } from '@/lib/stores/ui'
import { createTask } from '@/lib/actions/tasks'
import { taskSchema } from '@/lib/validations/task'
import { Dialog } from '@/components/ui/dialog'
import { TaskForm } from './task-form'

export function TaskCreateButton({ type }: { type: 'daily' | 'weekly' }) {
  const setIsOpen = useUIStore((state) => state.setCreateDialogOpen)
  const isOpen = useUIStore((state) => state.isCreateDialogOpen)

  const handleSubmit = async (data: z.infer<typeof taskSchema>) => {
    await createTask(data)
    setIsOpen(false)
    // 使用 router.refresh() 重新验证服务端数据
    router.refresh()
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>创建任务</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <TaskForm onSubmit={handleSubmit} />
      </Dialog>
    </>
  )
}
```

---

## 5. 图表组件与开发规范

### 图表库选择

使用 **Recharts**（React 生态最流行的图表库，与 shadcn/ui 搭配良好）

```bash
pnpm add recharts
```

### 饼图组件 (`components/dashboard/task-pie-chart.tsx`)

```tsx
// 客户端组件
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = {
  TODO: '#94a3b8',        // gray-400
  IN_PROGRESS: '#3b82f6', // blue-500
  COMPLETED: '#22c55e',   // green-500
  CANCELLED: '#ef4444'    // red-500
}

interface TaskPieChartProps {
  data: Record<TaskStatus, number>
}

export function TaskPieChart({ data }: TaskPieChartProps) {
  const chartData = Object.entries(data)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: statusLabelMap[status as TaskStatus],
      value: count,
      color: COLORS[status as TaskStatus]
    }))

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="text-lg font-semibold mb-4">任务状态分布</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

const statusLabelMap: Record<TaskStatus, string> = {
  TODO: '待办',
  IN_PROGRESS: '进行中',
  COMPLETED: '已完成',
  CANCELLED: '已取消'
}
```

### 数字统计组件 (`components/dashboard/task-stats.tsx`)

```tsx
// 服务端组件
interface TaskStatsProps {
  stats: {
    total: number
    urgent: number
    incomplete: number
    inProgress: number
    completedToday: number
  }
}

export function TaskStats({ stats }: TaskStatsProps) {
  const items = [
    { label: '总任务数', value: stats.total, color: 'bg-blue-50 text-blue-700' },
    { label: '紧急任务', value: stats.urgent, color: 'bg-red-50 text-red-700' },
    { label: '未完成', value: stats.incomplete, color: 'bg-gray-50 text-gray-700' },
    { label: '进行中', value: stats.inProgress, color: 'bg-yellow-50 text-yellow-700' },
    { label: '今日完成', value: stats.completedToday, color: 'bg-green-50 text-green-700' },
  ]

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="text-lg font-semibold mb-4">任务总览</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className={cn("p-4 rounded-lg", item.color)}>
            <div className="text-sm opacity-80">{item.label}</div>
            <div className="text-3xl font-bold mt-1">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 折线图组件 (`components/dashboard/task-line-chart.tsx`)

```tsx
// 客户端组件
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TaskLineChartProps {
  data: Array<{ date: string; daily: number; weekly: number; urgent: number }>
}

export function TaskLineChart({ data }: TaskLineChartProps) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="text-lg font-semibold mb-4">完成任务趋势</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Line type="monotone" dataKey="daily" stroke="#3b82f6" name="日常任务" strokeWidth={2} />
          <Line type="monotone" dataKey="weekly" stroke="#8b5cf6" name="周任务" strokeWidth={2} />
          <Line type="monotone" dataKey="urgent" stroke="#ef4444" name="紧急任务" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

### 错误处理与验证

**Zod 验证错误处理**：

```typescript
// lib/actions/tasks.ts
export async function createTask(data: unknown) {
  // 验证输入
  const result = taskSchema.safeParse(data)

  if (!result.success) {
    const errors = result.error.flatten()
    return {
      success: false,
      errors: errors.fieldErrors
    }
  }

  try {
    const task = await prisma.task.create({
      data: result.data
    })

    return { success: true, data: task }
  } catch (error) {
    return {
      success: false,
      error: '创建任务失败'
    }
  }
}
```

**表单错误显示**：

```tsx
// components/tasks/task-form.tsx
'use client'

import { useFormState } from 'react-dom'

export function TaskForm({ onSubmit }: { onSubmit: (data: TaskInput) => Promise<void> }) {
  const [state, formAction] = useFormState(onSubmit, null)

  return (
    <form action={formAction} className="grid gap-4">
      <div>
        <Label>标题</Label>
        <Input name="title" />
        {state?.errors?.title && (
          <p className="text-sm text-red-600 mt-1">{state.errors.title[0]}</p>
        )}
      </div>
      {/* ...其他字段 */}
    </form>
  )
}
```

### Tailwind CSS 类名顺序规范（详细）

```typescript
// 统一顺序（使用 prettier 插件自动排序）
// 推荐安装: pnpm add -D prettier-plugin-tailwindcss

export function Example() {
  return (
    <div className="
      w-full h-64           /* Box Model - 尺寸 */
      grid grid-cols-2      /* Layout - 布局方式 */
      gap-4                 /* Spacing - 间距 */
      p-4                   /* Spacing - 内边距 */
      border rounded-lg     /* Borders - 边框 */
      bg-white text-gray-900 /* Colors - 颜色 */
      shadow-sm             /* Effects - 阴影/效果 */
      hover:shadow-md       /* States - 伪类状态 */
      transition-shadow     /* Transitions - 过渡动画 */
      focus-visible:ring-2  /* States - 焦点状态 */
    ">
      Content
    </div>
  )
}
```

### Prettier 配置

```json
// .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

### 开发规范总结

| 规范 | 说明 |
|------|------|
| **服务端优先** | 默认使用服务端组件，只在必要时标记 "use client" |
| **类型安全** | 所有函数参数、返回值明确标注类型 |
| **Grid > Flex** | 布局优先使用 Grid，仅在必要时使用 Flex |
| **无渐变** | 所有颜色使用纯色，不使用 gradient |
| **Zod 验证** | 所有 Server Actions 输入使用 Zod 验证 |
| **错误处理** | 统一的错误返回格式 |
| **Tailwind 顺序** | 使用 prettier-plugin-tailwindcss 自动排序 |

---

## 6. 统计查询与项目配置

### Prisma 统计查询实现

```typescript
// lib/actions/stats.ts
'use server'

import { prisma } from '@/lib/db'
import { startOfDay, endOfDay, subDays, format } from 'date-fns'

export async function getTaskStats() {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)
  const weekAgo = subDays(now, 7)

  // 并行查询所有统计数据
  const [
    total,
    urgent,
    incomplete,
    inProgress,
    completedToday,
    tasksByStatus,
    completionTrend
  ] = await Promise.all([
    // 总任务数
    prisma.task.count(),

    // 紧急任务数
    prisma.task.count({ where: { priority: 'URGENT' } }),

    // 未完成任务数
    prisma.task.count({ where: { status: { in: ['TODO', 'IN_PROGRESS'] } } }),

    // 进行中任务数
    prisma.task.count({ where: { status: 'IN_PROGRESS' } }),

    // 今日完成任务数
    prisma.task.count({
      where: {
        status: 'COMPLETED',
        completedAt: { gte: todayStart, lte: todayEnd }
      }
    }),

    // 按状态统计
    prisma.task.groupBy({
      by: ['status'],
      _count: true
    }),

    // 过去7天完成趋势
    prisma.task.findMany({
      where: {
        status: 'COMPLETED',
        completedAt: { gte: weekAgo }
      },
      select: {
        completedAt: true,
        priority: true
      }
    })
  ])

  // 处理按状态统计
  const byStatus: Record<string, number> = {
    TODO: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0
  }

  tasksByStatus.forEach(item => {
    byStatus[item.status] = item._count
  })

  // 处理完成趋势（按日期聚合）
  const trendMap = new Map<string, { daily: number; weekly: number; urgent: number }>()

  for (let i = 6; i >= 0; i--) {
    const date = format(subDays(now, i), 'MM-dd')
    trendMap.set(date, { daily: 0, weekly: 0, urgent: 0 })
  }

  completionTrend.forEach(task => {
    if (!task.completedAt) return
    const date = format(task.completedAt, 'MM-dd')
    const entry = trendMap.get(date)

    if (entry) {
      // 简化判断：根据任务的 dueDate 范围判断是日常还是周任务
      // 实际项目中可能需要更复杂的逻辑
      entry.daily += 1
      if (task.priority === 'URGENT') {
        entry.urgent += 1
      }
    }
  })

  const completionTrendArray = Array.from(trendMap.entries()).map(([date, counts]) => ({
    date,
    ...counts
  }))

  return {
    total,
    urgent,
    incomplete,
    inProgress,
    completedToday,
    byStatus,
    completionTrend: completionTrendArray
  }
}
```

### 环境变量配置

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"
```

```bash
# .env.example
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"
```

### 需要安装的依赖

```bash
# 核心依赖
pnpm add prisma @prisma/client
pnpm add zod
pnpm add zustand
pnpm add recharts
pnpm add date-fns

# 开发依赖
pnpm add -D @types/node

# Prettier 插件
pnpm add -D prettier-plugin-tailwindcss
```

### Prisma Schema 完整版

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model Task {
  id          String       @id @default(cuid())
  title       String
  description String?
  dueDate     DateTime
  priority    TaskPriority @default(MEDIUM)
  status      TaskStatus   @default(TODO)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  completedAt DateTime?

  @@index([dueDate])
  @@index([status])
  @@index([priority])
}
```

### Next.js 配置

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  }
}

export default nextConfig
```

---

## 7. 项目目录结构总览

```
azo-taskflow/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 任务总览
│   └── tasks/
│       ├── daily/
│       │   └── page.tsx        # 日常任务页
│       └── weekly/
│           └── page.tsx        # 周任务页
│
├── components/
│   ├── layout/
│   │   ├── header.tsx          # 顶部导航
│   │   ├── aside.tsx           # 侧边栏（客户端）
│   │   └── main-layout.tsx     # 布局容器
│   ├── dashboard/
│   │   ├── task-pie-chart.tsx  # 饼图（客户端）
│   │   ├── task-stats.tsx      # 数字统计
│   │   └── task-line-chart.tsx # 折线图（客户端）
│   ├── tasks/
│   │   ├── task-list.tsx       # 任务列表
│   │   ├── task-card.tsx       # 任务卡片
│   │   ├── task-create-dialog.tsx  # 创建弹窗（客户端）
│   │   ├── task-form.tsx       # 任务表单（客户端）
│   │   └── task-create-button.tsx  # 创建按钮（客户端）
│   └── ui/                     # shadcn 组件
│
├── lib/
│   ├── db.ts                   # Prisma 客户端
│   ├── actions/
│   │   ├── tasks.ts            # 任务 Server Actions
│   │   └── stats.ts            # 统计 Server Actions
│   ├── validations/
│   │   └── task.ts             # Zod schemas
│   ├── stores/
│   │   └── ui.ts               # Zustand store
│   └── utils.ts                # cn() 工具函数
│
├── prisma/
│   ├── schema.prisma           # 数据库模型
│   └── migrations/             # 迁移文件
│
├── types/
│   └── task.ts                 # TypeScript 类型
│
├── docs/
│   └── plans/
│       └── 2025-02-24-task-management-system-design.md
│
├── .env
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 8. 开发工作流

```bash
# 1. 安装依赖
pnpm install

# 2. 配置数据库
cp .env.example .env
# 编辑 .env 文件设置 DATABASE_URL

# 3. 初始化数据库
pnpm prisma migrate dev --name init

# 4. 启动开发服务器
pnpm dev

# 5. 访问应用
open http://localhost:3000
```

---

## 9. 设计总结

| 特性 | 实现方案 |
|------|---------|
| **布局** | Grid 布局，Header + Aside + Main |
| **样式** | Tailwind CSS + shadcn/ui，无渐变色 |
| **状态管理** | Zustand 仅管理 UI 状态 |
| **数据获取** | Server Actions + Prisma |
| **验证** | Zod schema 验证 |
| **类型安全** | 完整 TypeScript 类型系统 |
| **图表** | Recharts 实现饼图和折线图 |
| **服务端优先** | 默认服务端组件，最小化客户端 |

---

**文档版本**: 1.0
**最后更新**: 2025-02-24
