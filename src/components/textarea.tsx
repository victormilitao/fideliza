import { Error } from './error'
import { InputLabel } from './input-label'

type TextareaProps = {
  label?: string
  error?: string
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = ({
  className,
  label,
  error,
  value,
  rows = 4,
  ...rest
}: TextareaProps) => {
  return (
    <div className={`${className || ''} flex flex-col`}>
      <InputLabel>{label}</InputLabel>
      <textarea 
        rows={rows}
        className='border border-neutral-500 p-2 rounded-sm min-w-3xs resize-none'
        {...rest} 
        value={value ?? ''} 
      />
      {error && <Error msg={error} />}
    </div>
  )
}
