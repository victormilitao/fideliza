import { BottomSheet } from '@/components/bottom-sheet'
import { Button } from '@/components/button/button'
import { Campaign } from '@/types/campaign.type'
import { useState } from 'react'

type CampaignRulesProps = {
  campaign: Campaign
}

export const CampaignRules = ({ campaign }: CampaignRulesProps) => {
  const [openSheet, setOpenSheet] = useState<boolean>(false)

  const handleRules = () => {
    setOpenSheet(!openSheet)
  }

  return (
    <div>
      <span
        className='font-bold text-sm text-primary-600'
        onClick={handleRules}
      >
        Acessar as regras deste local
      </span>
      <BottomSheet open={openSheet} onOpenChange={setOpenSheet}>
        <div className='w-sm mx-auto text-left flex flex-col gap-5 p-2'>
          <p className='text-sm'>
            <span className='font-bold'>Regra: </span>
            {campaign.rule}
          </p>
          <p className='text-sm'>
            <span className='font-bold'>Prêmio: </span>
            {campaign.prize}
          </p>
          <Button onClick={handleRules}>Fechar</Button>
        </div>
      </BottomSheet>
    </div>
  )
}
