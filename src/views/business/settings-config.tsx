import { useMyBusiness } from '@/hooks/useMyBusiness'
import { useMyActiveCampaigns } from '@/hooks/useMyActiveCampaigns'
import { Button } from '@/components/button/button'
import { useRouter } from 'next/navigation'

export const SettingsConfig = () => {
  const { business } = useMyBusiness()
  const { campaigns, isLoading } = useMyActiveCampaigns(business?.id ?? '')
  const router = useRouter()

  const campaign = campaigns?.[0]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-700 text-sm">
          Nenhuma campanha ativa encontrada.
        </p>
        <Button
          variant="primary"
          onClick={() => router.push('/store')}
          className="mt-4"
        >
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="text-sm text-neutral-700">
          <p className="font-bold mb-1">Como o cliente ganha um selo? (regra)</p>
          <p>{campaign.rule || 'Não definida'}</p>
        </div>

        <div className="text-sm text-neutral-700">
          <p className="font-bold mb-1">Qual será o prêmio?</p>
          <p>{campaign.prize || 'Não definido'}</p>
        </div>

        <div className="text-sm text-neutral-700">
          <p className="font-bold mb-1">Quantos selos serão necessários para ganhar o prêmio?</p>
          <p className="font-bold">{campaign.stamps_required || 'Não definido'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          onClick={() => router.push('/store/create/campaign')}
        >
          Editar
        </Button>

        <Button
          variant="secondary"
          onClick={() => router.push('/store')}
        >
          Voltar
        </Button>
      </div>
    </div>
  )
}
