import { Button } from '@/components/button/button'
import { useLogout } from '@/hooks/useLogout'

interface LogoutButtonProps {
  className?: string
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
}

export const LogoutButton = ({ className, variant = 'secondary' }: LogoutButtonProps) => {
  const { logout } = useLogout()

  const handleLogout = () => {
    logout()
  }

  return (
    <Button 
      variant={variant} 
      onClick={handleLogout}
      className={className}
    >
      Sair
    </Button>
  )
}

