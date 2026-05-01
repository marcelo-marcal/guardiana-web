"use client";

// ================================
// IMPORTS
// ================================
import Image from "next/image";

// ================================
// MOCK DE LIVROS (futuro backend)
// ================================
const livros = [
    {
        id: 1,
        titulo: "O Cavaleiro dos Sete Reinos",
        autora: "George R. R. Martin",
        capa: "/livros/livro1.png",
    },
    {
        id: 2,
        titulo: "Malala",
        autora: "Adriana Carranca",
        capa: "/livros/livro2.png",
    },
    {
        id: 3,
        titulo: "As Conchas Não Falam",
        autora: "Taylane Cruz",
        capa: "/livros/livro3.png",
    },
];

// ================================
// SEÇÃO LIVROS
// ================================
export default function Livros() {
    return (
        <section
            id="livros"
            className="relative w-full overflow-hidden bg-[#F7F7F7] dark:bg-[#020617] transition-colors scroll-mt-24"
        >
            {/* ================================
                FAIXA DOURADA INCLINADA
            ================================ */}
            <div
                className="
                    absolute left-0 right-0 top-20
                    h-[390px] md:h-[430px]
                    bg-[#C4AA35] dark:bg-[#8F7A22]
                    -skew-y-3
                    origin-top-left
                "
            />

            {/* ================================
                DECORAÇÃO - LIVRO ESQUERDA
            ================================ */}
            <div className="absolute left-6 md:left-14 top-10 w-28 h-28 md:w-44 md:h-44 rotate-[-18deg] opacity-95">
                <Image
                    src="/decor-livro.png"
                    alt="Livro decorativo"
                    fill
                    className="object-contain"
                />
            </div>

            {/* ================================
                DECORAÇÃO - FOLHA DIREITA
            ================================ */}
            <div className="absolute right-0 md:right-8 top-20 w-32 h-32 md:w-56 md:h-56 opacity-95">
                <Image
                    src="/decor-folha.png"
                    alt="Folha decorativa"
                    fill
                    className="object-contain"
                />
            </div>

            {/* ================================
                CONTEÚDO PRINCIPAL
            ================================ */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-28">
                {/* ================================
                    CABEÇALHO
                ================================ */}
                <div className="text-center mb-16">
                    <span className="text-2xl text-[#18384A] dark:text-white">
                        Publicações
                    </span>

                    <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white leading-tight">
                        Livros publicados
                    </h2>

                    <p className="mt-5 text-white text-lg md:text-xl max-w-5xl mx-auto leading-relaxed">
                        Conheça as obras que já impactaram leitores e continuam
                        transformando histórias em experiências únicas.
                    </p>
                </div>

                {/* ================================
                    GRID DE LIVROS
                ================================ */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-14 lg:gap-24 items-start">
                    {livros.map((livro) => (
                        <div
                            key={livro.id}
                            className="
                                group
                                flex flex-col items-center text-center
                                transition-all duration-500
                                hover:-translate-y-2
                            "
                        >
                            {/* CAPA */}
                            <div
                                className="
                                    relative
                                    w-52 h-72
                                    md:w-56 md:h-80
                                    rounded-lg
                                    overflow-hidden
                                    bg-white
                                    p-5
                                    shadow-xl
                                    border border-gray-100 dark:border-white/10
                                    group-hover:shadow-2xl
                                    group-hover:scale-105
                                    transition-all duration-500
                                "
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={livro.capa}
                                        alt={livro.titulo}
                                        fill
                                        className="object-cover"
                                        priority={livro.id === 1}
                                        loading={
                                            livro.id === 1 ? "eager" : "lazy"
                                        }
                                    />
                                </div>
                            </div>

                            {/* TÍTULO */}
                            <h3 className="mt-8 text-lg md:text-xl font-extrabold text-[#18384A] dark:text-white group-hover:text-[#C95F52] dark:group-hover:text-[#D4AF37] transition">
                                {livro.titulo}
                            </h3>

                            {/* AUTORA */}
                            <p className="mt-1 text-sm text-[#344454] dark:text-gray-400">
                                {livro.autora}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
