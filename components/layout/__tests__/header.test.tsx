import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '../header'

describe('Header Component', () => {
  it('should render header with title', () => {
    render(<Header />)
    expect(screen.getByText('任务管理系统')).toBeInTheDocument()
  })

  it('should render current date', () => {
    render(<Header />)
    const dateElement = screen.getByText(/\d{4}年\d{1,2}月\d{1,2}日/)
    expect(dateElement).toBeInTheDocument()
  })

  it('should have correct styling classes', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('h-16')
    expect(header).toHaveClass('border-b')
    expect(header).toHaveClass('bg-white')
  })
})
