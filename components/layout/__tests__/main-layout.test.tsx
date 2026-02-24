import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MainLayout } from '../main-layout'

describe('MainLayout Component', () => {
  it('should render children correctly', () => {
    render(
      <MainLayout>
        <div>测试内容</div>
      </MainLayout>
    )

    expect(screen.getByText('测试内容')).toBeInTheDocument()
  })

  it('should use grid layout', () => {
    const { container } = render(
      <MainLayout>
        <div>内容</div>
      </MainLayout>
    )

    const layoutDiv = container.firstChild as HTMLElement
    expect(layoutDiv).toHaveClass('grid', 'min-h-screen')
  })

  it('should render Header and Aside components', () => {
    const { container } = render(
      <MainLayout>
        <div>内容</div>
      </MainLayout>
    )

    expect(screen.getByText('任务管理系统')).toBeInTheDocument()
    expect(screen.getByText('任务总览')).toBeInTheDocument()
  })
})
