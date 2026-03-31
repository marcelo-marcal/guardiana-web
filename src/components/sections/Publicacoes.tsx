"use client";

import { publicacoes } from "@/data/publicacoes";
import PublicacaoCard from "@/components/ui/PublicacaoCard";
import { useEffect, useState } from "react";
import { PublicacaoConfig, publicacaoConfig } from "@/data/publicacaoConfig";
import { getConteudoConfig } from "@/services/publicacoes.services";

// ================================
// Seção de Publicações
// ================================
export default function Publicacoes() {
    // ================================
    // Estado do filtro
    // ================================
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
    const [conteudoConfig, setConteudoConfig] = useState<PublicacaoConfig | null>(null);

    // ================================
    // Extrai categorias únicas
    // ================================
    const categorias = [
        "Todas",
        ...Array.from(new Set(publicacoes.map((p) => p.categoria))),
    ];

    // ================================
    // Separa destaque
    // ================================
    const destaque = publicacoes.find((p) => p.destaque);

    // ================================
    // Filtra publicações
    // ================================
    const filtradas =
        categoriaAtiva === "Todas"
            ? publicacoes
            : publicacoes.filter((p) => p.categoria === categoriaAtiva);

    // Remove destaque do grid
    const restantes = filtradas.filter((p) => !p.destaque);

    useEffect(() => {
        const data = getConteudoConfig();
        setConteudoConfig(data);

        const atualizar = () => {
            setConteudoConfig(getConteudoConfig());
        }

        window.addEventListener("conteudoAtualizado", atualizar);

        return () => {
            window.removeEventListener("conteudoAtualizado", atualizar);
        };
    }, []);

    if (!conteudoConfig) return null;

    return (
        <section
            id="publicacoes"
            className="w-full py-24 px-6 bg-gray-50 dark:bg-[#020617] transition-colors scroll-mt-24"
        >
            <div className="max-w-7xl mx-auto">
                {/* ================================
                    CABEÇALHO
                ================================ */}
                <div className="mb-10 text-center">
                    <span className="text-sm uppercase tracking-widest text-[#D4AF37]">
                        Conteúdo
                    </span>
                    <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        {conteudoConfig.titulo}
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {conteudoConfig.subtitulo}
                    </p>
                </div>

                {/* ================================
                    FILTRO DE CATEGORIA
                    - className em linha única para evitar hydration error
                ================================ */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categorias.map((cat) => {
                        const ativo = categoriaAtiva === cat;
                        const classeBase =
                            "px-4 py-2 rounded-full text-sm border transition-all duration-300";
                        const classeAtivo =
                            "bg-[#D4AF37] text-black border-[#D4AF37] shadow-md";
                        const classeInativo =
                            "text-gray-800 dark:text-white border-gray-300 dark:border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37]";

                        return (
                            <button
                                key={cat}
                                onClick={() => setCategoriaAtiva(cat)}
                                className={`${classeBase} ${ativo ? classeAtivo : classeInativo}`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* ================================
                    CARD DESTAQUE
                ================================ */}
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

                {/* ================================
                    GRID DE CARDS
                ================================ */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {restantes.map((item, index) => (
                        <div
                            key={item.id}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <PublicacaoCard publicacao={item} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
