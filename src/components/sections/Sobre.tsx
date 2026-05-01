"use client";

// ================================
// TIPAGEM DO CONTEÚDO SOBRE
// ================================
import type { Sobre } from "@/data/sobre";

// ================================
// SERVICE DO CONTEÚDO SOBRE
// ================================
import { getConteudo } from "@/services/sobre.service";

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
                <div className="grid lg:grid-cols-[1fr_1.35fr] gap-14 lg:gap-20 items-center">
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
                       LADO DIREITO (FUNDADORAS)
                    ================================= */}
                    <div className="grid sm:grid-cols-2 gap-8 lg:gap-10">
                        {/* ================================
                           CARD - JENIFER
                        ================================= */}
                        <div className="group bg-white dark:bg-[#0F1720] rounded-xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden text-center opacity-0 translate-y-6 animate-fadeIn hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
                            {/* IMAGEM */}
                            <div className="relative w-full h-[150px] md:h-[170px] bg-white">
                                <Image
                                    src="/jenifer-brum.png"
                                    alt="Jenifer Brum"
                                    fill
                                    className="object-cover group-hover:scale-105 transition duration-500"
                                />
                            </div>

                            {/* CONTEÚDO DO CARD */}
                            <div className="px-6 py-6">
                                {/* NOME */}
                                <h3 className="text-lg font-extrabold text-[#18384A] dark:text-white group-hover:text-[#C95F52] dark:group-hover:text-[#D4AF37] transition">
                                    Jenifer Brum
                                </h3>

                                {/* CARGO */}
                                <p className="mt-2 text-sm text-[#344454] dark:text-gray-400">
                                    Fundadora & Diretora Editorial
                                </p>
                            </div>
                        </div>

                        {/* ================================
                           CARD - JENNY
                        ================================= */}
                        <div className="group bg-white dark:bg-[#0F1720] rounded-xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden text-center opacity-0 translate-y-6 animate-fadeIn hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
                            {/* IMAGEM */}
                            <div className="relative w-full h-[150px] md:h-[170px] bg-white">
                                <Image
                                    src="/jenny-gonzalez.png"
                                    alt="Jenny Gonzalez"
                                    fill
                                    className="object-cover group-hover:scale-105 transition duration-500"
                                />
                            </div>

                            {/* CONTEÚDO DO CARD */}
                            <div className="px-6 py-6">
                                {/* NOME */}
                                <h3 className="text-lg font-extrabold text-[#18384A] dark:text-white group-hover:text-[#C95F52] dark:group-hover:text-[#D4AF37] transition">
                                    Jenny Gonzalez
                                </h3>

                                {/* CARGO */}
                                <p className="mt-2 text-sm text-[#344454] dark:text-gray-400">
                                    Fundadora & Diretora Editorial
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
