import Icon from '@/components/icon'

interface StampProps {
  size?: number
  className?: string
  fill?: string
  color?: string
  shadow?: boolean
}

export const Stamp = ({ 
  size = 24, 
  className = '', 
  fill = 'var(--color-primary-700)', 
  color = 'var(--color-primary-700)',
  shadow = true
}: StampProps) => {
  const shadowStyle = shadow ? {
    filter: 'drop-shadow(4px 4px 10px #00000040)'
  } : {}

  return (
    <div className={`fill-icon  text-neutral-400 ${className}`} style={shadowStyle}>
      <Icon
        name='TicketCheck'
        color={color}
        fill={fill}
        size={size}
      />
    </div>
  )
}
