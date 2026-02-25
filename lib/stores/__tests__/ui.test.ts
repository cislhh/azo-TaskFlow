import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '../ui'

describe('UI Store', () => {
  beforeEach(() => {
    // 重置 store 状态
    useUIStore.setState({
      currentView: 'dashboard'
    })
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useUIStore.getState()
      expect(state.currentView).toBe('dashboard')
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
      useUIStore.getState().setCurrentView('daily')
      useUIStore.getState().setCurrentView('weekly')

      const state = useUIStore.getState()
      expect(state.currentView).toBe('weekly')
    })
  })
})
