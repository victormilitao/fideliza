import { useEffect, useState } from 'react'
import { BottomSheet } from '@/components/bottom-sheet'
import { Button } from '@/components/button/button'

export const CampaignInstructionsBottomSheet = () => {
  const [showInstructions, setShowInstructions] = useState(false)

  // Verificar se deve mostrar as instruções após criar uma campanha
  useEffect(() => {
    const shouldShowInstructions = localStorage.getItem('showInstructions')
    if (shouldShowInstructions === 'true') {
      setShowInstructions(true)
    }
  }, [])

  const handleClose = () => {
    setShowInstructions(false)
    localStorage.removeItem('showInstructions')
  }

  return (
    <BottomSheet
      open={showInstructions}
      onOpenChange={(open) => !open && handleClose()}
    >
      <div className='flex flex-col gap-10 max-w-md mx-auto'>
        <div className='text-center mt-5'>
          <h2 className='text-xl font-bold text-primary-600 mb-2'>
            Muito bom!
          </h2>
          <p className='text-primary-600'>
            Seu programa de fidelidade está pronto.
          </p>
        </div>

        <div className='text-neutral-700 text-sm'>
          <h3 className='font-bold mb-4'>Entenda como funciona:</h3>
          <div className='space-y-3'>
            <div className='flex gap-3'>
              <p className='text-sm'>
                <span className='font-bold'>1. &nbsp;</span>
                Informe o número de celular do seu cliente para enviar um selo.
              </p>
            </div>
            <div className='flex gap-3'>
              <p className='text-sm'>
                <span className='font-bold'>2.</span>O cliente receberá um SMS
                com o selo e um link para acompanhar o progresso dele.
              </p>
            </div>
            <div className='flex gap-3'>
              <p className='text-sm'>
                <span className='font-bold'>3. &nbsp;</span>
                Ao atingir a quantidade de selos necessária para ser premiado, o
                cliente receberá um WhastApp com um código de premiação.
              </p>
            </div>
            <div className='flex gap-3'>
              <p className='text-sm'>
                <span className='font-bold'>4. &nbsp;</span>
                No momento do resgate do prêmio, o cliente deve informar o
                código de premiação. Acesse a função "Premiar", insira o código,
                e os selos serão zerados para que ele possa começar um novo
                ciclo.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={handleClose} className='w-full mb-5'>
          Começar
        </Button>
      </div>
    </BottomSheet>
  )
}
