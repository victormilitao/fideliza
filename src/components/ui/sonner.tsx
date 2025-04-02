import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className='toaster group'
      toastOptions={{
        style: {
          background: 'var(--color-primary-100)',
          borderColor: 'var(--color-primary-300)',
          color: 'var(--color-neutral-700)',
        },
      }}
      icons={{ success: null, error: null }}
      {...props}
    />
  )
}

export { Toaster }
