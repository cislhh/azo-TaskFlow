import { create } from 'zustand'

type ViewType = 'dashboard' | 'daily' | 'weekly'

interface UIState {
  // 当前页面视图
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
}

export const useUIStore = create<UIState>((set) => ({
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view })
}))
