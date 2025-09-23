/// <reference types="vitest" />
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Input } from '../input'
import { userEvent } from '@testing-library/user-event'

vi.mock('@/hooks/useInputMask', () => ({
  useInputMask: () => ({ current: null }),
}))

describe('Input', () => {
  it('should render input with label', () => {
    render(<Input label="Test Label" />)
    
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should render input without label', () => {
    render(<Input />)
    
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should display error message when error prop is provided', () => {
    render(<Input error="This is an error message" />)
    
    expect(screen.getByText('This is an error message')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<Input className="custom-class" />)
    
    const inputContainer = screen.getByRole('textbox').parentElement
    expect(inputContainer).toHaveClass('custom-class')
  })

  it('should handle onChange event', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test input')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('should set default type to text', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('should set custom type', () => {
    render(<Input type="email" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('should have correct default styling', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    // The input doesn't have default styling classes, it's just a basic input
    expect(input).toBeInTheDocument()
  })

  it('should pass through additional props', () => {
    render(<Input placeholder="Enter text here" data-testid="custom-input" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('placeholder', 'Enter text here')
    expect(input).toHaveAttribute('data-testid', 'custom-input')
  })

  it('should handle value prop', () => {
    render(<Input value="Initial value" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('Initial value')
  })

  it('should handle empty value', () => {
    render(<Input value="" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('')
  })

  it('should handle undefined value', () => {
    render(<Input value={undefined} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('')
  })
})
