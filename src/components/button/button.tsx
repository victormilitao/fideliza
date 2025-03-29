import { ButtonStyled, ButtonVariant } from './button.style'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  variant?: ButtonVariant
}

export const Button = ({
  children,
  variant,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <ButtonStyled
      variant={variant || 'primary'}
      className={`cursor-pointer h-10 min-w-fit py-1 px-6 rounded-sm transition-transform duration-300 ease-in-out ${
        className || ''
      }`}
      {...rest}
    >
      <span className='text-sm'>{children}</span>
    </ButtonStyled>
  )
}
