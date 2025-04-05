import { useInputMask } from '@/hooks/useInputMask'
import { Error } from './error'
import { InputLabel } from './input-label'
import { MaskOptions, MaskType } from '@/utils/mask-utils'

type InputProps = {
  label?: string
  error?: string
  className?: string
  maskType?: MaskType
  customMask?: MaskOptions
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = ({
  className,
  label,
  error,
  maskType,
  customMask,
  ...rest
}: InputProps) => {
  const inputRef = useInputMask(maskType, customMask)
  return (
    <div className={`${className || ''} flex flex-col`}>
      <InputLabel>{label}</InputLabel>
      <input ref={inputRef} {...rest} />
      {error && <Error msg={error} />}
    </div>
  )
}
