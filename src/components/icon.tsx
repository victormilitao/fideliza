import React from 'react'
import * as LucideIcons from 'lucide-react'

interface IconProps {
  name: keyof typeof LucideIcons
  size?: number
  color?: string
  strokeWidth?: number
  fill?: string
  className?: string
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 1,
  fill = '',
  className = '',
}) => {
  const LucideIcon = LucideIcons[name] as React.ComponentType<{
    size?: number
    color?: string
    strokeWidth?: number
    style?: React.CSSProperties
    fill?: string
    className?: string
  }>

  if (!LucideIcon) {
    console.warn(`Icon "${name}" does not exist in Lucide.`)
    return null
  }

  return (
    <LucideIcon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...(fill && { fill })}
    />
  )
}

export default Icon
