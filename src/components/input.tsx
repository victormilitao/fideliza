import { InputLabel } from './input-label'

type InputProps = {
  label?: string
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = ({ className, label, ...rest }: InputProps) => {
  return (
    <div className='flex flex-col gap-'>
      <InputLabel>{label}</InputLabel>
      <input
        className={`border border-gray-400 p-2 rounded-l-sm min-w-3xs min-h-10 ${
          className || ''
        }`}
        {...rest}
      />
    </div>
  )
}
