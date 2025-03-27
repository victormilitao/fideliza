interface ButtonProps {
  children?: React.ReactNode
}

export const Button = (props: ButtonProps) => {
  return (
    <button className='cursor-pointer h-fit min-w-fit py-1 px-6 bg-primary-600 text-neutral-200 rounded-sm transition-transform duration-300 ease-in-out'>
      <span className='text-sm'>{props?.children}</span>
    </button>
  )
}
