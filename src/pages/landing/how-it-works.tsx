import { Pencil, Send, Gift, Repeat } from 'lucide-react';
import howItWorks from '/landing/how-it-works.gif';

const steps = [
  {
    icon: <Pencil className="w-5 h-5 text-[#002060]" />,
    title: 'Crie seu programa',
    description:
      'Defina as regras: como o cliente ganha o selo, qual será o prêmio e quantos selos são necessários para conquistar a recompensa.',
  },
  {
    icon: <Send className="w-5 h-5 text-[#002060]" />,
    title: 'Envie os selos',
    description:
      'Você ativa um selo usando apenas o número de telefone do cliente. Ele recebe um SMS com o selo e um link para acompanhar o progresso.',
  },
  {
    icon: <Gift className="w-5 h-5 text-[#002060]" />,
    title: 'Premiação',
    description:
      'Quando o cliente completa a cartela, ele recebe um SMS com um código para resgatar o prêmio. Depois disso, um novo ciclo começa.',
  },
  {
    icon: <Repeat className="w-5 h-5 text-[#002060]" />,
    title: 'Fidelize de verdade',
    description:
      'Com recompensas atrativas e um sistema fácil de usar, seus clientes voltam mais vezes — e seu negócio cresce.',
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center" id="comecar">
      <div className="flex justify-center">
        <img
          src={howItWorks}
          alt="Demonstração do app"
          className="rounded-md w-full max-w-sm"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#002060] mb-8">Como funciona?</h2>
        <ul className="space-y-6">
          {steps.map(({ icon, title, description }) => (
            <li key={title} className="flex items-start gap-4">
              <div className="mt-1">{icon}</div>
              <div>
                <p className="font-semibold text-[#002060]">{title}</p>
                <p className="text-sm text-[#333]">{description}</p>
              </div>
            </li>
          ))}
        </ul>

        <a
          href="/signup"
          className="inline-block mt-10 bg-[#002060] text-white text-sm font-medium px-6 py-3 rounded-md hover:bg-[#003399] transition"
        >
          Começar grátis
        </a>
      </div>
    </section>
  );
}
