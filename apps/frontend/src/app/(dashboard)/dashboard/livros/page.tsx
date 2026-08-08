"use client";

// ================================
// IMPORTS
// ================================
import { useEffect, useState } from "react";
import { getLivros, type Livro } from "../../../../services/livros.service";
import { getAuthToken } from "@/hooks/useAuth";

// ================================
// CONFIGURAÇÃO DA API
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3333";

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
// TIPO DA RESPOSTA DE UPLOAD
// ================================
type UploadResponse = {
    success: boolean;
    file: {
        url: string;
    };
};

// ================================
// CRUD LIVROS
// ================================
export default function LivrosAdmin() {
    const [livros, setLivrosState] = useState<Livro[]>([]);
    const [form, setForm] = useState(livroVazio);

    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const [livroEditandoId, setLivroEditandoId] = useState<string | null>(null);
    const estaEditando = livroEditandoId !== null;

    const carregarLivros = async () => {
        try {
            setLoading(true);
            setErro("");

            const data = await getLivros();

            setLivrosState(data);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao carregar livros.";

            setErro(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void carregarLivros();
    }, []);

    const atualizarCampo = (campo: keyof typeof livroVazio, valor: string) => {
        setForm((atual) => ({
            ...atual,
            [campo]: valor,
        }));
    };

    const carregarImagem = async (arquivo: File) => {
        try {
            const token = getAuthToken();

            if (!token) {
                alert("Faça login novamente para enviar imagens.");
                return;
            }

            const formData = new FormData();
            formData.append("image", arquivo);

            const response = await fetch(`${API_URL}/uploads/images`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = (await response.json()) as UploadResponse;

            if (!response.ok || !data.success) {
                throw new Error("Erro ao enviar imagem.");
            }

            atualizarCampo("imagem", data.file.url);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao enviar imagem.";

            alert(message);
        }
    };

    const montarPayloadLivro = (isHomeFeature?: boolean) => ({
        title: form.titulo,
        author: form.autor,
        description: form.descricao,
        coverUrl: form.imagem,
        year: form.ano,
        isbn: form.isbn,
        pages: form.paginas,
        price: form.preco ? Number(form.preco) : null,
        dimensions: form.dimensoes,
        language: form.idioma,
        format: "PHYSICAL",
        physicalStock: 0,
        ...(typeof isHomeFeature === "boolean" ? { isHomeFeature } : {}),
    });

    const salvarLivro = async () => {
        try {
            if (
                !form.titulo ||
                !form.autor ||
                !form.imagem ||
                !form.descricao
            ) {
                alert("Preencha pelo menos título, autor, imagem e descrição.");
                return;
            }

            const token = getAuthToken();

            if (!token) {
                alert("Faça login novamente para salvar livros.");
                return;
            }

            setSalvando(true);

            const livroAtual = livros.find(
                (livro) => livro.id === livroEditandoId,
            );

            const response = await fetch(
                estaEditando
                    ? `${API_URL}/books/${livroEditandoId}`
                    : `${API_URL}/books`,
                {
                    method: estaEditando ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(
                        montarPayloadLivro(livroAtual?.destaqueHome ?? false),
                    ),
                },
            );

            const data = (await response.json()) as {
                success: boolean;
                message?: string;
            };

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                        (estaEditando
                            ? "Erro ao editar livro."
                            : "Erro ao cadastrar livro."),
                );
            }

            setForm(livroVazio);
            setLivroEditandoId(null);
            await carregarLivros();
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Erro ao salvar livro.";

            alert(message);
        } finally {
            setSalvando(false);
        }
    };

    const iniciarEdicao = (livro: Livro) => {
        setLivroEditandoId(livro.id);
        setForm({
            titulo: livro.titulo,
            autor: livro.autor,
            imagem: livro.imagem,
            descricao: livro.descricao,
            ano: livro.ano,
            isbn: livro.isbn,
            paginas: livro.paginas,
            preco: livro.preco,
            dimensoes: livro.dimensoes,
            idioma: livro.idioma || "Português",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const cancelarEdicao = () => {
        setLivroEditandoId(null);
        setForm(livroVazio);
    };

    const removerLivro = async (id: string) => {
        try {
            const confirmar = confirm("Deseja remover este livro?");

            if (!confirmar) return;

            const token = getAuthToken();

            if (!token) {
                alert("Faça login novamente para remover livros.");
                return;
            }

            const response = await fetch(`${API_URL}/books/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = (await response.json()) as {
                success: boolean;
                message?: string;
            };

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Erro ao remover livro.");
            }

            if (livroEditandoId === id) {
                cancelarEdicao();
            }

            await carregarLivros();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao remover livro.";

            alert(message);
        }
    };

    const alternarDestaque = async (livro: Livro) => {
        try {
            const token = getAuthToken();

            if (!token) {
                alert("Faça login novamente para alterar destaques.");
                return;
            }

            const response = await fetch(`${API_URL}/books/${livro.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    isHomeFeature: !livro.destaqueHome,
                }),
            });

            const data = (await response.json()) as {
                success: boolean;
                message?: string;
            };

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Erro ao alterar destaque.");
            }

            await carregarLivros();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao alterar destaque.";

            alert(message);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gerenciar Livros
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-300">
                Cadastre livros, envie a capa e escolha até 3 obras para
                aparecerem em destaque na Home.
            </p>

            {erro && (
                <div className="mt-6 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 p-4 text-red-600 dark:text-red-400">
                    {erro}
                </div>
            )}

            <div className="mt-8 max-w-3xl rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#020617] p-6 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {estaEditando ? "Editar livro" : "Novo livro"}
                    </h2>

                    {estaEditando && (
                        <button
                            type="button"
                            onClick={cancelarEdicao}
                            className="text-sm font-semibold text-gray-500 hover:text-[#C95F52] transition"
                        >
                            Cancelar edição
                        </button>
                    )}
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <input
                        placeholder="Título"
                        value={form.titulo}
                        onChange={(e) =>
                            atualizarCampo("titulo", e.target.value)
                        }
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    <input
                        placeholder="Autor"
                        value={form.autor}
                        onChange={(e) =>
                            atualizarCampo("autor", e.target.value)
                        }
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    <input
                        placeholder="Ano"
                        value={form.ano}
                        onChange={(e) => atualizarCampo("ano", e.target.value)}
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    <input
                        placeholder="ISBN"
                        value={form.isbn}
                        onChange={(e) => atualizarCampo("isbn", e.target.value)}
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    <input
                        placeholder="Páginas"
                        value={form.paginas}
                        onChange={(e) =>
                            atualizarCampo("paginas", e.target.value)
                        }
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    <input
                        placeholder="Preço"
                        value={form.preco}
                        onChange={(e) =>
                            atualizarCampo("preco", e.target.value)
                        }
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    <input
                        placeholder="Dimensões"
                        value={form.dimensoes}
                        onChange={(e) =>
                            atualizarCampo("dimensoes", e.target.value)
                        }
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />

                    <input
                        placeholder="Idioma"
                        value={form.idioma}
                        onChange={(e) =>
                            atualizarCampo("idioma", e.target.value)
                        }
                        className="px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                    />
                </div>

                <textarea
                    placeholder="Descrição / comentário do livro"
                    value={form.descricao}
                    onChange={(e) =>
                        atualizarCampo("descricao", e.target.value)
                    }
                    rows={6}
                    className="mt-4 w-full px-4 py-3 border rounded-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-white border-gray-300 dark:border-white/20"
                />

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Capa do livro
                    </label>

                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => {
                            const arquivo = e.target.files?.[0];

                            if (arquivo) {
                                void carregarImagem(arquivo);
                            }
                        }}
                        className="mt-2 block w-full text-sm text-gray-700 dark:text-gray-300"
                    />
                </div>

                {form.imagem && (
                    <div className="mt-4 relative w-36 h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                        <img
                            src={
                                form.imagem.startsWith("/uploads")
                                    ? `${API_URL}${form.imagem}`
                                    : form.imagem
                            }
                            alt="Prévia da capa"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => void salvarLivro()}
                        disabled={salvando}
                        className="bg-[#D4AF37] px-6 py-3 rounded-lg text-black font-semibold hover:opacity-90 transition disabled:opacity-60"
                    >
                        {salvando
                            ? "Salvando..."
                            : estaEditando
                              ? "Salvar Alterações"
                              : "Adicionar Livro"}
                    </button>

                    {estaEditando && (
                        <button
                            type="button"
                            onClick={cancelarEdicao}
                            disabled={salvando}
                            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition disabled:opacity-60"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Livros cadastrados
                </h2>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Destaques selecionados:{" "}
                    {livros.filter((livro) => livro.destaqueHome).length}/3
                </p>

                {loading ? (
                    <p className="mt-6 text-gray-600 dark:text-gray-300">
                        Carregando livros...
                    </p>
                ) : (
                    <ul className="mt-6 space-y-4">
                        {livros.map((livro) => (
                            <li
                                key={livro.id}
                                className="flex flex-col md:flex-row md:items-center gap-4 justify-between border p-4 rounded-xl bg-white dark:bg-[#020617] border-gray-200 dark:border-white/10"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-24 rounded-md overflow-hidden bg-gray-100">
                                        <img
                                            src={livro.imagem}
                                            alt={livro.titulo}
                                            className="w-full h-full object-cover"
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

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => iniciarEdicao(livro)}
                                        className="px-4 py-2 rounded-lg border border-[#18384A] text-[#18384A] dark:text-white dark:border-white/30 hover:bg-[#18384A] hover:text-white transition"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            void alternarDestaque(livro)
                                        }
                                        className="px-4 py-2 rounded-lg border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition"
                                    >
                                        {livro.destaqueHome
                                            ? "Remover destaque"
                                            : "Marcar destaque"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            void removerLivro(livro.id)
                                        }
                                        className="px-4 py-2 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}