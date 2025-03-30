import { Button } from "@/components/button/button"
import { Input } from "@/components/input"

export const Reward = () => {
  return (
    <div className='flex flex-col items-center justify-center h-fit'>
      <div className='flex flex-col gap-6'>
        <p className='text-center text-sm'>
          Digite abaixo o código recebido pelo cliente
        </p>
        <Input type="text" />
        <Button>Premiar</Button>
      </div>
    </div>
  )
}