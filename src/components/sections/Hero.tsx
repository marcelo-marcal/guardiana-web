"use client";

// ================================
// IMPORTS
// ================================
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getConteudo } from "@/services/conteudo.service";

// ================================
// HERO
// ================================
export default function Hero() {
    // ================================
    // ESTADO DO CONTEÚDO (DINÂMICO)
    // ================================
    const [conteudo, setConteudoState] = useState(getConteudo());

    // ================================
    // ATUALIZA EM TEMPO REAL (SEM F5)
    // ================================
    useEffect(() => {
        const atualizar = () => {
            setConteudoState(getConteudo());
        };

        window.addEventListener("conteudoAtualizado", atualizar);

        return () => {
            window.removeEventListener("conteudoAtualizado", atualizar);
        };
    }, []);

    return (
        <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
            {/* ================================
               FUNDO
            ================================= */}
            <div className="absolute inset-0">
                <div className="w-full h-full bg-gradient-to-b from-[#0F1720] via-[#020617] to-black" />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* ================================
               LUZ ANIMADA
            ================================= */}
            <div className="absolute inset-0 pointer-events-none">
                {/* LUZ PRINCIPAL (CORRIGIDA PARA FICAR VISÍVEL) */}
                <motion.div
                    initial={{ opacity: 0.6, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                    className="
                        absolute top-0 left-1/2 -translate-x-1/2
                        w-[800px] h-[500px]
                        bg-[#D4AF37]/15
                        blur-[80px]
                        rounded-full
                    "
                />

                {/* LUZ SECUNDÁRIA (PROFUNDIDADE VISUAL) */}
                <motion.div
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 0.6 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                    className="
                        absolute top-10 left-1/2 -translate-x-1/2
                        w-[600px] h-[400px]
                        bg-[#D4AF37]/40
                        blur-[60px]
                        rounded-full
                    "
                />
            </div>

            {/* ================================
               CONTEÚDO
            ================================= */}
            <div className="relative z-10 text-center px-6 max-w-3xl">
                {/* TÍTULO DINÂMICO */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold leading-tight text-white"
                >
                    {conteudo.hero.titulo}
                </motion.h1>

                {/* SUBTÍTULO DINÂMICO */}
                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-6 text-lg md:text-xl text-gray-300"
                >
                    {conteudo.hero.subtitulo}
                </motion.p>

                {/* BOTÕES */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="#publicacoes"
                        className="
                            bg-[#D4AF37] text-black px-6 py-3 rounded-xl font-medium
                            hover:opacity-90 hover:scale-105
                            transition
                        "
                    >
                        Ver Publicações
                    </Link>

                    <Link
                        href="#sobre"
                        className="
                            border border-white/30 text-white px-6 py-3 rounded-xl
                            hover:bg-white/10 hover:scale-105
                            transition
                        "
                    >
                        Conheça a Guardiana
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
