// ================================
// IMPORTS
// ================================
import Image from "next/image";

// ================================
// DADOS DOS SERVIÇOS EDITORIAIS
// ================================
const blocosServicos = [
    {
        id: 1,
        imagem: "/amigas-lendo01.png",
        servicos: [
            {
                titulo: "Assessoria ao autor",
                texto: "Acompanhamento especializado para aprimorar seu manuscrito em todas as etapas, com orientações claras que valorizam sua voz e potencializam a qualidade da obra.",
            },
            {
                titulo: "Kit revisor",
                texto: "Revisão completa de estilo, ortografia e gramática, aliada a sugestões artísticas, estéticas e linguísticas para elevar o nível do texto com consistência e elegância.",
            },
            {
                titulo: "Editoração completa",
                texto: "Desenvolvimento editorial do início ao fim, incluindo diagramação profissional, padronização e preparação do livro para publicação.",
            },
            {
                titulo: "Referências e revisões",
                texto: "Seleção criteriosa de referências e revisões técnicas que garantem rigor, credibilidade e coerência ao conteúdo.",
            },
        ],
    },
    {
        id: 2,
        imagem: "/amigas-lendo02.png",
        servicos: [
            {
                titulo: "Capa personalizada",
                texto: "Criação de capa exclusiva por artista visual, com projeto de contracapa e lombada — transformando cada livro em uma obra única.",
            },
            {
                titulo: "Regularização editorial",
                texto: "Trâmite de ISBN, geração de código de barras e elaboração de ficha catalográfica, assegurando conformidade com os padrões do mercado.",
            },
            {
                titulo: "Formatos de publicação",
                texto: "Entrega do produto final em e-book e/ou impresso, com qualidade profissional e pronto para distribuição.",
            },
        ],
    },
    {
        id: 3,
        imagem: "/amigas-lendo03.png",
        servicos: [
            {
                titulo: "Excelência profissional",
                texto: "Cada livro é cuidadosamente desenvolvido por especialistas com ampla experiência no mercado editorial.",
            },
            {
                titulo: "Diferencial da editora",
                texto: "Apresentação opcional em feiras nacionais e internacionais, além de produção de book trailer para divulgação nas redes sociais.",
            },
        ],
    },
];

// ================================
// PÁGINA: SERVIÇOS EDITORIAIS
// ================================
export default function ServicosEditoriaisPage() {
    return (
        <main className="bg-[#F7F7F7] dark:bg-[#020617] transition-colors">
            {/* ================================
                HERO DA PÁGINA
            ================================ */}
            <section className="px-6 py-20 md:py-24">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="text-sm uppercase tracking-widest text-[#D4AF37]">
                        Guardiana Editora
                    </span>

                    <h1 className="mt-4 text-4xl md:text-6xl font-extrabold text-[#18384A] dark:text-white leading-tight">
                        Serviços Editoriais
                    </h1>

                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-[#344454] dark:text-gray-300 leading-relaxed">
                        Acompanhamos autores e autoras em cada etapa da criação,
                        revisão, preparação e publicação de suas obras.
                    </p>
                </div>
            </section>

            {/* ================================
                BLOCOS DE SERVIÇOS
            ================================ */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto space-y-24">
                    {blocosServicos.map((bloco, index) => {
                        const inverter = index % 2 !== 0;

                        return (
                            <div
                                key={bloco.id}
                                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                                    inverter
                                        ? "lg:[&>*:first-child]:order-2"
                                        : ""
                                }`}
                            >
                                {/* ================================
                                    TEXTO DOS SERVIÇOS
                                ================================ */}
                                <div className="space-y-8">
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#18384A] dark:text-white">
                                        Serviços Editoriais
                                    </h2>

                                    <div className="space-y-7">
                                        {bloco.servicos.map((servico) => (
                                            <article
                                                key={servico.titulo}
                                                className="
                                                    group
                                                    rounded-2xl
                                                    bg-white dark:bg-[#0F1720]
                                                    border border-gray-200 dark:border-white/10
                                                    p-6
                                                    shadow-md
                                                    hover:-translate-y-1
                                                    hover:shadow-xl
                                                    transition-all duration-500
                                                "
                                            >
                                                <h3 className="text-xl font-extrabold text-[#18384A] dark:text-white group-hover:text-[#C95F52] dark:group-hover:text-[#D4AF37] transition">
                                                    {servico.titulo}
                                                </h3>

                                                <p className="mt-3 text-[#344454] dark:text-gray-300 text-base md:text-lg leading-relaxed">
                                                    {servico.texto}
                                                </p>
                                            </article>
                                        ))}
                                    </div>
                                </div>

                                {/* ================================
                                    IMAGEM DO BLOCO
                                ================================ */}
                                <div
                                    className="
                                        group
                                        relative
                                        w-full
                                        h-[420px] md:h-[620px]
                                        rounded-3xl
                                        overflow-hidden
                                        shadow-xl
                                        border border-gray-200 dark:border-white/10
                                        hover:-translate-y-2
                                        hover:shadow-2xl
                                        transition-all duration-500
                                    "
                                >
                                    <Image
                                        src={bloco.imagem}
                                        alt="Serviços Editoriais Guardiana"
                                        fill
                                        className="object-cover group-hover:scale-105 transition duration-700"
                                        priority={bloco.id === 1}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
