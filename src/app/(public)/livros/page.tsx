"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// ================================
// DADOS DOS LIVROS
// ================================
const livros = [
    {
        id: 1,
        imagem: "/livro-emaranhado.jpeg",
        titulo: "Emaranhado",
        autor: "Talles Lisot",
        conteudos: [
            {
                titulo: "Emaranhado",
                descricao: `Emaranhado nasce como um mergulho íntimo na mente do
                        jovem artista brasileiro de Marau, Rio Grande do Sul, Talles
                        Lisot. Neste livro de escritos e poemas, a palavra se torna
                        espelho e labirinto. Um espaço onde dúvidas sobre a vida, a
                        criação e a própria identidade se entrelaçam sem a promessa
                        de respostas fáceis.
                        
                        Livro físico 
                        Ano: 2026
                        ISBN: 978-65-975564-0-3
                        Capa comum
                        108 páginas
                        Preço:
                        Dimensões: 14x21 cm
                        Idioma: Português`,
            },
        ],
    },
];

export default function Livros() {
    const [idBook, setIdBook] = useState(null);
    const livroSelecionado = livros.find((l) => l.id === idBook);

    return (
        <main className="bg-[#F7F7F7] dark:bg-[#020617] transition-colors min-h-screen">
            {/* HERO DA PÁGINA */}
            <section className="px-6 py-20">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="text-sm uppercase tracking-widest text-[#D4AF37]">
                        Guardiana Editora
                    </span>
                    <h1 className="mt-4 text-4xl md:text-6xl font-extrabold text-[#18384A] dark:text-white leading-tight">
                        Livros
                    </h1>
                </div>
            </section>

            {/* SEÇÃO DE DETALHES (REVELADA AO CLICAR) */}
            {livroSelecionado && (
                <section className="px-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                            
                            {/* COLUNA DA ESQUERDA: IMAGEM + INFO BÁSICA */}
                            <div className="space-y-6">
                                <div className="relative w-full h-[450px] md:h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10">
                                    <Image
                                        src={livroSelecionado.imagem}
                                        alt={livroSelecionado.titulo}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                
                                {/* NOME E AUTOR ABAIXO DA IMAGEM */}
                                <div className="text-center lg:text-left">
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#18384A] dark:text-white">
                                        {livroSelecionado.titulo}
                                    </h2>
                                    <p className="mt-2 text-xl text-[#D4AF37] font-medium tracking-wide">
                                        {livroSelecionado.autor}
                                    </p>
                                </div>
                            </div>

                            {/* COLUNA DA DIREITA: DESCRIÇÃO/CONTEÚDO */}
                            <div className="space-y-8 pt-4">
                                {livroSelecionado.conteudos.map((conteudo, idx) => (
                                    <article
                                        key={idx}
                                        className="
                                        rounded-2xl
                                        bg-white dark:bg-[#0F1720]
                                        border border-gray-200 dark:border-white/10
                                        p-8
                                        md:p-10
                                        shadow-sm
                                        "
                                    >
                                        <p
                                            style={{
                                                whiteSpace: "pre-line",
                                             }}
                                            className="text-[#344454] dark:text-gray-300 text-lg leading-relaxed"
                                        >
                                            {conteudo.descricao}
                                        </p>
                                    </article>
                                ))}
                                
                                <button 
                                    onClick={() => setIdBook(null)}
                                    className="flex items-center gap-2 text-[#18384A] dark:text-white font-bold hover:text-[#D4AF37] transition-colors"
                                >
                                    ← Voltar para a lista
                                </button>
                            </div>

                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto mt-20 border-b border-gray-200 dark:border-white/10" />
                </section>
            )}

            {/* GRID DE LIVROS (LISTA GERAL) */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {livros.map((livro) => (
                            <div
                                key={livro.id}
                                onClick={() => {
                                    setIdBook(livro.id);
                                    window.scrollTo({ top: 400, behavior: "smooth" });
                                }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                                    <Image
                                        src={livro.imagem}
                                        alt={livro.titulo}
                                        fill
                                        className="object-cover group-hover:scale-110 transition duration-700"
                                    />
                                </div>
                                <div className="mt-4 text-center">
                                    <h4 className="font-bold text-[#18384A] dark:text-white group-hover:text-[#D4AF37] transition-colors">
                                        {livro.titulo}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {livro.autor}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* ================================
                CTA FINAL
            ================================ */}
            <section className="relative overflow-hidden px-6 py-20 bg-[#C95F52] dark:bg-[#7E342D]">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                        Tem uma história para publicar?
                    </h2>

                    <p className="mt-5 text-white text-lg max-w-3xl mx-auto leading-relaxed">
                        Entre em contato com a Guardiana e converse conosco
                        sobre sua ideia, seu livro ou seu projeto editorial.
                    </p>

                    <Link
                        href="/contato"
                        className="
                            inline-flex
                            mt-8
                            px-8 py-3
                            rounded-full
                            border border-white
                            text-white
                            font-bold
                            hover:bg-white
                            hover:text-[#C95F52]
                            transition-all duration-300
                        "
                    >
                        Fale conosco →
                    </Link>
                </div>
            </section>
        </main>
    );
}
