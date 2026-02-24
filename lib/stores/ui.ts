import { create } from 'zustand'

type ViewType = 'dashboard' | 'daily' | 'weekly'

interface UIState {
  // 模态框状态
  isCreateDialogOpen: boolean
  setCreateDialogOpen: (open: boolean) => void

  // 当前页面视图
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
}

export const useUIStore = create<UIState>((set) => ({
  isCreateDialogOpen: false,
  setCreateDialogOpen: (open) => set({ isCreateDialogOpen: open }),
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view })
}))
