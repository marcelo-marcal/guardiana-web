"use client";

// ================================
// TIPAGEM DO CONTEÚDO SOBRE
// ================================
import type { Sobre } from "../../data/sobre";

// ================================
// SERVICE DO CONTEÚDO SOBRE
// ================================
import { getConteudo } from "../../services/sobre.service";

// ================================
// Import de imagem otimizada do Next
// ================================
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Sobre() {
    // ================================
    // ESTADO (SEGURO PARA SSR)
    // ================================
    const [conteudo, setConteudo] = useState<Sobre | null>(null);

    // ================================
    // CARREGA NO CLIENT (SEM SSR BUG)
    // ================================
    useEffect(() => {
        const data = getConteudo();
        setConteudo(data);

        const atualizar = () => {
            setConteudo(getConteudo());
        };

        window.addEventListener("conteudoAtualizado", atualizar);

        return () => {
            window.removeEventListener("conteudoAtualizado", atualizar);
        };
    }, []);

    // ================================
    // EVITA ERRO DE HIDRATAÇÃO
    // ================================
    if (!conteudo) return null;

    return (
        // ID + scroll offset para header fixo
        <section
            id="sobre"
            className="w-full bg-[#F7F7F7] dark:bg-[#020617] transition-colors scroll-mt-24"
        >
            {/* ================================
               CONTAINER PRINCIPAL
            ================================= */}
            <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
                <div className="grid lg:grid-cols-[1fr_1.15fr] gap-14 lg:gap-20 items-center">
                    {/* ================================
                       LADO ESQUERDO (TEXTO)
                    ================================= */}
                    <div className="opacity-0 translate-y-6 animate-fadeIn">
                        {/* Label */}
                        <span className="block text-2xl md:text-3xl font-normal text-[#18384A] dark:text-white">
                            Sobre nós
                        </span>

                        {/* Título */}
                        <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#C95F52] dark:text-[#D4AF37] leading-tight max-w-xl">
                            {conteudo.sobre.titulo}
                        </h2>

                        {/* Texto */}
                        <p className="mt-6 text-[#344454] dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                            {conteudo.sobre.subtitulo}
                        </p>
                    </div>

                    {/* ================================
                       LADO DIREITO (IMAGEM INSTITUCIONAL)
                       - Substitui os dois cards antigos
                       - Futuramente pode vir do Admin/SaaS
                    ================================= */}
                    <div className="flex justify-center lg:justify-end opacity-0 translate-y-6 animate-fadeIn">
                        <div
                            className="
                                group
                                relative
                                w-full max-w-sm
                                h-[430px] md:h-[520px]
                                bg-white dark:bg-[#0F1720]
                                rounded-2xl
                                overflow-hidden
                                shadow-xl
                                border border-gray-200 dark:border-white/10
                                hover:-translate-y-2
                                hover:shadow-2xl
                                transition-all duration-500
                            "
                        >
                            <Image
                                src="/tres-amigas.png"
                                alt="Equipe Guardiana"
                                fill
                                priority
                                className="object-cover object-top group-hover:scale-105 transition duration-700"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
