import { BarChart, DollarSign, Handshake, Gamepad2 } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: <BarChart className="text-white w-5 h-5" />,
      title: 'Aumentar a frequência de visitas dos seus clientes',
      text: 'Transforme visitas esporádicas em hábito. Seu cliente volta porque sabe que está cada vez mais perto do prêmio.',
    },
    {
      icon: <DollarSign className="text-white w-5 h-5" />,
      title: 'Elevar o seu ticket médio',
      text: 'Você pode definir regras que incentivem um consumo maior por visita — como premiar compras acima de certo valor ou a combinação de produtos.',
    },
    {
      icon: <Handshake className="text-white w-5 h-5" />,
      title: 'Fortalecer a relação com seus clientes',
      text: 'Recompensar quem escolhe seu negócio é uma forma poderosa de criar conexão e fidelidade de verdade.',
    },
    {
      icon: <Gamepad2 className="text-white w-5 h-5" />,
      title: 'Transformar a interação com sua marca em uma experiência viciante',
      text: 'Acumular selos se torna uma experiência divertida e envolvente, incentivando o cliente a continuar interagindo com sua marca.',
    },
  ];

  return (
    <section className="bg-white px-6 py-20 max-w-7xl mx-auto text-center">
      <h2 className="text-xl sm:text-2xl font-bold text-[#002060] mb-12">
        É hora de criar um programa de fidelidade se você quer:
      </h2>

      <div className="grid lg:grid-cols-3 gap-10 items-center">
        {/* Coluna da esquerda */}
        <div className="space-y-10 text-left">
          {benefits.slice(0, 2).map((b) => (
            <div key={b.title} className="flex items-start gap-4">
              <div className="bg-[#002060] p-2 rounded-full">{b.icon}</div>
              <div>
                <p className="font-semibold text-[#002060]">{b.title}</p>
                <p className="text-sm text-[#333]">{b.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Imagem central */}
        <div className="flex justify-center">
          <img
            src="/benefits-phone.png"
            alt="Interface de premiação"
            className="max-w-xs w-full"
          />
        </div>

        {/* Coluna da direita */}
        <div className="space-y-10 text-left">
          {benefits.slice(2).map((b) => (
            <div key={b.title} className="flex items-start gap-4">
              <div className="bg-[#002060] p-2 rounded-full">{b.icon}</div>
              <div>
                <p className="font-semibold text-[#002060]">{b.title}</p>
                <p className="text-sm text-[#333]">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botão */}
      <a
        href="/signup"
        className="inline-block mt-16 border border-[#002060] text-[#002060] font-medium text-sm px-6 py-3 rounded-md hover:bg-[#002060] hover:text-white transition"
      >
        Criar meu programa de fidelidade
      </a>
    </section>
  );
}
