"use client";

// ================================
// IMPORTS
// ================================
import { useEffect, useState } from "react";
import {
    getConteudoConfig,
    setConteudoConfig,
} from "../../../../services/publicacoes.services";

const initialCategorias = [
    { id: 1, categoria: "Categoria 1" },
    { id: 2, categoria: "Categoria 2" },
];

const initialPublicacoes = [
    {
        id: 1,
        categoria: "Categoria 1",
        titulo: "Publicação 1",
        descricao: "Descrição 1",
        autor: "Autor 1",
        data: "05/04/2026",
    },
    {
        id: 2,
        categoria: "Categoria 2",
        titulo: "Publicação 2",
        descricao: "Descrição 2",
        autor: "Autor 2",
        data: "05/04/2026",
    },
];

// ================================
// DASHBOARD HOME (AGORA EDITÁVEL)
// ================================
export default function PublicacoesAdmin() {
    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");
    const [categoria, setCategoria] = useState<typeof initialCategorias>([]);
    const [nmcategoria, setNmCategoria] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [tituloPublicacao, setTituloPublicacao] = useState("");
    const [descricaoPublicacao, setDescricaoPublicacao] = useState("");
    const [autorPublicacao, setAutorPublicacao] = useState("");
    const [dataPublicacao, setDataPublicacao] = useState("");
    const [publicacao, setPublicacao] = useState<typeof initialPublicacoes>([]);

    // ================================
    // CARREGAR DADOS
    // ================================
    useEffect(() => {
        const data = getConteudoConfig();
        const dataCategoria = localStorage.getItem("categorias");
        const dataPublicacao = localStorage.getItem("publicacoes");

        if (dataCategoria) {
            setCategoria(JSON.parse(dataCategoria));
        } else {
            setCategoria(initialCategorias);
        }

        if (dataPublicacao) {
            setPublicacao(JSON.parse(dataPublicacao));
        } else {
            setPublicacao(initialPublicacoes);
        }

        setTitulo(data.titulo);
        setSubtitulo(data.subtitulo);
    }, []);

    useEffect(() => {
        if (categoria.length > 0) {
            localStorage.setItem("categorias", JSON.stringify(categoria));
        }
    }, [categoria]);

    useEffect(() => {
        if (publicacao.length > 0) {
            localStorage.setItem("publicacoes", JSON.stringify(publicacao));
        }
    }, [publicacao]);

    // ================================
    // SALVAR
    // ================================
    const salvar = () => {
        setConteudoConfig({
            titulo: titulo,
            subtitulo: subtitulo,
        });
        // AVISA O SITE
        window.dispatchEvent(new Event("conteudoAtualizado"));

        alert("Conteúdo salvo!");
    };

    const adicionarCategoria = () => {
        if (!nmcategoria) return;

        const novo = {
            id: Date.now(),
            categoria: nmcategoria,
        };

        setCategoria([...categoria, novo]);
        setNmCategoria("");
    };

    const removerCategoria = (id: number) => {
        setCategoria(categoria.filter((l) => l.id !== id));
    };

    const adicionarPublicacao = () => {
        if (
            !tituloPublicacao ||
            !descricaoPublicacao ||
            !autorPublicacao ||
            !dataPublicacao
        )
            return;

        const novo = {
            id: Date.now(),
            categoria: categoriaSelecionada,
            titulo: tituloPublicacao,
            descricao: descricaoPublicacao,
            autor: autorPublicacao,
            data: dataPublicacao,
        };

        setPublicacao([...publicacao, novo]);
        setTituloPublicacao("");
        setDescricaoPublicacao("");
        setAutorPublicacao("");
        setDataPublicacao("");
    };

    const removerPublicacao = (id: number) => {
        setPublicacao(publicacao.filter((l) => l.id !== id));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Painel Administrativo
            </h1>

            <p className="mt-4 text-gray-600 dark:text-gray-300">
                Edite o conteúdo da seção Publicações
            </p>

            {/* ================================
               FORM HERO
            ================================= */}
            <div className="mt-8 space-y-4 max-w-xl">
                <input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título da Seção Publicações"
                    className="
                        w-full px-4 py-3 rounded-lg
                        bg-white dark:bg-[#020617]
                        text-gray-900 dark:text-white
                        border border-gray-300 dark:border-white/20
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                        transition
                        "
                />

                <textarea
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                    placeholder="Subtítulo do Seção Publicações"
                    className="
                        w-full px-4 py-3 rounded-lg
                        bg-white dark:bg-[#020617]
                        text-gray-900 dark:text-white
                        border border-gray-300 dark:border-white/20
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                        transition
                        "
                />

                <button
                    onClick={salvar}
                    className="bg-[#D4AF37] px-6 py-3 rounded-lg"
                >
                    Salvar Alterações
                </button>
            </div>

            <h1 className="text-2xl mt-8 font-bold text-gray-900 dark:text-white">
                Gerenciar Categorias
            </h1>

            <p className="mt-4 text-gray-600 dark:text-gray-300">
                Nova categoria
            </p>

            {/* ================================
                FORM
            ================================ */}
            <div className="mt-8 space-y-4 max-w-xl">
                <input
                    value={nmcategoria}
                    onChange={(e) => setNmCategoria(e.target.value)}
                    placeholder="Digite o nome da nova categoria"
                    className="
                        w-full px-4 py-3 rounded-lg
                        bg-white dark:bg-[#020617]
                        text-gray-900 dark:text-white
                        border border-gray-300 dark:border-white/20
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                        transition
                        "
                />

                <button
                    onClick={adicionarCategoria}
                    className="bg-[#D4AF37] px-6 py-3 rounded-lg"
                >
                    Salvar Categoria
                </button>
            </div>

            {/* ================================
                LISTA
            ================================ */}
            <ul className="mt-6 space-y-2">
                {categoria.map((cat) => (
                    <li
                        key={cat.id}
                        className="flex justify-between border p-3 rounded bg-white dark:bg-[#020617] border-gray-200 dark:border-white/10"
                    >
                        <span className="text-gray-900 dark:text-white">
                            {cat.categoria}
                        </span>

                        <button
                            onClick={() => removerCategoria(cat.id)}
                            className="text-red-500"
                        >
                            Remover
                        </button>
                    </li>
                ))}
            </ul>

            <h1 className="text-2xl mt-8 font-bold text-gray-900 dark:text-white">
                Gerenciar Publicações
            </h1>

            <p className="mt-4 text-gray-600 dark:text-gray-300">
                Nova Publicação
            </p>

            {/* ================================
                FORM
            ================================ */}
            <div className="mt-8 space-y-4 max-w-xl">
                <select
                    value={categoriaSelecionada}
                    onChange={(e) => setCategoriaSelecionada(e.target.value)}
                    className="
                        w-full px-4 py-3 rounded-lg
                        bg-white dark:bg-[#020617]
                        text-gray-900 dark:text-white
                        border border-gray-300 dark:border-white/20
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                        transition
                        "
                >
                    <option value="">Selecione a Categoria</option>

                    {categoria.map((cat, index) => (
                        <option key={index} value={cat.categoria}>
                            {cat.categoria}
                        </option>
                    ))}
                </select>

                <input
                    value={tituloPublicacao}
                    onChange={(e) => setTituloPublicacao(e.target.value)}
                    placeholder="Digite o título"
                    className="
                        w-full px-4 py-3 rounded-lg
                        bg-white dark:bg-[#020617]
                        text-gray-900 dark:text-white
                        border border-gray-300 dark:border-white/20
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                        transition
                        "
                />

                <input
                    value={descricaoPublicacao}
                    onChange={(e) => setDescricaoPublicacao(e.target.value)}
                    placeholder="Digite a descrição"
                    className="
                        w-full px-4 py-3 rounded-lg
                        bg-white dark:bg-[#020617]
                        text-gray-900 dark:text-white
                        border border-gray-300 dark:border-white/20
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                        transition
                        "
                />

                <input
                    value={autorPublicacao}
                    onChange={(e) => setAutorPublicacao(e.target.value)}
                    placeholder="Digite o autor"
                    className="
                        w-full px-4 py-3 rounded-lg
                        bg-white dark:bg-[#020617]
                        text-gray-900 dark:text-white
                        border border-gray-300 dark:border-white/20
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                        transition
                        "
                />

                <input
                    type="date"
                    value={dataPublicacao}
                    onChange={(e) => setDataPublicacao(e.target.value)}
                    className="
                        w-full px-4 py-3 rounded-lg
                        bg-white dark:bg-[#020617]
                        text-gray-900 dark:text-white
                        border border-gray-300 dark:border-white/20
                        focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                        transition
                    "
                />

                <button
                    onClick={adicionarPublicacao}
                    className="bg-[#D4AF37] px-6 py-3 rounded-lg"
                >
                    Salvar Publicação
                </button>
            </div>

            <ul className="mt-6 space-y-2">
                {publicacao.map((cat) => (
                    <li
                        key={cat.id}
                        className="flex justify-between border p-3 rounded bg-white dark:bg-[#020617] border-gray-200 dark:border-white/10"
                    >
                        <span className="text-gray-900 dark:text-white">
                            {cat.titulo}
                        </span>

                        <button
                            onClick={() => removerPublicacao(cat.id)}
                            className="text-red-500"
                        >
                            Remover
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
