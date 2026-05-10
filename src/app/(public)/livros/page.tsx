"use client";

// ================================
// IMPORTS
// ================================
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLivros, type Livro } from "@/services/livros.service";

// ================================
// PÁGINA: LIVROS
// ================================
export default function Livros() {
    // ================================
    // ESTADO: LISTA DE LIVROS
    // ================================
    const [livros, setLivros] = useState<Livro[]>([]);

    // ================================
    // ESTADO DO LIVRO SELECIONADO
    // ================================
    const [idBook, setIdBook] = useState<number | null>(null);

    // ================================
    // CARREGAR LIVROS DO "BANCO" LOCAL
    // ================================
    useEffect(() => {
        const carregarLivros = () => {
            setLivros(getLivros());
        };

        carregarLivros();

        window.addEventListener("livrosAtualizados", carregarLivros);

        return () => {
            window.removeEventListener("livrosAtualizados", carregarLivros);
        };
    }, []);

    // ================================
    // BUSCA LIVRO SELECIONADO
    // ================================
    const livroSelecionado = livros.find((livro) => livro.id === idBook);

    // ================================
    // SELECIONAR LIVRO
    // ================================
    const selecionarLivro = (livroId: number) => {
        setIdBook(livroId);

        window.scrollTo({
            top: 400,
            behavior: "smooth",
        });
    };

    // ================================
    // VOLTAR PARA LISTA
    // ================================
    const voltarParaLista = () => {
        setIdBook(null);
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#F7F7F7] dark:bg-[#020617] transition-colors">
            {/* ================================
                HERO DA PÁGINA
            ================================ */}
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

            {/* ================================
                CONTEÚDO PRINCIPAL
            ================================ */}
            <div className="flex-1">
                {/* ================================
                    DETALHES DO LIVRO SELECIONADO
                ================================ */}
                {livroSelecionado && (
                    <section className="px-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                                {/* COLUNA ESQUERDA: IMAGEM + INFO */}
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

                                    <div className="text-center lg:text-left">
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#18384A] dark:text-white">
                                            {livroSelecionado.titulo}
                                        </h2>

                                        <p className="mt-2 text-xl text-[#D4AF37] font-medium tracking-wide">
                                            {livroSelecionado.autor}
                                        </p>
                                    </div>
                                </div>

                                {/* COLUNA DIREITA: DESCRIÇÃO */}
                                <div className="space-y-8 pt-4">
                                    <article
                                        className="
                                            rounded-2xl
                                            bg-white dark:bg-[#0F1720]
                                            border border-gray-200 dark:border-white/10
                                            p-8
                                            md:p-10
                                            shadow-sm
                                        "
                                    >
                                        <h3 className="text-2xl font-extrabold text-[#18384A] dark:text-white mb-6">
                                            {livroSelecionado.titulo}
                                        </h3>

                                        <p className="whitespace-pre-line text-[#344454] dark:text-gray-300 text-lg leading-relaxed">
                                            {livroSelecionado.descricao}
                                        </p>

                                        {/* ================================
                                            DADOS TÉCNICOS DO LIVRO
                                        ================================ */}
                                        <div className="mt-8 grid sm:grid-cols-2 gap-4 text-sm text-[#344454] dark:text-gray-300">
                                            {livroSelecionado.ano && (
                                                <p>
                                                    <strong>Ano:</strong>{" "}
                                                    {livroSelecionado.ano}
                                                </p>
                                            )}

                                            {livroSelecionado.isbn && (
                                                <p>
                                                    <strong>ISBN:</strong>{" "}
                                                    {livroSelecionado.isbn}
                                                </p>
                                            )}

                                            {livroSelecionado.paginas && (
                                                <p>
                                                    <strong>Páginas:</strong>{" "}
                                                    {livroSelecionado.paginas}
                                                </p>
                                            )}

                                            {livroSelecionado.preco && (
                                                <p>
                                                    <strong>Preço:</strong>{" "}
                                                    {livroSelecionado.preco}
                                                </p>
                                            )}

                                            {livroSelecionado.dimensoes && (
                                                <p>
                                                    <strong>Dimensões:</strong>{" "}
                                                    {livroSelecionado.dimensoes}
                                                </p>
                                            )}

                                            {livroSelecionado.idioma && (
                                                <p>
                                                    <strong>Idioma:</strong>{" "}
                                                    {livroSelecionado.idioma}
                                                </p>
                                            )}
                                        </div>
                                    </article>

                                    <button
                                        type="button"
                                        onClick={voltarParaLista}
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

                {/* ================================
                    GRID DE LIVROS
                    - Mostra TODOS os livros cadastrados
                    - Destaque ou não destaque
                ================================ */}
                <section className="px-6 pb-24">
                    <div className="max-w-7xl mx-auto">
                        {livros.length === 0 ? (
                            <p className="text-center text-gray-600 dark:text-gray-300">
                                Nenhum livro cadastrado ainda.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {livros.map((livro) => (
                                    <button
                                        key={livro.id}
                                        type="button"
                                        onClick={() =>
                                            selecionarLivro(livro.id)
                                        }
                                        className="group cursor-pointer text-left"
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

                                            {livro.destaqueHome && (
                                                <span className="inline-block mt-2 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-black">
                                                    Destaque Home
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* ================================
                CTA FINAL
            ================================ */}
            <section className="mt-auto relative overflow-hidden px-6 py-20 bg-[#C95F52] dark:bg-[#7E342D]">
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
