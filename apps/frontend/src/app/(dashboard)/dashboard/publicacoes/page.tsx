"use client";

import { useEffect, useState } from "react";
import {
    atualizarCategoriaPublicacao,
    atualizarPublicacao,
    criarCategoriaPublicacao,
    criarPublicacao,
    getCategoriasPublicacoes,
    getConteudoConfig,
    getPublicacoes,
    removerCategoriaPublicacao,
    removerPublicacao,
    setConteudoConfig,
    type CategoriaPublicacao,
    type Publicacao,
} from "../../../../services/publicacoes.services";

const publicacaoVazia = {
    categoryId: "",
    title: "",
    description: "",
    author: "",
    date: "",
};

export default function PublicacoesAdmin() {
    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");

    const [categorias, setCategorias] = useState<CategoriaPublicacao[]>([]);
    const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);

    const [nomeCategoria, setNomeCategoria] = useState("");
    const [categoriaEditandoId, setCategoriaEditandoId] = useState<
        string | null
    >(null);

    const [formPublicacao, setFormPublicacao] = useState(publicacaoVazia);
    const [publicacaoEditandoId, setPublicacaoEditandoId] = useState<
        string | null
    >(null);

    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const estaEditandoCategoria = categoriaEditandoId !== null;
    const estaEditandoPublicacao = publicacaoEditandoId !== null;

    const carregarDados = async () => {
        try {
            setLoading(true);
            setErro("");

            const [conteudo, categoriasData, publicacoesData] =
                await Promise.all([
                    getConteudoConfig(),
                    getCategoriasPublicacoes(),
                    getPublicacoes(),
                ]);

            setTitulo(conteudo.titulo);
            setSubtitulo(conteudo.subtitulo);
            setCategorias(categoriasData);
            setPublicacoes(publicacoesData);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao carregar publicações.";

            setErro(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void carregarDados();
    }, []);

    const salvarCabecalho = async () => {
        try {
            setSalvando(true);

            await setConteudoConfig({
                titulo,
                subtitulo,
            });

            alert("Cabeçalho salvo com sucesso!");
            await carregarDados();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao salvar cabeçalho.",
            );
        } finally {
            setSalvando(false);
        }
    };

    const salvarCategoria = async () => {
        try {
            const nomeTratado = nomeCategoria.trim();

            if (!nomeTratado) {
                alert("Informe o nome da categoria.");
                return;
            }

            setSalvando(true);

            if (estaEditandoCategoria) {
                await atualizarCategoriaPublicacao(
                    categoriaEditandoId,
                    nomeTratado,
                );
            } else {
                await criarCategoriaPublicacao(nomeTratado);
            }

            setCategoriaEditandoId(null);
            setNomeCategoria("");
            await carregarDados();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao salvar categoria.",
            );
        } finally {
            setSalvando(false);
        }
    };

    const editarCategoria = (categoria: CategoriaPublicacao) => {
        setCategoriaEditandoId(categoria.id);
        setNomeCategoria(categoria.name);
    };

    const cancelarEdicaoCategoria = () => {
        setCategoriaEditandoId(null);
        setNomeCategoria("");
    };

    const removerCategoria = async (id: string) => {
        try {
            const confirmar = confirm("Deseja remover esta categoria?");

            if (!confirmar) return;

            setSalvando(true);
            await removerCategoriaPublicacao(id);

            if (categoriaEditandoId === id) {
                cancelarEdicaoCategoria();
            }

            await carregarDados();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao remover categoria.",
            );
        } finally {
            setSalvando(false);
        }
    };

    const atualizarCampoPublicacao = (
        campo: keyof typeof publicacaoVazia,
        valor: string,
    ) => {
        setFormPublicacao((atual) => ({
            ...atual,
            [campo]: valor,
        }));
    };

    const salvarPublicacao = async () => {
        try {
            if (
                !formPublicacao.categoryId ||
                !formPublicacao.title ||
                !formPublicacao.description ||
                !formPublicacao.author ||
                !formPublicacao.date
            ) {
                alert("Preencha categoria, título, descrição, autor e data.");
                return;
            }

            setSalvando(true);

            if (estaEditandoPublicacao) {
                await atualizarPublicacao(publicacaoEditandoId, formPublicacao);
            } else {
                await criarPublicacao(formPublicacao);
            }

            setPublicacaoEditandoId(null);
            setFormPublicacao(publicacaoVazia);
            await carregarDados();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao salvar publicação.",
            );
        } finally {
            setSalvando(false);
        }
    };

    const editarPublicacao = (publicacao: Publicacao) => {
        setPublicacaoEditandoId(publicacao.id);
        setFormPublicacao({
            categoryId: publicacao.categoryId,
            title: publicacao.title,
            description: publicacao.description,
            author: publicacao.author,
            date: publicacao.date.slice(0, 10),
        });
    };

    const cancelarEdicaoPublicacao = () => {
        setPublicacaoEditandoId(null);
        setFormPublicacao(publicacaoVazia);
    };

    const removerPublicacaoSelecionada = async (id: string) => {
        try {
            const confirmar = confirm("Deseja remover esta publicação?");

            if (!confirmar) return;

            setSalvando(true);
            await removerPublicacao(id);

            if (publicacaoEditandoId === id) {
                cancelarEdicaoPublicacao();
            }

            await carregarDados();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao remover publicação.",
            );
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Painel Administrativo
                </h1>

                <p className="mt-4 text-gray-600 dark:text-gray-300">
                    Edite o conteúdo da seção Publicações.
                </p>
            </header>

            {erro && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                    {erro}
                </div>
            )}

            {loading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 dark:border-white/10 dark:bg-[#020617] dark:text-gray-300">
                    Carregando publicações...
                </div>
            ) : (
                <>
                    <section className="rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#020617] shadow-sm">
                        <div className="relative bg-[#C95F52] px-8 py-12 text-center">
                            <span className="text-xl text-[#18384A] dark:text-white">
                                Conteúdo
                            </span>

                            <h2 className="mt-4 text-4xl font-extrabold text-white">
                                {titulo || "Título Publicações"}
                            </h2>

                            <p className="mt-5 text-xl text-white">
                                {subtitulo ||
                                    "Subtítulo da seção Publicações"}
                            </p>
                        </div>

                        <div className="p-6 grid md:grid-cols-[1fr_auto] gap-4 items-start">
                            <div className="grid gap-4">
                                <input
                                    value={titulo}
                                    onChange={(e) =>
                                        setTitulo(e.target.value)
                                    }
                                    placeholder="Título da seção Publicações"
                                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                />

                                <textarea
                                    value={subtitulo}
                                    onChange={(e) =>
                                        setSubtitulo(e.target.value)
                                    }
                                    placeholder="Subtítulo da seção Publicações"
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                />
                            </div>

                            <button
                                type="button"
                                disabled={salvando}
                                onClick={salvarCabecalho}
                                className="bg-[#D4AF37] px-6 py-3 rounded-lg text-black font-semibold hover:opacity-90 transition disabled:opacity-60"
                            >
                                Salvar cabeçalho
                            </button>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#020617] p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Categorias
                                </h2>

                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    Organize os filtros exibidos na página de
                                    publicações.
                                </p>
                            </div>

                            {estaEditandoCategoria && (
                                <button
                                    type="button"
                                    onClick={cancelarEdicaoCategoria}
                                    className="text-sm font-semibold text-gray-500 hover:text-[#C95F52] transition"
                                >
                                    Cancelar edição
                                </button>
                            )}
                        </div>

                        <div className="mt-6 grid md:grid-cols-[1fr_auto] gap-4">
                            <input
                                value={nomeCategoria}
                                onChange={(e) =>
                                    setNomeCategoria(e.target.value)
                                }
                                placeholder="Digite o nome da categoria"
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            />

                            <button
                                type="button"
                                disabled={salvando}
                                onClick={salvarCategoria}
                                className="bg-[#D4AF37] px-6 py-3 rounded-lg text-black font-semibold hover:opacity-90 transition disabled:opacity-60"
                            >
                                {estaEditandoCategoria
                                    ? "Salvar alterações"
                                    : "+ Nova categoria"}
                            </button>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                            {categorias.map((categoria) => (
                                <div
                                    key={categoria.id}
                                    className="rounded-2xl bg-[#C95F52] p-3 shadow-sm"
                                >
                                    <div className="rounded-full bg-[#D4AF37] px-8 py-3 text-center text-sm font-bold text-white">
                                        {categoria.name}
                                    </div>

                                    <div className="mt-3 flex justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                editarCategoria(categoria)
                                            }
                                            className="rounded-lg border border-[#18384A] bg-white px-3 py-1.5 text-xs font-semibold text-[#18384A] hover:bg-[#18384A] hover:text-white transition"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                void removerCategoria(
                                                    categoria.id,
                                                )
                                            }
                                            className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#020617] p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Publicações
                                </h2>

                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    Cadastre e edite os cards exibidos na página
                                    de publicações.
                                </p>
                            </div>

                            {estaEditandoPublicacao && (
                                <button
                                    type="button"
                                    onClick={cancelarEdicaoPublicacao}
                                    className="text-sm font-semibold text-gray-500 hover:text-[#C95F52] transition"
                                >
                                    Cancelar edição
                                </button>
                            )}
                        </div>

                        <div className="mt-6 grid md:grid-cols-2 gap-4">
                            <select
                                value={formPublicacao.categoryId}
                                onChange={(e) =>
                                    atualizarCampoPublicacao(
                                        "categoryId",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            >
                                <option value="">Selecione a categoria</option>

                                {categorias.map((categoria) => (
                                    <option
                                        key={categoria.id}
                                        value={categoria.id}
                                    >
                                        {categoria.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                value={formPublicacao.title}
                                onChange={(e) =>
                                    atualizarCampoPublicacao(
                                        "title",
                                        e.target.value,
                                    )
                                }
                                placeholder="Título da publicação"
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            />

                            <input
                                value={formPublicacao.description}
                                onChange={(e) =>
                                    atualizarCampoPublicacao(
                                        "description",
                                        e.target.value,
                                    )
                                }
                                placeholder="Descrição"
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            />

                            <input
                                value={formPublicacao.author}
                                onChange={(e) =>
                                    atualizarCampoPublicacao(
                                        "author",
                                        e.target.value,
                                    )
                                }
                                placeholder="Autor"
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            />

                            <input
                                type="date"
                                value={formPublicacao.date}
                                onChange={(e) =>
                                    atualizarCampoPublicacao(
                                        "date",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            />

                            <button
                                type="button"
                                disabled={salvando}
                                onClick={salvarPublicacao}
                                className="bg-[#D4AF37] px-6 py-3 rounded-lg text-black font-semibold hover:opacity-90 transition disabled:opacity-60"
                            >
                                {estaEditandoPublicacao
                                    ? "Salvar alterações"
                                    : "+ Nova publicação"}
                            </button>
                        </div>

                        <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {publicacoes.map((publicacao) => (
                                <article
                                    key={publicacao.id}
                                    className="rounded-2xl border border-gray-200 dark:border-white/10 bg-[#F7F7F7] dark:bg-[#0F1720] p-6 shadow-sm"
                                >
                                    <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
                                        {publicacao.category.name}
                                    </span>

                                    <h3 className="mt-4 text-xl font-extrabold text-gray-900 dark:text-white">
                                        {publicacao.title}
                                    </h3>

                                    <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                        {publicacao.description}
                                    </p>

                                    <div className="mt-6 flex justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
                                        <span>{publicacao.author}</span>
                                        <span>
                                            {new Date(
                                                publicacao.date,
                                            ).toLocaleDateString("pt-BR")}
                                        </span>
                                    </div>

                                    <div className="mt-5 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                editarPublicacao(publicacao)
                                            }
                                            className="px-4 py-2 rounded-lg border border-[#18384A] text-[#18384A] dark:text-white dark:border-white/30 hover:bg-[#18384A] hover:text-white transition"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                void removerPublicacaoSelecionada(
                                                    publicacao.id,
                                                )
                                            }
                                            className="px-4 py-2 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}