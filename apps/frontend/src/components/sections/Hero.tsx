"use client";

// ================================
// IMPORTS
// ================================
import Link from "next/link";
import { motion } from "framer-motion";
import {
    useEffect,
    useState,
} from "react";

import Carousel from "@/components/sections/Carousel";
import { getConteudo } from "../../services/conteudo.service";

// ================================
// HERO
// ================================
export default function Hero() {
    // ================================
    // CONTEÚDO DINÂMICO
    // ================================
    const [conteudo, setConteudo] =
        useState(getConteudo());

    // ================================
    // ATUALIZAÇÃO PELO ADMIN
    // ================================
    useEffect(() => {
        const atualizar = () => {
            setConteudo(getConteudo());
        };

        window.addEventListener(
            "conteudoAtualizado",
            atualizar,
        );

        return () => {
            window.removeEventListener(
                "conteudoAtualizado",
                atualizar,
            );
        };
    }, []);

    return (
        <section
            className="
                w-full
                bg-[#F7F7F7]
                transition-colors
                dark:bg-[#020617]
            "
        >
            {/* ================================
                CARROSSEL PRINCIPAL
            ================================= */}

            <Carousel />

            {/* ================================
                FAIXA INFERIOR AZUL

                Esta área NÃO pertence ao
                carrossel.

                Ela aparece abaixo dele quando
                o visitante começa a rolar
                a página.
            ================================= */}

            <div
                className="
                    w-full
                    bg-[#18384A]
                    dark:bg-[#0F1720]
                "
            >
                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-6
                        py-7
                        text-center
                        md:py-8
                    "
                >
                    {/* ========================
                        SUBTÍTULO
                    ======================== */}

                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 18,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.4,
                        }}
                        transition={{
                            duration: 0.6,
                        }}
                        className="
                            mx-auto
                            max-w-5xl
                            text-base
                            leading-relaxed
                            text-white
                            md:text-lg
                        "
                    >
                        {
                            conteudo.hero
                                .subtitulo
                        }
                    </motion.p>

                    {/* ========================
                        BOTÕES
                    ======================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 18,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.4,
                        }}
                        transition={{
                            duration: 0.6,
                            delay: 0.1,
                        }}
                        className="
                            mt-6
                            flex
                            flex-col
                            items-center
                            justify-center
                            gap-4
                            sm:flex-row
                            sm:gap-6
                        "
                    >
                        <Link
                            href="#publicacoes"
                            className="
                                min-w-[205px]
                                rounded-full
                                bg-[#C8A92F]
                                px-7
                                py-3
                                font-bold
                                text-white
                                transition
                                hover:scale-105
                                hover:brightness-110
                            "
                        >
                            Ver Publicações →
                        </Link>

                        <Link
                            href="#sobre"
                            className="
                                min-w-[205px]
                                rounded-full
                                bg-[#C8A92F]
                                px-7
                                py-3
                                font-bold
                                text-white
                                transition
                                hover:scale-105
                                hover:brightness-110
                            "
                        >
                            Conheça a Guardiana
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}