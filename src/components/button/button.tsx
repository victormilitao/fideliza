import Icon from '../icon'
import { ButtonStyled, ButtonVariant } from './button.style'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  variant?: ButtonVariant
  loading?: boolean
}

export const Button = ({
  children,
  variant = 'primary',
  className,
  loading = false,
  ...rest
}: ButtonProps) => {
  return (
    <ButtonStyled
      $variant={variant}
      className={`cursor-pointer h-10 min-w-fit py-1 px-6 rounded-sm transition-transform duration-300 ease-in-out ${
        className || ''
      }`}
      {...rest}
    >
      <div className='flex items-center justify-center'>
        {!loading && <span className='text-sm font-bold'>{children}</span>}
        {loading && (
          <Icon
            name='LoaderCircle'
            size={16}
            strokeWidth={3}
            color='var(--color-neutral-100)'
            className='animate-spin ml-2 text-neutral-100'
          />
        )}
      </div>
    </ButtonStyled>
  )
}
