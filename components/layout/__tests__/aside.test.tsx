import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useUIStore } from '@/lib/stores/ui'
import { Aside } from '../aside'

describe('Aside Component', () => {
  beforeEach(() => {
    // 重置 store 状态
    useUIStore.setState({
      isCreateDialogOpen: false,
      currentView: 'dashboard'
    })
  })

  it('should render navigation links', () => {
    render(<Aside />)

    expect(screen.getByText('任务总览')).toBeInTheDocument()
    expect(screen.getByText('日常任务')).toBeInTheDocument()
    expect(screen.getByText('周任务')).toBeInTheDocument()
  })

  it('should highlight current view', () => {
    useUIStore.setState({ currentView: 'dashboard' })
    const { container } = render(<Aside />)

    const activeLink = screen.getByText('任务总览').closest('a')
    expect(activeLink).toHaveClass('bg-blue-600', 'text-white')
  })

  it('should not highlight inactive views', () => {
    useUIStore.setState({ currentView: 'dashboard' })
    const { container } = render(<Aside />)

    const inactiveLink = screen.getByText('日常任务').closest('a')
    expect(inactiveLink).not.toHaveClass('bg-blue-600')
    expect(inactiveLink).toHaveClass('text-gray-700')
  })
})
