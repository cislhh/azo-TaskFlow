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
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { createGoal, updateGoal } from '@/lib/actions/goals'
import { type GoalInput } from '@/lib/validations/goal'
import type { Goal } from '@/types/goal'
import { Progress } from '@/components/ui/progress'

interface GoalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  goal?: Goal
  onSuccess?: () => void
}

export function GoalFormDialog({
  open,
  onOpenChange,
  mode,
  goal,
  onSuccess,
}: GoalFormDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formData, setFormData] = useState<Partial<GoalInput>>({
    title: '',
    description: '',
    targetDate: new Date(),
    progress: 0,
  })

  // 当对话框打开时，根据模式初始化表单数据
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && goal) {
        setFormData({
          title: goal.title,
          description: goal.description || '',
          targetDate: new Date(goal.targetDate),
          progress: goal.progress,
        })
      } else {
        setFormData({
          title: '',
          description: '',
          targetDate: new Date(),
          progress: 0,
        })
      }
      setErrors({})
    }
  }, [open, mode, goal])

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
        result = await createGoal(formData)
      } else {
        if (!goal) {
          setErrors({ _form: ['目标不存在'] })
          return
        }
        // 转换 formData 为正确的类型
        const updateData = {
          title: formData.title || '',
          description: formData.description,
          targetDate: formData.targetDate instanceof Date ? formData.targetDate : new Date(formData.targetDate as string | number | Date),
          progress: formData.progress,
        }
        result = await updateGoal(goal.id, updateData)
      }

      if (result.success && result.data) {
        onOpenChange(false)
        onSuccess?.()
      } else {
        if ('errors' in result && result.errors) {
          setErrors(result.errors as Record<string, string[]>)
        } else if ('error' in result && result.error) {
          setErrors({ _form: [result.error] })
        }
      }
    })
  }

  const handleFieldChange = (
    field: keyof GoalInput,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const title = mode === 'create' ? '创建目标' : '编辑目标'
  const description = mode === 'create'
    ? '设定一个新的目标，追踪您的长期计划。'
    : '修改目标信息，更新您的进度。'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            {errors._form && (
              <FieldError
                errors={errors._form.map((msg) => ({ message: msg }))}
              />
            )}

            <Field>
              <FieldLabel htmlFor="title">标题</FieldLabel>
              <FieldContent>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="请输入目标标题"
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

            <Field>
              <FieldLabel htmlFor="description">描述（可选）</FieldLabel>
              <FieldContent>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) =>
                    handleFieldChange('description', e.target.value)
                  }
                  placeholder="请输入目标描述"
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

            <Field>
              <FieldLabel htmlFor="targetDate">目标日期</FieldLabel>
              <FieldContent>
                <Input
                  id="targetDate"
                  type="datetime-local"
                  value={
                    formData.targetDate instanceof Date
                      ? formatDateForInput(formData.targetDate)
                      : ''
                  }
                  onChange={(e) => handleFieldChange('targetDate', e.target.value)}
                  disabled={isPending}
                  aria-invalid={!!errors.targetDate}
                  required
                />
                {errors.targetDate && (
                  <FieldError
                    errors={errors.targetDate.map((msg) => ({ message: msg }))}
                  />
                )}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="progress">完成进度: {formData.progress}%</FieldLabel>
              <FieldContent>
                <input
                  id="progress"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => handleFieldChange('progress', parseInt(e.target.value))}
                  disabled={isPending}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="mt-2">
                  <Progress value={formData.progress || 0} />
                </div>
                {errors.progress && (
                  <FieldError
                    errors={errors.progress.map((msg) => ({ message: msg }))}
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
                : (mode === 'create' ? '创建目标' : '保存更改')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
