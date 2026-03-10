import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/button/button'
import { Header } from '@/pages/header'
import { Check } from 'lucide-react'

const benefits = [
    'Selos ilimitados',
    'Sem taxas por envio',
    'Cancelamento a qualquer momento',
    'Pagamento mensal no cartão',
]

export const Contratar = () => {
    const navigate = useNavigate()

    return (
        <div className='min-h-screen flex flex-col bg-white'>
            <Header />

            <div className='flex flex-1 justify-center'>
                <div className='w-full sm:max-w-md flex flex-col flex-1 py-8 px-6 gap-6'>
                    <h2 className='text-base font-bold text-primary-600'>
                        Continue enviando selos e fidelizando seus clientes
                    </h2>

                    {/* Pricing Card */}
                    <div className='bg-primary-600 rounded-xl p-6 flex flex-col gap-5 shadow-lg'>
                        <div className='flex items-baseline gap-1'>
                            <span className='text-xl text-neutral-100'>R$</span>
                            <span className='text-5xl font-bold text-neutral-100'>27,90</span>
                            <span className='text-xl text-neutral-400'>/mês</span>
                        </div>

                        <div className='flex flex-col gap-3'>
                            {benefits.map((benefit) => (
                                <div key={benefit} className='flex items-center gap-2'>
                                    <Check size={18} className='text-neutral-100 shrink-0' />
                                    <span className='text-sm text-neutral-100'>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <p className='text-sm text-neutral-700'>
                        Ative o plano do Eloop e continue enviando selos para seus clientes
                        sem limites.
                    </p>

                    {/* Actions */}
                    <div className='flex flex-col gap-3'>
                        <Button onClick={() => navigate('/estabelecimento/payment')}>
                            Continuar para pagamento
                        </Button>
                        <button
                            onClick={() => navigate('/estabelecimento')}
                            className='text-sm font-bold text-primary-600 py-2 cursor-pointer'
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
