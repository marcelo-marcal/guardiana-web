"use client";

import Link from "next/link";

export default function Hero() {
    return (
        // Seção principal ocupando quase toda a tela
        <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background (imagem ou gradiente) */}
            <div className="absolute inset-0">
                {/* Se quiser usar imagem depois: coloque em /public e troque aqui */}
                <div className="w-full h-full bg-gradient-to-br from-[#0F1720] via-[#1E293B] to-[#020617] dark:from-black dark:via-[#020617] dark:to-black" />

                {/* Overlay escuro suave para dar contraste */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Conteúdo central */}
            <div className="relative z-10 text-center px-6 max-w-3xl">
                {/* Título principal */}
                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
                    Vozes que transformam o mundo
                </h1>

                {/* Subtítulo */}
                <p className="mt-6 text-lg md:text-xl text-gray-300">
                    A Guardiana é uma editora dedicada a amplificar histórias,
                    ideias e conhecimentos que inspiram mudança.
                </p>

                {/* Botões de ação */}
                <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                    {/* CTA principal */}
                    <Link
                        href="/publicacoes"
                        className="bg-[#D4AF37] text-black px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
                    >
                        Ver Publicações
                    </Link>

                    {/* CTA secundário */}
                    <Link
                        href="/sobre"
                        className="border border-white/30 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition"
                    >
                        Conheça a Guardiana
                    </Link>
                </div>
            </div>
        </section>
    );
}
