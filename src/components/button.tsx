interface ButtonProps {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className={`cursor-pointer h-10 min-w-fit py-1 px-6 bg-primary-600 hover:bg-primary-700 text-neutral-200 rounded-sm transition-transform duration-300 ease-in-out ${
        props.className || ''
      }`}
    >
      <span className='text-sm'>{props?.children}</span>
    </button>
  )
}
