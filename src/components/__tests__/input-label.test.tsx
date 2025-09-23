/// <reference types="vitest" />
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { InputLabel } from '../input-label'

describe('InputLabel', () => {
  it('should render label with children', () => {
    render(<InputLabel>Test Label</InputLabel>)
    
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should render label without children', () => {
    render(<InputLabel />)
    
    const label = screen.getByRole('generic')
    expect(label).toBeInTheDocument()
  })

  it('should have correct styling', () => {
    render(<InputLabel>Styled Label</InputLabel>)
    
    const label = screen.getByText('Styled Label')
    expect(label).toHaveClass('text-xs')
  })

  it('should render complex children', () => {
    render(
      <InputLabel>
        <span>Complex</span> <strong>Label</strong>
      </InputLabel>
    )
    
    expect(screen.getByText('Complex')).toBeInTheDocument()
    expect(screen.getByText('Label')).toBeInTheDocument()
  })
})
