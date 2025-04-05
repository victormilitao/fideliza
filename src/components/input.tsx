import { Error } from './error'
import { InputLabel } from './input-label'

type InputProps = {
  label?: string
  error?: string
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = ({ className, label, error, ...rest }: InputProps) => {
  return (
    <div className={`${className || ''} flex flex-col`}>
      <InputLabel>{label}</InputLabel>
      <input {...rest} />
      {error && <Error msg={error} />}
    </div>
  )
}
