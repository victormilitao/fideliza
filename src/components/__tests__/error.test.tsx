/// <reference types="vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Error } from '../error'

describe('Error', () => {
  it('should render error message', () => {
    render(<Error msg="This is an error message" />)
    
    expect(screen.getByText('This is an error message')).toBeInTheDocument()
  })

  it('should render empty error message', () => {
    const { container } = render(<Error msg="" />)
    
    const errorElement = container.querySelector('.text-error-600')
    expect(errorElement).toBeInTheDocument()
    expect(errorElement).toHaveTextContent('')
  })

  it('should have correct styling', () => {
    render(<Error msg="Error message" />)
    
    const errorElement = screen.getByText('Error message')
    expect(errorElement).toHaveClass('text-error-600')
  })
})
