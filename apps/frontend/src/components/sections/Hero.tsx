"use client";

// ================================
// IMPORTS
// ================================
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getConteudo } from "../../services/conteudo.service";
import type { Conteudo } from "../../data/conteudo";

// ================================
// HERO
// ================================
export default function Hero() {
    // ================================
    // ESTADO (SEGURO PARA SSR)
    // ================================
    const [conteudo, setConteudo] = useState<Conteudo>(getConteudo());

    // ================================
    // CARREGA CONTEÚDO DINÂMICO DO ADMIN
    // ================================
    useEffect(() => {
        const atualizar = () => {
            setConteudo(getConteudo());
        };

        window.addEventListener("conteudoAtualizado", atualizar);

        return () => {
            window.removeEventListener("conteudoAtualizado", atualizar);
        };
    }, []);

    return (
        <section className="w-full bg-[#F7F7F7] dark:bg-[#020617] transition-colors">
            {/* ================================
               ÁREA SUPERIOR DO HERO
            ================================= */}
            <div className="max-w-7xl mx-auto px-6 py-10 md:py-12 grid grid-cols-1 lg:grid-cols-[260px_1fr_360px] items-center gap-8">
                {/* LOGO GRANDE À ESQUERDA */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative mx-auto lg:mx-0 w-56 h-56 md:w-64 md:h-64"
                >
                    <Image
                        src="/logo-grande.png"
                        alt="Guardiana Editora"
                        fill
                        priority
                        className="object-contain"
                    />
                </motion.div>

                {/* ILUSTRAÇÃO CENTRAL */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full h-[300px] md:h-[420px]"
                >
                    <Image
                        src="/hero-guardiana.png"
                        alt="Ilustração Guardiana"
                        fill
                        priority
                        className="object-contain"
                    />
                </motion.div>

                {/* TÍTULO À DIREITA */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="text-center lg:text-left"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#C95F52] dark:text-[#D4AF37]">
                        {conteudo.hero.titulo}
                    </h1>
                </motion.div>
            </div>

            {/* ================================
               FAIXA INFERIOR AZUL
            ================================= */}
            <div className="w-full bg-[#18384A] dark:bg-[#0F1720]">
                <div className="max-w-7xl mx-auto px-6 py-8 text-center">
                    {/* SUBTÍTULO */}
                    <motion.p
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                        className="text-white text-base md:text-xl leading-relaxed max-w-5xl mx-auto"
                    >
                        {conteudo.hero.subtitulo}
                    </motion.p>

                    {/* BOTÕES */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6"
                    >
                        <Link
                            href="#publicacoes"
                            className="bg-[#C8A92F] text-white px-8 py-3 rounded-full font-bold hover:scale-105 hover:brightness-110 transition"
                        >
                            Ver Publicações →
                        </Link>

                        <Link
                            href="#sobre"
                            className="bg-[#C8A92F] text-white px-8 py-3 rounded-full font-bold hover:scale-105 hover:brightness-110 transition"
                        >
                            Conheça a Guardiana
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
