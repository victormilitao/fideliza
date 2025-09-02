import { Button } from '@/components/button/button'
import { useLogout } from '@/hooks/useLogout'

interface LogoutButtonProps {
  className?: string
}

export const LogoutButton = ({ className }: LogoutButtonProps) => {
  const { logout } = useLogout()

  const handleLogout = () => {
    logout()
  }

  return (
    <Button variant='link' onClick={handleLogout} className={className}>
      Sair
    </Button>
  )
}
