import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Aside } from '../aside'

describe('Aside Component', () => {
  it('should render navigation links', () => {
    render(<Aside />)

    expect(screen.getByText('任务总览')).toBeInTheDocument()
    expect(screen.getByText('日常任务')).toBeInTheDocument()
    expect(screen.getByText('目标')).toBeInTheDocument()
  })

  it('should not have any link highlighted by default', () => {
    const { container } = render(<Aside />)

    const links = container.querySelectorAll('a')
    links.forEach(link => {
      expect(link).not.toHaveClass('bg-blue-600', 'text-white')
    })
  })
})
