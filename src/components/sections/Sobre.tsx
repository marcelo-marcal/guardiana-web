"use client";

import type { Sobre } from "@/data/sobre";
import { getConteudo, setConteudo } from "@/services/sobre.service";
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
            className="w-full py-24 px-6 bg-white dark:bg-[#020617] transition-colors scroll-mt-24"
        >
            {/* ================================
               CONTAINER
            ================================= */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                {/* ================================
                   LADO ESQUERDO (TEXTO)
                ================================= */}
                <div className="opacity-0 translate-y-6 animate-fadeIn">
                    {/* Label */}
                    <span className="text-sm uppercase tracking-widest text-[#D4AF37]">
                        Sobre nós
                    </span>

                    {/* Título */}
                    <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug">
                        {conteudo.sobre.titulo}
                    </h2>

                    {/* Texto */}
                    <p className="mt-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {conteudo.sobre.subtitulo}
                    </p>
                </div>

                {/* ================================
                   LADO DIREITO (FUNDADORAS)
                ================================= */}
                <div className="grid sm:grid-cols-2 gap-8">
                    {/* ================================
                       CARD - JENIFER
                    ================================= */}
                    <div className="group text-center opacity-0 translate-y-6 animate-fadeIn">
                        {/* IMAGEM */}
                        <div className="relative w-full h-[260px] rounded-2xl overflow-hidden border border-[#D4AF37]/20">
                            <Image
                                src="/jenifer-brum.png"
                                alt="Jenifer Brum"
                                fill
                                className="object-cover group-hover:scale-105 transition duration-500"
                            />
                        </div>

                        {/* NOME */}
                        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Jenifer Brum
                        </h3>

                        {/* CARGO */}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Fundadora & Diretora Editorial
                        </p>
                    </div>

                    {/* ================================
                       CARD - JENNY
                    ================================= */}
                    <div className="group text-center opacity-0 translate-y-6 animate-fadeIn">
                        {/* IMAGEM */}
                        <div className="relative w-full h-[260px] rounded-2xl overflow-hidden border border-[#D4AF37]/20">
                            <Image
                                src="/jenny-gonzalez.png"
                                alt="Jenny Gonzalez"
                                fill
                                className="object-cover group-hover:scale-105 transition duration-500"
                            />
                        </div>

                        {/* NOME */}
                        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Jenny Gonzalez
                        </h3>

                        {/* CARGO */}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Fundadora & Diretora Editorial
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
