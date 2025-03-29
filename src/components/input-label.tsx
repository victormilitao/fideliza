type InputLabelProps = {
  children?: React.ReactNode
}

export const InputLabel = ({ children }: InputLabelProps) => {
  return (
    <label className='text-neutral-700 text-xs'>
      {children}
    </label>
  )
}
