"use client";

// ================================
// Dados
// ================================
import { publicacoes } from "@/data/publicacoes";

// ================================
// Componentes
// ================================
import PublicacaoCard from "@/components/ui/PublicacaoCard";

// ================================
// React
// ================================
import { useState } from "react";

// ================================
// Seção de Publicações
// ================================
export default function Publicacoes() {
    // ================================
    // Estado do filtro
    // ================================
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");

    // ================================
    // Extrai categorias únicas
    // ================================
    const categorias = [
        "Todas",
        ...Array.from(new Set(publicacoes.map((p) => p.categoria))),
    ];

    // ================================
    // separa destaque
    // ================================
    const destaque = publicacoes.find((p) => p.destaque);

    // ================================
    // filtra publicações
    // ================================
    const filtradas =
        categoriaAtiva === "Todas"
            ? publicacoes
            : publicacoes.filter((p) => p.categoria === categoriaAtiva);

    // remove destaque do grid
    const restantes = filtradas.filter((p) => !p.destaque);

    return (
        <section
            id="publicacoes"
            className="w-full py-24 px-6 bg-gray-50 dark:bg-[#020617] transition-colors scroll-mt-24"
        >
            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho */}
                <div className="mb-10 text-center">
                    <span className="text-sm uppercase tracking-widest text-[#D4AF37]">
                        Conteúdo
                    </span>

                    <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Publicações em destaque
                    </h2>

                    <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Explore ideias, histórias e conteúdos que inspiram
                        transformação.
                    </p>
                </div>

                {/* ================================
                 FILTRO DE CATEGORIA
                ================================= */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categorias.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategoriaAtiva(cat)}
                            className={`px-4 py-2 rounded-full text-sm border transition
                                ${
                                    categoriaAtiva === cat
                                        ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                                        : "border-gray-300 dark:border-white/20 hover:border-[#D4AF37]"
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* CARD DESTAQUE (só aparece em "Todas") */}
                {categoriaAtiva === "Todas" && destaque && (
                    <div className="mb-16">
                        <div className="rounded-3xl p-10 bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 hover:scale-[1.01] transition">
                            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
                                {destaque.categoria}
                            </span>

                            <h3 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                                {destaque.titulo}
                            </h3>

                            <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg max-w-3xl">
                                {destaque.descricao}
                            </p>

                            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                                {destaque.autor} • {destaque.data}
                            </div>
                        </div>
                    </div>
                )}

                {/* GRID */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {restantes.map((item) => (
                        <PublicacaoCard key={item.id} publicacao={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}
