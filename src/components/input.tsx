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
        className={` ${
          className || ''
        }`}
        {...rest}
      />
    </div>
  )
}
