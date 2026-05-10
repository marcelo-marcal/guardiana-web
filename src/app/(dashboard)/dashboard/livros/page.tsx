"use client";

// ================================
// IMPORTS
// ================================
import Image from "next/image";
import { useEffect, useState } from "react";
import { getLivros, setLivros, type Livro } from "@/services/livros.service";

// ================================
// FORMULÁRIO INICIAL
// ================================
const livroVazio = {
    titulo: "",
    autor: "",
    imagem: "",
    descricao: "",
    ano: "",
    isbn: "",
    paginas: "",
    preco: "",
    dimensoes: "",
    idioma: "Português",
};

// ================================
// CRUD LIVROS
// ================================
export default function LivrosAdmin() {
    // ================================
    // ESTADO: LISTA DE LIVROS
    // ================================
    const [livros, setLivrosState] = useState<Livro[]>([]);

    // ================================
    // ESTADO: FORMULÁRIO
    // ================================
    const [form, setForm] = useState(livroVazio);

    // ================================
    // CARREGAR DO "BANCO" (localStorage)
    // ================================
    useEffect(() => {
        setLivrosState(getLivros());
    }, []);

    // ================================
    // SALVAR LISTA NO SERVICE
    // ================================
    const salvarLivros = (novaLista: Livro[]) => {
        setLivrosState(novaLista);
        setLivros(novaLista);
    };

    // ================================
    // ATUALIZAR CAMPOS DO FORMULÁRIO
    // ================================
    const atualizarCampo = (campo: keyof typeof livroVazio, valor: string) => {
        setForm((atual) => ({
            ...atual,
            [campo]: valor,
        }));
    };

    // ================================
    // CONVERTER IMAGEM PARA BASE64
    // Observação:
    // - Isso é mock/localStorage.
    // - Futuramente será upload real em storage/API.
    // ================================
    const carregarImagem = (arquivo: File) => {
        const leitor = new FileReader();

        leitor.onload = () => {
            if (typeof leitor.result === "string") {
                atualizarCampo("imagem", leitor.result);
            }
        };

        leitor.readAsDataURL(arquivo);
    };

    // ================================
    // ADICIONAR LIVRO
    // ================================
    const adicionarLivro = () => {
        if (!form.titulo || !form.autor || !form.imagem || !form.descricao) {
            alert("Preencha pelo menos título, autor, imagem e descrição.");
            return;
        }

        const novoLivro: Livro = {
            id: Date.now(),
            titulo: form.titulo,
            autor: form.autor,
            imagem: form.imagem,
            descricao: form.descricao,
            ano: form.ano,
            isbn: form.isbn,
            paginas: form.paginas,
            preco: form.preco,
            dimensoes: form.dimensoes,
            idioma: form.idioma,
            destaqueHome: false,
        };

        salvarLivros([...livros, novoLivro]);
        setForm(livroVazio);
    };

    // ================================
    // REMOVER LIVRO
    // ================================
    const removerLivro = (id: number) => {
        const confirmar = confirm("Deseja remover este livro?");

        if (!confirmar) return;

        salvarLivros(livros.filter((livro) => livro.id !== id));
    };

    // ================================
    // ALTERAR DESTAQUE DA HOME
    // Regra:
    // - A Home pode mostrar no máximo 3 livros
    // ================================
    const alternarDestaque = (id: number) => {
        const livroClicado = livros.find((livro) => livro.id === id);

        if (!livroClicado) return;

        const jaEstaEmDestaque = livroClicado.destaqueHome;
        const totalDestaques = livros.filter(
            (livro) => livro.destaqueHome,
        ).length;

        if (!jaEstaEmDestaque && totalDestaques >= 3) {
            alert("A Home pode ter no máximo 3 livros em destaque.");
            return;
        }

        const novaLista = livros.map((livro) =>
            livro.id === id
                ? {
                      ...livro,
                      destaqueHome: !livro.destaqueHome,
                  }
                : livro,
        );

        salvarLivros(novaLista);
    };

    return (
        <div>
            {/* ================================
                CABEÇALHO
            ================================ */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gerenciar Livros
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-300">
                Cadastre livros, envie a capa e escolha até 3 obras para
                aparecerem em destaque na Home.
            </p>

            {/* ================================
                FORMULÁRIO DE CADASTRO
            ================================ */}
            <div className="mt-8 max-w-3xl rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#020617] p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Novo livro
                </h2>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                    {/* TÍTULO */}
                    <input
                        placeholder="Título"
                        value={form.titulo}
                        onChange={(e) =>
                            atualizarCampo("titulo", e.target.value)
                        }
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    {/* AUTOR */}
                    <input
                        placeholder="Autor"
                        value={form.autor}
                        onChange={(e) =>
                            atualizarCampo("autor", e.target.value)
                        }
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    {/* ANO */}
                    <input
                        placeholder="Ano"
                        value={form.ano}
                        onChange={(e) => atualizarCampo("ano", e.target.value)}
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    {/* ISBN */}
                    <input
                        placeholder="ISBN"
                        value={form.isbn}
                        onChange={(e) => atualizarCampo("isbn", e.target.value)}
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    {/* PÁGINAS */}
                    <input
                        placeholder="Páginas"
                        value={form.paginas}
                        onChange={(e) =>
                            atualizarCampo("paginas", e.target.value)
                        }
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    {/* PREÇO */}
                    <input
                        placeholder="Preço"
                        value={form.preco}
                        onChange={(e) =>
                            atualizarCampo("preco", e.target.value)
                        }
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    {/* DIMENSÕES */}
                    <input
                        placeholder="Dimensões"
                        value={form.dimensoes}
                        onChange={(e) =>
                            atualizarCampo("dimensoes", e.target.value)
                        }
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    {/* IDIOMA */}
                    <input
                        placeholder="Idioma"
                        value={form.idioma}
                        onChange={(e) =>
                            atualizarCampo("idioma", e.target.value)
                        }
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />
                </div>

                {/* DESCRIÇÃO */}
                <textarea
                    placeholder="Descrição / comentário do livro"
                    value={form.descricao}
                    onChange={(e) =>
                        atualizarCampo("descricao", e.target.value)
                    }
                    rows={6}
                    className="mt-4 w-full px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                />

                {/* UPLOAD DA CAPA */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Capa do livro
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const arquivo = e.target.files?.[0];

                            if (arquivo) {
                                carregarImagem(arquivo);
                            }
                        }}
                        className="mt-2 block w-full text-sm text-gray-700 dark:text-gray-300"
                    />
                </div>

                {/* PREVIEW DA IMAGEM */}
                {form.imagem && (
                    <div className="mt-4 relative w-36 h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                        <Image
                            src={form.imagem}
                            alt="Prévia da capa"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                {/* BOTÃO ADICIONAR */}
                <button
                    type="button"
                    onClick={adicionarLivro}
                    className="mt-6 bg-[#D4AF37] px-6 py-3 rounded-lg text-black font-semibold hover:opacity-90 transition"
                >
                    Adicionar Livro
                </button>
            </div>

            {/* ================================
                LISTA DE LIVROS
            ================================ */}
            <div className="mt-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Livros cadastrados
                </h2>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Destaques selecionados:{" "}
                    {livros.filter((livro) => livro.destaqueHome).length}/3
                </p>

                <ul className="mt-6 space-y-4">
                    {livros.map((livro) => (
                        <li
                            key={livro.id}
                            className="flex flex-col md:flex-row md:items-center gap-4 justify-between border p-4 rounded-xl bg-white dark:bg-[#020617] border-gray-200 dark:border-white/10"
                        >
                            {/* INFORMAÇÕES */}
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-24 rounded-md overflow-hidden bg-gray-100">
                                    <Image
                                        src={livro.imagem}
                                        alt={livro.titulo}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                        {livro.titulo}
                                    </h3>

                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {livro.autor}
                                    </p>

                                    {livro.destaqueHome && (
                                        <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-[#D4AF37] text-black">
                                            Destaque na Home
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* AÇÕES */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => alternarDestaque(livro.id)}
                                    className="px-4 py-2 rounded-lg border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition"
                                >
                                    {livro.destaqueHome
                                        ? "Remover destaque"
                                        : "Marcar destaque"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => removerLivro(livro.id)}
                                    className="px-4 py-2 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                >
                                    Remover
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
