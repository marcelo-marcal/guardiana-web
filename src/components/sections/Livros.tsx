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
            className="w-full py-24 px-6 bg-white dark:bg-[#020617] transition-colors scroll-mt-24"
        >
            <div className="max-w-7xl mx-auto">
                {/* ================================
                    CABEÇALHO
                ================================ */}
                <div className="text-center mb-16">
                    <span className="text-sm uppercase tracking-widest text-[#D4AF37]">
                        Publicações
                    </span>
                    <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Livros publicados
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Conheça as obras que já impactaram leitores e continuam
                        transformando histórias em experiências únicas.
                    </p>
                </div>

                {/* ================================
                    GRID DE LIVROS
                ================================ */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {livros.map((livro) => (
                        <div
                            key={livro.id}
                            className="group flex flex-col items-center text-center transition"
                        >
                            {/* CAPA - className em linha única para evitar hydration error */}
                            <div className="relative w-48 h-64 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition">
                                <Image
                                    src={livro.capa}
                                    alt={livro.titulo}
                                    fill
                                    className="object-cover"
                                    priority={livro.id === 1}
                                    loading={livro.id === 1 ? "eager" : "lazy"}
                                />
                            </div>

                            {/* TÍTULO */}
                            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#D4AF37] transition">
                                {livro.titulo}
                            </h3>

                            {/* AUTORA */}
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {livro.autora}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
