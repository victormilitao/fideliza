/// <reference types="vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Textarea } from '../textarea'
import userEvent from '@testing-library/user-event'

describe('Textarea', () => {
  it('should render textarea with label', () => {
    render(<Textarea label="Test Label" />)
    
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should render textarea without label', () => {
    render(<Textarea />)
    
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should display error message when error prop is provided', () => {
    render(<Textarea error="This is an error message" />)
    
    expect(screen.getByText('This is an error message')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<Textarea className="custom-class" />)
    
    const textareaContainer = screen.getByRole('textbox').parentElement
    expect(textareaContainer).toHaveClass('custom-class')
  })

  it('should handle onChange event', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Textarea onChange={handleChange} />)
    
    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'test input')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('should set default rows to 4', () => {
    render(<Textarea />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('rows', '4')
  })

  it('should set custom rows', () => {
    render(<Textarea rows={6} />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('rows', '6')
  })

  it('should have correct default styling', () => {
    render(<Textarea />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('border', 'border-neutral-500', 'p-2', 'rounded-sm', 'min-w-3xs', 'resize-none')
  })

  it('should pass through additional props', () => {
    render(<Textarea placeholder="Enter text here" data-testid="custom-textarea" />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('placeholder', 'Enter text here')
    expect(textarea).toHaveAttribute('data-testid', 'custom-textarea')
  })

  it('should handle value prop', () => {
    render(<Textarea value="Initial value" />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('Initial value')
  })

  it('should handle empty value', () => {
    render(<Textarea value="" />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('')
  })
})
