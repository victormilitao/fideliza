export const WorksForMe = () => {
  return (
    <section className="bg-[#051937] text-white py-20 px-6 text-center">
      {/* Título e descrição */}
      <div className="max-w-3xl mx-auto mb-12">
        <p className="text-sm text-blue-300 uppercase mb-2">Fidelidade com selos</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">É para o meu negócio?</h2>
        <p className="text-lg text-gray-200">
          Um programa de fidelidade com selos pode ser uma forma eficaz de engajar seus clientes
          e fortalecer a relação com a sua marca.
        </p>
      </div>

      {/* Faixa com título azul mais claro */}
      <div className="inline-block bg-[#11294f] text-sm md:text-base px-6 py-3 rounded-full font-medium mb-10">
        Negócios que já descobriram o valor de fidelizar com selos
      </div>

      {/* Grid de categorias */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-sm text-gray-100">
        {[
          "Cafeteria",
          "Pet Shop",
          "Livraria",
          "Pizzaria",
          "Lava Jato",
          "Mercado",
          "Restaurante",
          "Barbearia"
        ].map((label) => (
          <div key={label} className="flex flex-col items-center">
            {/* Substituir por ícones reais, se quiser */}
            <div className="w-12 h-12 bg-white/10 rounded-full mb-2" />
            {label}
          </div>
        ))}
      </div>

      {/* + muitos outros */}
      <p className="mt-8 text-gray-400">+ muitos outros</p>
    </section>
  );
}
