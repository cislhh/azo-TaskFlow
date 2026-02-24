import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '../ui'

describe('UI Store', () => {
  beforeEach(() => {
    // 重置 store 状态
    useUIStore.setState({
      isCreateDialogOpen: false,
      currentView: 'dashboard'
    })
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useUIStore.getState()
      expect(state.isCreateDialogOpen).toBe(false)
      expect(state.currentView).toBe('dashboard')
    })
  })

  describe('isCreateDialogOpen', () => {
    it('should set create dialog open to true', () => {
      useUIStore.getState().setCreateDialogOpen(true)
      expect(useUIStore.getState().isCreateDialogOpen).toBe(true)
    })

    it('should set create dialog open to false', () => {
      useUIStore.setState({ isCreateDialogOpen: true })
      useUIStore.getState().setCreateDialogOpen(false)
      expect(useUIStore.getState().isCreateDialogOpen).toBe(false)
    })
  })

  describe('currentView', () => {
    it('should set view to dashboard', () => {
      useUIStore.getState().setCurrentView('dashboard')
      expect(useUIStore.getState().currentView).toBe('dashboard')
    })

    it('should set view to daily', () => {
      useUIStore.getState().setCurrentView('daily')
      expect(useUIStore.getState().currentView).toBe('daily')
    })

    it('should set view to weekly', () => {
      useUIStore.getState().setCurrentView('weekly')
      expect(useUIStore.getState().currentView).toBe('weekly')
    })
  })

  describe('state independence', () => {
    it('should handle multiple state changes', () => {
      useUIStore.getState().setCreateDialogOpen(true)
      useUIStore.getState().setCurrentView('daily')
      useUIStore.getState().setCreateDialogOpen(false)
      useUIStore.getState().setCurrentView('weekly')

      const state = useUIStore.getState()
      expect(state.isCreateDialogOpen).toBe(false)
      expect(state.currentView).toBe('weekly')
    })
  })
})
