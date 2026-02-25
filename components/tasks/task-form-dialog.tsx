'use client'

import { useState, useTransition, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { createTask, updateTask } from '@/lib/actions/tasks'
import { type TaskInput } from '@/lib/validations/task'
import type { Task, TaskStatus } from '@/types/task'
import { STATUS_LABELS } from '@/types/task'

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  task?: Task
  onSuccess?: () => void
}

export function TaskFormDialog({
  open,
  onOpenChange,
  mode,
  task,
  onSuccess,
}: TaskFormDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formData, setFormData] = useState<Partial<TaskInput & { status?: TaskStatus }>>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: new Date(),
    status: 'TODO',
  })

  // 当对话框打开时，根据模式初始化表单数据
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && task) {
        // 编辑模式：使用任务数据
        setFormData({
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          dueDate: new Date(task.dueDate),
          status: task.status,
        })
      } else {
        // 创建模式：使用默认值
        setFormData({
          title: '',
          description: '',
          priority: 'MEDIUM',
          dueDate: new Date(),
          status: 'TODO',
        })
      }
      setErrors({})
    }
  }, [open, mode, task])

  // 格式化日期为 datetime-local 输入格式
  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    startTransition(async () => {
      let result

      if (mode === 'create') {
        // 创建模式
        result = await createTask(formData)
      } else {
        // 编辑模式
        if (!task) {
          setErrors({ _form: ['任务不存在'] })
          return
        }
        // 转换 formData 为正确的类型
        const updateData = {
          title: formData.title || '',
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate instanceof Date ? formData.dueDate : new Date(formData.dueDate as string | number | Date),
          status: formData.status,
        }
        result = await updateTask(task.id, updateData)
      }

      if (result.success && result.data) {
        // 成功：关闭对话框并重置表单
        onOpenChange(false)
        setFormData({
          title: '',
          description: '',
          priority: 'MEDIUM',
          dueDate: new Date(),
          status: 'TODO',
        })
        onSuccess?.()
      } else {
        // 失败：显示错误
        if ('errors' in result && result.errors) {
          setErrors(result.errors as Record<string, string[]>)
        } else if ('error' in result && result.error) {
          setErrors({ _form: [result.error] })
        }
      }
    })
  }

  const handleFieldChange = (
    field: keyof TaskInput,
    value: string | File
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // 清除该字段的错误
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const title = mode === 'create' ? '创建任务' : '编辑任务'
  const description = mode === 'create'
    ? '创建一个新的任务，添加到您的任务列表中。'
    : '修改任务信息，保存后将更新任务列表。'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            {/* 全局错误 */}
            {errors._form && (
              <FieldError
                errors={errors._form.map((msg) => ({ message: msg }))}
              />
            )}

            {/* 标题 */}
            <Field>
              <FieldLabel htmlFor="title">标题</FieldLabel>
              <FieldContent>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="请输入任务标题"
                  disabled={isPending}
                  aria-invalid={!!errors.title}
                  required
                />
                {errors.title && (
                  <FieldError
                    errors={errors.title.map((msg) => ({ message: msg }))}
                  />
                )}
              </FieldContent>
            </Field>

            {/* 描述 */}
            <Field>
              <FieldLabel htmlFor="description">描述（可选）</FieldLabel>
              <FieldContent>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) =>
                    handleFieldChange('description', e.target.value)
                  }
                  placeholder="请输入任务描述"
                  disabled={isPending}
                  rows={3}
                />
                {errors.description && (
                  <FieldError
                    errors={errors.description.map((msg) => ({ message: msg }))}
                  />
                )}
              </FieldContent>
            </Field>

            {/* 状态（仅编辑模式） */}
            {mode === 'edit' && (
              <Field>
                <FieldLabel htmlFor="status">状态</FieldLabel>
                <FieldContent>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleFieldChange('status', value)
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODO">待办</SelectItem>
                      <SelectItem value="IN_PROGRESS">进行中</SelectItem>
                      <SelectItem value="COMPLETED">已完成</SelectItem>
                      <SelectItem value="CANCELLED">已取消</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <FieldError
                      errors={errors.status.map((msg) => ({ message: msg }))}
                    />
                  )}
                </FieldContent>
              </Field>
            )}

            {/* 优先级 */}
            <Field>
              <FieldLabel htmlFor="priority">优先级</FieldLabel>
              <FieldContent>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleFieldChange('priority', value)
                  }
                  disabled={isPending}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">低</SelectItem>
                    <SelectItem value="MEDIUM">中</SelectItem>
                    <SelectItem value="HIGH">高</SelectItem>
                    <SelectItem value="URGENT">紧急</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <FieldError
                    errors={errors.priority.map((msg) => ({ message: msg }))}
                  />
                )}
              </FieldContent>
            </Field>

            {/* 到期日期 */}
            <Field>
              <FieldLabel htmlFor="dueDate">到期日期</FieldLabel>
              <FieldContent>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={
                    formData.dueDate instanceof Date
                      ? formatDateForInput(formData.dueDate)
                      : ''
                  }
                  onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                  disabled={isPending}
                  aria-invalid={!!errors.dueDate}
                  required
                />
                {errors.dueDate && (
                  <FieldError
                    errors={errors.dueDate.map((msg) => ({ message: msg }))}
                  />
                )}
              </FieldContent>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              取消
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? (mode === 'create' ? '创建中...' : '保存中...')
                : (mode === 'create' ? '创建任务' : '保存更改')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
