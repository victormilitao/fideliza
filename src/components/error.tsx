type ErrorProps = {
  msg: string
}

export const Error = ({ msg }: ErrorProps) => {
  return <div className='text-error-600'>{msg}</div>
}
