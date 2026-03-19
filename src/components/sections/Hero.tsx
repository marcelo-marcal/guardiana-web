"use client";

import Link from "next/link";

export default function Hero() {
    return (
        // ================================
        // HERO PRINCIPAL
        // ================================
        <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
            {/* ================================
               FUNDO BASE (escuro elegante)
            ================================= */}
            <div className="absolute inset-0">
                <div className="w-full h-full bg-gradient-to-b from-[#0F1720] via-[#020617] to-black" />

                {/* Overlay escuro para contraste */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* ================================
               LUZ DE CIMA (efeito abajur/lareira)
               - radial vindo do topo
               - cor dourada (#D4AF37)
            ================================= */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="
                        absolute top-0 left-1/2 -translate-x-1/2
                        w-[900px] h-[600px]
                        bg-[#D4AF37]/20
                        blur-[120px]
                        rounded-full
                    "
                />
            </div>

            {/* ================================
               CONTEÚDO
            ================================= */}
            <div className="relative z-10 text-center px-6 max-w-3xl">
                {/* TÍTULO */}
                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
                    Vozes que transformam o mundo
                </h1>

                {/* SUBTÍTULO */}
                <p className="mt-6 text-lg md:text-xl text-gray-300">
                    A Guardiana é uma editora dedicada a amplificar histórias,
                    ideias e conhecimentos que inspiram mudança.
                </p>

                {/* BOTÕES */}
                <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                    {/* CTA principal */}
                    <Link
                        href="#publicacoes"
                        className="bg-[#D4AF37] text-black px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
                    >
                        Ver Publicações
                    </Link>

                    {/* CTA secundário */}
                    <Link
                        href="#sobre"
                        className="border border-white/30 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition"
                    >
                        Conheça a Guardiana
                    </Link>
                </div>
            </div>
        </section>
    );
}
