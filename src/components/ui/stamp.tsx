import Icon from '@/components/icon'

interface StampProps {
  size?: number
  className?: string
}

export const Stamp = ({ size = 24, className = '' }: StampProps) => (
  <div className={`fill-icon text-neutral-400 ${className}`}>
    <Icon
      name='TicketCheck'
      color='var(--color-primary-700)'
      fill='var(--color-primary-700)'
      size={size}
    />
  </div>
)
