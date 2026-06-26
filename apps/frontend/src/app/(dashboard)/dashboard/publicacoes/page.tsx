"use client";

// ================================
// IMPORTS
// ================================
import { useEffect, useState } from "react";
import {
    getConteudoConfig,
    setConteudoConfig,
} from "../../../../services/publicacoes.services";
import {
    publicacoes as initialPublicacoes,
    categorias as initialCategorias,
} from "../../../../data/publicacoes";

// ================================
// TIPOS
// ================================
type Categoria = (typeof initialCategorias)[number];
type Publicacao = (typeof initialPublicacoes)[number];

const publicacaoVazia = {
    categoria: "",
    titulo: "",
    descricao: "",
    autor: "",
    data: "",
};

// ================================
// DASHBOARD PUBLICAÇÕES
// ================================
export default function PublicacoesAdmin() {
    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
    const [dadosCarregados, setDadosCarregados] = useState(false);

    const [nomeCategoria, setNomeCategoria] = useState("");
    const [categoriaEditandoId, setCategoriaEditandoId] = useState<
        number | null
    >(null);

    const [formPublicacao, setFormPublicacao] = useState(publicacaoVazia);
    const [publicacaoEditandoId, setPublicacaoEditandoId] = useState<
        number | null
    >(null);

    const estaEditandoCategoria = categoriaEditandoId !== null;
    const estaEditandoPublicacao = publicacaoEditandoId !== null;

    useEffect(() => {
        const dataCategorias = localStorage.getItem("categorias");
        const dataPublicacoes = localStorage.getItem("publicacoes");

        setCategorias(
            dataCategorias
                ? (JSON.parse(dataCategorias) as Categoria[])
                : initialCategorias,
        );

        setPublicacoes(
            dataPublicacoes
                ? (JSON.parse(dataPublicacoes) as Publicacao[])
                : initialPublicacoes,
        );

        const conteudo = getConteudoConfig();
        setTitulo(conteudo.titulo);
        setSubtitulo(conteudo.subtitulo);

        setDadosCarregados(true);
    }, []);

    useEffect(() => {
        if (!dadosCarregados) return;

        localStorage.setItem("categorias", JSON.stringify(categorias));
        window.dispatchEvent(new Event("publicacoesAtualizadas"));
    }, [categorias, dadosCarregados]);

    useEffect(() => {
        if (!dadosCarregados) return;

        localStorage.setItem("publicacoes", JSON.stringify(publicacoes));
        window.dispatchEvent(new Event("publicacoesAtualizadas"));
    }, [publicacoes, dadosCarregados]);

    const salvarCabecalho = () => {
        setConteudoConfig({
            titulo,
            subtitulo,
        });

        window.dispatchEvent(new Event("conteudoAtualizado"));
        window.dispatchEvent(new Event("publicacoesAtualizadas"));

        alert("Cabeçalho salvo com sucesso!");
    };

    const salvarCategoria = () => {
        const nomeTratado = nomeCategoria.trim();

        if (!nomeTratado) {
            alert("Informe o nome da categoria.");
            return;
        }

        if (estaEditandoCategoria) {
            const categoriaAtual = categorias.find(
                (categoria) => categoria.id === categoriaEditandoId,
            );

            const nomeAnterior = categoriaAtual?.categoria ?? "";

            setCategorias((atuais) =>
                atuais.map((categoria) =>
                    categoria.id === categoriaEditandoId
                        ? { ...categoria, categoria: nomeTratado }
                        : categoria,
                ),
            );

            setPublicacoes((atuais) =>
                atuais.map((publicacao) =>
                    publicacao.categoria === nomeAnterior
                        ? { ...publicacao, categoria: nomeTratado }
                        : publicacao,
                ),
            );

            setCategoriaEditandoId(null);
            setNomeCategoria("");
            return;
        }

        setCategorias((atuais) => [
            ...atuais,
            {
                id: Date.now(),
                categoria: nomeTratado,
            },
        ]);

        setNomeCategoria("");
    };

    const editarCategoria = (categoria: Categoria) => {
        setCategoriaEditandoId(categoria.id);
        setNomeCategoria(categoria.categoria);
    };

    const cancelarEdicaoCategoria = () => {
        setCategoriaEditandoId(null);
        setNomeCategoria("");
    };

    const removerCategoria = (id: number) => {
        const categoria = categorias.find((item) => item.id === id);

        if (!categoria) return;

        const confirmar = confirm(
            `Deseja remover a categoria "${categoria.categoria}"?`,
        );

        if (!confirmar) return;

        setCategorias((atuais) => atuais.filter((item) => item.id !== id));

        setPublicacoes((atuais) =>
            atuais.filter((item) => item.categoria !== categoria.categoria),
        );

        if (categoriaEditandoId === id) {
            cancelarEdicaoCategoria();
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

    const salvarPublicacao = () => {
        if (
            !formPublicacao.categoria ||
            !formPublicacao.titulo ||
            !formPublicacao.descricao ||
            !formPublicacao.autor ||
            !formPublicacao.data
        ) {
            alert("Preencha categoria, título, descrição, autor e data.");
            return;
        }

        if (estaEditandoPublicacao) {
            setPublicacoes((atuais) =>
                atuais.map((publicacao) =>
                    publicacao.id === publicacaoEditandoId
                        ? {
                              ...publicacao,
                              categoria: formPublicacao.categoria,
                              titulo: formPublicacao.titulo,
                              descricao: formPublicacao.descricao,
                              autor: formPublicacao.autor,
                              data: formPublicacao.data,
                          }
                        : publicacao,
                ),
            );

            setPublicacaoEditandoId(null);
            setFormPublicacao(publicacaoVazia);
            return;
        }

        setPublicacoes((atuais) => [
            ...atuais,
            {
                id: Date.now(),
                categoria: formPublicacao.categoria,
                titulo: formPublicacao.titulo,
                descricao: formPublicacao.descricao,
                autor: formPublicacao.autor,
                data: formPublicacao.data,
            },
        ]);

        setFormPublicacao(publicacaoVazia);
    };

    const editarPublicacao = (publicacao: Publicacao) => {
        setPublicacaoEditandoId(publicacao.id);
        setFormPublicacao({
            categoria: publicacao.categoria,
            titulo: publicacao.titulo,
            descricao: publicacao.descricao,
            autor: publicacao.autor,
            data: publicacao.data,
        });
    };

    const cancelarEdicaoPublicacao = () => {
        setPublicacaoEditandoId(null);
        setFormPublicacao(publicacaoVazia);
    };

    const removerPublicacao = (id: number) => {
        const confirmar = confirm("Deseja remover esta publicação?");

        if (!confirmar) return;

        setPublicacoes((atuais) =>
            atuais.filter((publicacao) => publicacao.id !== id),
        );

        if (publicacaoEditandoId === id) {
            cancelarEdicaoPublicacao();
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

            <section className="rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#020617] shadow-sm">
                <div className="relative bg-[#C95F52] px-8 py-12 text-center">
                    <span className="text-xl text-[#18384A] dark:text-white">
                        Conteúdo
                    </span>

                    <h2 className="mt-4 text-4xl font-extrabold text-white">
                        {titulo || "Título Publicações"}
                    </h2>

                    <p className="mt-5 text-xl text-white">
                        {subtitulo || "Subtítulo da seção Publicações"}
                    </p>
                </div>

                <div className="p-6 grid md:grid-cols-[1fr_auto] gap-4 items-start">
                    <div className="grid gap-4">
                        <input
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Título da seção Publicações"
                            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        />

                        <textarea
                            value={subtitulo}
                            onChange={(e) => setSubtitulo(e.target.value)}
                            placeholder="Subtítulo da seção Publicações"
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={salvarCabecalho}
                        className="bg-[#D4AF37] px-6 py-3 rounded-lg text-black font-semibold hover:opacity-90 transition"
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
                        onChange={(e) => setNomeCategoria(e.target.value)}
                        placeholder="Digite o nome da categoria"
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />

                    <button
                        type="button"
                        onClick={salvarCategoria}
                        className="bg-[#D4AF37] px-6 py-3 rounded-lg text-black font-semibold hover:opacity-90 transition"
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
                                {categoria.categoria}
                            </div>

                            <div className="mt-3 flex justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => editarCategoria(categoria)}
                                    className="rounded-lg border border-[#18384A] bg-white px-3 py-1.5 text-xs font-semibold text-[#18384A] hover:bg-[#18384A] hover:text-white transition"
                                >
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        removerCategoria(categoria.id)
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
                            Cadastre e edite os cards exibidos na página de
                            publicações.
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
                        value={formPublicacao.categoria}
                        onChange={(e) =>
                            atualizarCampoPublicacao(
                                "categoria",
                                e.target.value,
                            )
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                        <option value="">Selecione a categoria</option>

                        {categorias.map((categoria) => (
                            <option
                                key={categoria.id}
                                value={categoria.categoria}
                            >
                                {categoria.categoria}
                            </option>
                        ))}
                    </select>

                    <input
                        value={formPublicacao.titulo}
                        onChange={(e) =>
                            atualizarCampoPublicacao("titulo", e.target.value)
                        }
                        placeholder="Título da publicação"
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />

                    <input
                        value={formPublicacao.descricao}
                        onChange={(e) =>
                            atualizarCampoPublicacao(
                                "descricao",
                                e.target.value,
                            )
                        }
                        placeholder="Descrição"
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />

                    <input
                        value={formPublicacao.autor}
                        onChange={(e) =>
                            atualizarCampoPublicacao("autor", e.target.value)
                        }
                        placeholder="Autor"
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />

                    <input
                        type="date"
                        value={formPublicacao.data}
                        onChange={(e) =>
                            atualizarCampoPublicacao("data", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />

                    <button
                        type="button"
                        onClick={salvarPublicacao}
                        className="bg-[#D4AF37] px-6 py-3 rounded-lg text-black font-semibold hover:opacity-90 transition"
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
                                {publicacao.categoria}
                            </span>

                            <h3 className="mt-4 text-xl font-extrabold text-gray-900 dark:text-white">
                                {publicacao.titulo}
                            </h3>

                            <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                {publicacao.descricao}
                            </p>

                            <div className="mt-6 flex justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span>{publicacao.autor}</span>
                                <span>{publicacao.data}</span>
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
                                        removerPublicacao(publicacao.id)
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
        </div>
    );
}