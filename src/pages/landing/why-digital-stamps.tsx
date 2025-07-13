export const WhyDigitalStamps = () => {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* Coluna da esquerda */}
        <div className="space-y-10">
          {/* Título e descrição */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f5b] mb-4">
              Por que trocar o cartãozinho de papel por selos digitais?
            </h2>
            <p className="text-gray-800">
              Programas de fidelidade com cartão de papel até funcionam — mas vamos ser sinceros:{" "}
              <strong>quantos clientes já esqueceram, perderam ou ficaram frustrados por aparecer no estabelecimento sem o cartão em mãos?</strong>
            </p>
            <p className="mt-4 text-gray-800">
              Com um programa de selos digital, você evita esse desgaste para o cliente e ainda
              simplifica tudo para o seu negócio.
            </p>
          </div>

          {/* Simulação SMS */}
          <div className="bg-gray-100 rounded-2xl w-full max-w-xs p-4 shadow">
            <div className="flex justify-between items-center text-gray-500 text-sm mb-2">
              <span>9:41</span>
              <div className="flex items-center gap-2">
                <span className="text-xs">Eloop</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 text-sm">
              <p>
                <strong>Café Brasil:</strong> Parabéns! 🎉<br />
                Você completou 10 selos! 🏆<br />
                Informe o código 9898 no estabelecimento para resgatar o seu prêmio.
                Acompanhe seus selos e veja as regras em:{" "}
                <a href="https://fideliza.com" className="text-blue-600 underline">fideliza.com</a>
              </p>
            </div>
          </div>
        </div>

        {/* Coluna da direita */}
        <div className="space-y-10">
          {/* Imagem com balão de mensagem */}
          <div className="relative">
            <img
              src="/images/cafe-brasil.jpg" // substitua com o caminho real da imagem
              alt="Mulher usando celular"
              className="rounded-2xl shadow-lg"
            />
            <div className="absolute top-4 right-4 bg-white shadow-lg rounded-xl p-3 text-sm max-w-xs">
              <p>
                <strong>Café Brasil:</strong> Você ganhou seu primeiro selo! 🎉<br />
                Junte 10 selos e troque por um prêmio. Acompanhe seus selos e veja as regras em{" "}
                <a href="https://eloop.com.br" className="text-blue-600 underline">eloop.com.br</a>
              </p>
            </div>
          </div>

          {/* Lista de vantagens */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Nada de se preocupar com:</h3>
            <ul className="text-red-700 font-semibold space-y-1 mb-4">
              <li>• Impressão de cartões</li>
              <li>• Estoque de adesivos</li>
              <li>• Carimbo que some, quebra ou falha</li>
            </ul>
            <p className="text-gray-700">
              O sistema digital traz mais agilidade: você <strong className="text-blue-700">configura em minutos</strong>,
              gerencia com facilidade e ainda oferece uma experiência moderna, prática e personalizada para seus clientes.
            </p>
            <p className="mt-4 text-gray-700">
              Chega de papelzinho perdido na bolsa ou na gaveta. Com selos digitais, a fidelização
              acontece do jeito certo — simples para o cliente, eficiente para você.
            </p>
          </div>

          {/* Botão */}
          <div>
            <button className="bg-[#001f5b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002b85] transition">
              Acessar minha conta
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
