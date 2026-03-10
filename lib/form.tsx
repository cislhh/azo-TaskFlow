/**
 * TanStack Form 配置
 * 集成 Shadcn UI 组件
 */

'use client'

import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'

// 创建表单上下文
export const { fieldContext, formContext } = createFormHookContexts()

// 创建自定义表单 Hook
export const useAppForm = createFormHook({
  fieldComponents: {},
  formComponents: {
    SubmitButton: Button,
  },
  fieldContext,
  formContext,
})

