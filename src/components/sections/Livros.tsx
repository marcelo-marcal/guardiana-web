"use client";

// ================================
// IMPORTS
// ================================
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLivrosDestaque, type Livro } from "@/services/livros.service";

// ================================
// SEÇÃO LIVROS DA HOME
// ================================
export default function Livros() {
    // ================================
    // ESTADO: LIVROS EM DESTAQUE
    // ================================
    const [livros, setLivros] = useState<Livro[]>([]);

    // ================================
    // CARREGAR SOMENTE OS 3 DESTAQUES
    // ================================
    useEffect(() => {
        const carregarLivrosDestaque = () => {
            setLivros(getLivrosDestaque());
        };

        carregarLivrosDestaque();

        window.addEventListener("livrosAtualizados", carregarLivrosDestaque);

        return () => {
            window.removeEventListener(
                "livrosAtualizados",
                carregarLivrosDestaque,
            );
        };
    }, []);

    return (
        <section
            id="livros"
            className="relative w-full overflow-hidden bg-[#F7F7F7] dark:bg-[#020617] transition-colors scroll-mt-24"
        >
            {/* ================================
                FAIXA DOURADA INCLINADA
            ================================ */}
            <div
                className="
                    absolute inset-x-0 top-24
                    h-[420px] md:h-[460px]
                    bg-[#C4AA35] dark:bg-[#8F7A22]
                    [clip-path:polygon(0_18%,100%_0,100%_100%,0_82%)]
                "
            />

            {/* ================================
                DECORAÇÃO - LIVRO ESQUERDA
            ================================ */}
            <div className="absolute left-6 md:left-14 top-10 w-28 h-28 md:w-44 md:h-44 rotate-[-18deg] opacity-95">
                <Image
                    src="/decor-livro.png"
                    alt="Livro decorativo"
                    fill
                    className="object-contain"
                />
            </div>

            {/* ================================
                DECORAÇÃO - FOLHA DIREITA
            ================================ */}
            <div className="absolute right-0 md:right-8 top-20 w-32 h-32 md:w-56 md:h-56 opacity-95">
                <Image
                    src="/decor-folha.png"
                    alt="Folha decorativa"
                    fill
                    className="object-contain"
                />
            </div>

            {/* ================================
                CONTEÚDO PRINCIPAL
            ================================ */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-28">
                {/* ================================
                    CABEÇALHO
                ================================ */}
                <div className="text-center mb-16">
                    <span className="text-2xl text-[#18384A] dark:text-white">
                        Destaques
                    </span>

                    <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white leading-tight">
                        Livros em destaque
                    </h2>

                    <p className="mt-5 text-white text-lg md:text-xl max-w-5xl mx-auto leading-relaxed">
                        Conheça as obras selecionadas pela Guardiana para
                        aparecerem na página inicial.
                    </p>
                </div>

                {/* ================================
                    GRID DE LIVROS EM DESTAQUE
                ================================ */}
                {livros.length === 0 ? (
                    <div className="max-w-2xl mx-auto rounded-2xl bg-white dark:bg-[#0F1720] border border-gray-200 dark:border-white/10 p-8 text-center shadow-xl">
                        <p className="text-[#344454] dark:text-gray-300">
                            Nenhum livro foi marcado como destaque ainda.
                        </p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-14 lg:gap-24 items-start">
                        {livros.map((livro) => (
                            <Link
                                key={livro.id}
                                href="/livros"
                                className="
                                    group
                                    flex flex-col items-center text-center
                                    transition-all duration-500
                                    hover:-translate-y-2
                                "
                            >
                                {/* CAPA */}
                                <div
                                    className="
                                        relative
                                        w-52 h-72
                                        md:w-56 md:h-80
                                        rounded-lg
                                        overflow-hidden
                                        bg-white
                                        p-5
                                        shadow-xl
                                        border border-gray-100 dark:border-white/10
                                        group-hover:shadow-2xl
                                        group-hover:scale-105
                                        transition-all duration-500
                                    "
                                >
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={livro.imagem}
                                            alt={livro.titulo}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                {/* TÍTULO */}
                                <h3 className="mt-8 text-lg md:text-xl font-extrabold text-[#18384A] dark:text-white group-hover:text-[#C95F52] dark:group-hover:text-[#D4AF37] transition">
                                    {livro.titulo}
                                </h3>

                                {/* AUTOR */}
                                <p className="mt-1 text-sm text-[#344454] dark:text-gray-400">
                                    {livro.autor}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}

                {/* ================================
                    LINK PARA TODOS OS LIVROS
                ================================ */}
                <div className="mt-16 text-center">
                    <Link
                        href="/livros"
                        className="
                            inline-flex
                            px-8 py-3
                            rounded-full
                            bg-[#C95F52]
                            text-white
                            font-bold
                            hover:scale-105
                            hover:brightness-110
                            transition-all duration-300
                        "
                    >
                        Ver todos os livros →
                    </Link>
                </div>
            </div>
        </section>
    );
}
