type InputLabelProps = {
  children?: React.ReactNode
}

export const InputLabel = ({ children }: InputLabelProps) => {
  return (
    <label className='text-xs'>
      {children}
    </label>
  )
}
