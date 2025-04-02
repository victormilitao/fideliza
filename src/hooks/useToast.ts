import { toast, ToasterProps } from 'sonner'
import { useEffect, useState } from 'react'

export const useToast = () => {
  const [position, setPosition] = useState<'bottom-center' | 'bottom-right'>(
    'bottom-center'
  )

  useEffect(() => {
    const updatePosition = () => {
      setPosition(window.innerWidth < 640 ? 'bottom-center' : 'bottom-right')
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [])

  const show = (message: string, options?: ToasterProps): void => {
    toast(message, { position, ...options })
  }

  const success = (message: string, options?: ToasterProps): void => {
    toast.success(message, {
      position,
      ...options,
      style: {
        background: 'var(--color-primary-100)',
        borderColor: 'var(--color-primary-300)',
        color: 'var(--color-neutral-700)',
      },
    })
  }

  const error = (message: string, options?: ToasterProps): void => {
    toast.error(message, {
      position,
      ...options,
      style: {
        background: 'var(--color-error-100)',
        borderColor: 'var(--color-error-400)',
        color: 'var(--color-neutral-700)',
      },
    })
  }

  return { show, success, error }
}
