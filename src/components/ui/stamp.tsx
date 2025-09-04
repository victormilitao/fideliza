import Icon from '@/components/icon'

interface StampProps {
  size?: number
  className?: string
  fill?: string
  color?: string
}

export const Stamp = ({ 
  size = 24, 
  className = '', 
  fill = 'var(--color-primary-700)', 
  color = 'var(--color-primary-700)'
}: StampProps) => (
  <div className={`fill-icon text-neutral-400 ${className}`}>
    <Icon
      name='TicketCheck'
      color={color}
      fill={fill}
      size={size}
    />
  </div>
)
