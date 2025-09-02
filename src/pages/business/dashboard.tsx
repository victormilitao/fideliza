import { useMyBusiness } from '@/hooks/useMyBusiness'
import { useClientStats } from '@/hooks/useClientStats'
import { Header } from '@/pages/landing/header'
import { TabNavigation } from '@/components/business/tab-navigation'
import { StatsCard } from '@/components/business/stats-card'

export const Dashboard = () => {
  const { business } = useMyBusiness()
  const { data: statsData, isLoading, error } = useClientStats()

  if (!business) {
    return (
      <div className='flex flex-col min-h-screen'>
        <Header />
        <div className='flex flex-1 items-center justify-center'>
          <p className='text-primary-600'>Carregando estabelecimento...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { label: 'Enviar selos', href: '/estabelecimento' },
    { label: 'Dados', href: '/estabelecimento/dashboard' },
  ]

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <TabNavigation tabs={tabs} />
      
      <div className='flex flex-1 justify-center'>
        <div className='w-full max-w-6xl px-6 py-8'>
          <h1 className='font-bold text-primary-600 mb-8'>
            Quantidade de clientes por selos acumulados
          </h1>
          
          {isLoading && (
            <div className='text-center py-12'>
              <p className='text-gray-500'>Carregando dados...</p>
            </div>
          )}
          
          {error && (
            <div className='text-center py-12'>
              <p className='text-red-500'>Erro ao carregar dados: {error.message}</p>
            </div>
          )}
          
          {statsData && statsData.length > 0 && (
            <div className='grid grid-cols-3 sm:grid-cols-5 gap-6'>
              {statsData.map((stat, index) => (
                <StatsCard
                  key={index}
                  count={stat.count}
                  stamps={stat.stamps}
                  totalStamps={stat.totalStamps}
                />
              ))}
            </div>
          )}
          
          {statsData && statsData.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-gray-500'>
                Nenhum dado disponível ainda. Comece enviando selos para seus clientes!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
