import React from 'react'
import * as LucideIcons from 'lucide-react'

interface IconProps {
  name: keyof typeof LucideIcons
  size?: number
  color?: string
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
}) => {
  const LucideIcon = LucideIcons[name] as React.ComponentType<{
    size?: number
    color?: string
  }>

  if (!LucideIcon) {
    console.warn(`Icon "${name}" does not exist in Lucide.`)
    return null
  }

  return <LucideIcon size={size} color={color} />
}

export default Icon
