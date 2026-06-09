"use client";

// ================================
// IMPORTS
// ================================
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

// ================================
// CONFIGURAÇÕES
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
const TOKEN_KEY = "guardiana_token";

// ================================
// TIPAGENS
// ================================
type ActiveTab = "poemas" | "livros";

type PoemStatus = "PENDING" | "APPROVED" | "REJECTED" | "HIGHLIGHTED";

type PoemAuthor = {
    name?: string | null;
};

type Poem = {
    id: string;
    title: string;
    content: string;
    status: PoemStatus;
    isHighlighted: boolean;
    createdAt: string;
    user?: PoemAuthor | null;
};

type PoemsResponse = {
    success: boolean;
    poems?: Poem[];
    message?: string;
    error?: string;
};

type ActionResponse = {
    success: boolean;
    message?: string;
    error?: string;
};

// ================================
// HELPER: ERRO
// ================================
function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

// ================================
// DASHBOARD
// ================================
export default function UserDashboard() {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<ActiveTab>("poemas");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPoem, setEditingPoem] = useState<Poem | null>(null);
    const [viewingPoem, setViewingPoem] = useState<Poem | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [poems, setPoems] = useState<Poem[]>([]);
    const [loadingPoems, setLoadingPoems] = useState(true);

    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

    // ================================
    // CARREGAR POEMAS
    // ================================
    const loadPoems = useCallback(async () => {
        try {
            setLoadingPoems(true);

            const token = localStorage.getItem(TOKEN_KEY);

            if (!token) {
                setPoems([]);
                return;
            }

            const endpoint = isAdmin
                ? `${API_URL}/poems/admin/all`
                : `${API_URL}/poems/my-poems`;

            const response = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Falha ao carregar poemas.");
            }

            const data = (await response.json()) as PoemsResponse;

            if (data.success && data.poems) {
                setPoems(data.poems);
            }
        } catch (error) {
            console.error("Erro ao carregar poemas:", error);
        } finally {
            setLoadingPoems(false);
        }
    }, [isAdmin]);

    // ================================
    // CARREGAR AO ABRIR
    // ================================
    useEffect(() => {
        if (user) {
            void loadPoems();
        }
    }, [user, loadPoems]);

    // ================================
    // ADMIN: APROVAR/REJEITAR POESIA
    // ================================
    const handleReview = async (
        poemId: string,
        status: "APPROVED" | "REJECTED",
    ) => {
        try {
            let rejectionReason = "";

            if (status === "REJECTED") {
                rejectionReason = prompt("Motivo da rejeição:") || "";

                if (!rejectionReason) return;
            }

            const token = localStorage.getItem(TOKEN_KEY);

            const response = await fetch(`${API_URL}/poems/${poemId}/review`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status,
                    rejectionReason,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao revisar poesia.");
            }

            await loadPoems();
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Não foi possível processar a revisão.",
            );

            alert(message);
        }
    };

    // ================================
    // ADMIN: DESTACAR POESIA
    // ================================
    const handleToggleHighlight = async (poemId: string) => {
        try {
            const token = localStorage.getItem(TOKEN_KEY);

            const response = await fetch(
                `${API_URL}/poems/${poemId}/highlight`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = (await response.json()) as ActionResponse;

            if (!response.ok) {
                throw new Error(
                    data.error || data.message || "Erro ao destacar poesia.",
                );
            }

            await loadPoems();
        } catch (error) {
            const message = getErrorMessage(error, "Erro ao destacar poesia.");

            alert(message);
        }
    };

    // ================================
    // SALVAR NOVA POESIA
    // ================================
    const handleSavePoem = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const token = localStorage.getItem(TOKEN_KEY);
            const method = editingPoem ? "PUT" : "POST";
            const endpoint = editingPoem
                ? `${API_URL}/poems/${editingPoem.id}`
                : `${API_URL}/poems`;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    content,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || data.error || "Erro ao salvar poesia.");
            }

            setIsModalOpen(false);
            setEditingPoem(null);
            setTitle("");
            setContent("");

            await loadPoems();
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Erro ao enviar sua poesia.",
            );

            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    // ================================
    // EXCLUIR POESIA
    // ================================
    const handleDeletePoem = async (poemId: string) => {
        if (!confirm("Tem certeza que deseja excluir esta poesia?")) return;

        try {
            const token = localStorage.getItem(TOKEN_KEY);

            const response = await fetch(`${API_URL}/poems/${poemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || data.error || "Erro ao excluir poesia.");
            }

            await loadPoems();
        } catch (error) {
            const message = getErrorMessage(error, "Erro ao excluir poesia.");
            alert(message);
        }
    };

    const handleOpenEdit = (poem: Poem) => {
        setEditingPoem(poem);
        setTitle(poem.title);
        setContent(poem.content);
        setIsModalOpen(true);
    };

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#18384A] dark:text-white">
                    Olá, {user?.name || "Escritor(a)"}
                </h1>

                <p className="text-gray-500 dark:text-gray-400">
                    Gerencie suas publicações e sua biblioteca digital.
                </p>
            </header>

            {isAdmin && (
                <div className="flex gap-4 border-b border-gray-200 dark:border-white/10 mb-8">
                    <button
                        type="button"
                        onClick={() => setActiveTab("poemas")}
                        className={`pb-4 px-2 font-medium transition ${
                            activeTab === "poemas"
                                ? "border-b-2 border-[#C95F52] text-[#C95F52]"
                                : "text-gray-500"
                        }`}
                    >
                        Meus Poemas
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("livros")}
                        className={`pb-4 px-2 font-medium transition ${
                            activeTab === "livros"
                                ? "border-b-2 border-[#C95F52] text-[#C95F52]"
                                : "text-gray-500"
                        }`}
                    >
                        Minha Biblioteca (E-books)
                    </button>
                </div>
            )}

            {activeTab === "poemas" || !isAdmin ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {!isAdmin && (
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="h-64 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#C95F52] hover:bg-gray-50 dark:hover:bg-white/5 transition group"
                        >
                            <span className="text-4xl text-gray-300 group-hover:text-[#C95F52]">
                                +
                            </span>

                            <span className="font-semibold text-gray-500 group-hover:text-[#C95F52]">
                                Escrever Poesia
                            </span>
                        </button>
                    )}

                    {loadingPoems ? (
                        <div className="col-span-full py-10 text-center text-gray-400">
                            Carregando suas obras...
                        </div>
                    ) : (
                        poems.map((poem) => (
                            <div
                                key={poem.id}
                                className="p-6 bg-white dark:bg-[#0F1720] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span
                                            className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                                                poem.status === "APPROVED"
                                                    ? "bg-green-100 text-green-700"
                                                    : poem.status === "REJECTED"
                                                      ? "bg-red-100 text-red-700"
                                                      : poem.status ===
                                                          "HIGHLIGHTED"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {poem.status === "PENDING"
                                                ? "Em Revisão"
                                                : poem.status === "APPROVED"
                                                  ? "Aprovado"
                                                  : poem.status === "REJECTED"
                                                    ? "Recusado"
                                                    : "Em Destaque"}
                                        </span>

                                        <div className="flex gap-2">
                                            {!isAdmin && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(poem)}
                                                        className="text-gray-400 hover:text-[#C95F52] transition"
                                                        title="Editar"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeletePoem(poem.id)}
                                                        className="text-gray-400 hover:text-red-600 transition"
                                                        title="Excluir"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setViewingPoem(poem)
                                                }
                                                className="text-gray-400 hover:text-[#C95F52] transition"
                                                title="Visualizar Poema"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.412 8.081 7.42 5 12 5c4.58 0 8.588 3.081 9.964 6.678.077.202.077.421 0 .623-1.376 3.597-5.384 6.678-12 6.678-4.58 0-8.588-3.081-9.964-6.678Z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {isAdmin && (
                                        <p className="text-[10px] text-[#C95F52] font-bold mb-1 uppercase">
                                            Autor(a):{" "}
                                            {poem.user?.name || "Desconhecido"}
                                        </p>
                                    )}

                                    <h3 className="text-lg font-bold text-[#18384A] dark:text-white mb-2 leading-tight">
                                        {poem.title}
                                    </h3>

                                    <p className="text-gray-500 dark:text-gray-400 line-clamp-4 text-sm italic">
                                        &quot;{poem.content}&quot;
                                    </p>
                                </div>


                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 text-[10px] text-gray-400">
                                    Enviado em{" "}
                                    {new Date(
                                        poem.createdAt,
                                    ).toLocaleDateString("pt-BR")}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                    <div className="text-5xl mb-4">📚</div>

                    <h2 className="text-xl font-bold text-[#18384A] dark:text-white">
                        Sua estante está vazia
                    </h2>

                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                        Em breve você poderá adquirir e-books da Guardiana e
                        acessá-los diretamente por aqui.
                    </p>

                    <button
                        type="button"
                        className="mt-6 px-6 py-2 bg-[#18384A] text-white rounded-full font-bold hover:opacity-90 transition"
                    >
                        Ver catálogo de livros
                    </button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-[#0F1720] w-full max-w-2xl rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#18384A] dark:text-white">
                                {editingPoem ? "Editar Poesia" : "Nova Poesia"}
                            </h2>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingPoem(null);
                                    setTitle("");
                                    setContent("");
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition p-2"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSavePoem} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Título da Obra
                                </label>

                                <input
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white outline-none focus:ring-2 focus:ring-[#C95F52] transition"
                                    placeholder="Ex: O Silêncio da Aurora"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Seus Versos
                                </label>

                                <textarea
                                    required
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={10}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white outline-none focus:ring-2 focus:ring-[#C95F52] transition resize-none"
                                    placeholder="Deixe a inspiração fluir..."
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingPoem(null);
                                        setTitle("");
                                        setContent("");
                                    }}
                                    className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-[#C95F52] text-white py-3.5 rounded-xl font-bold hover:bg-[#A84A3F] transition shadow-lg shadow-[#C95F52]/20 disabled:opacity-50"
                                >
                                    {submitting
                                        ? "Salvando..."
                                        : editingPoem ? "Salvar Alterações" : "Enviar para Guardiana"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewingPoem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-[#0F1720] w-full max-w-2xl rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-white/10 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-[#18384A] dark:text-white leading-tight">
                                    {viewingPoem.title}
                                </h2>
                                <p className="text-sm text-[#C95F52] font-bold uppercase mt-1">
                                    Autor(a):{" "}
                                    {viewingPoem.user?.name || "Desconhecido"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setViewingPoem(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition p-2"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-8">
                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap italic text-lg leading-relaxed">
                                &quot;{viewingPoem.content}&quot;
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100 dark:border-white/10">
                            {isAdmin && (
                                <>
                                    {viewingPoem.status === "PENDING" && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    await handleReview(
                                                        viewingPoem.id,
                                                        "APPROVED",
                                                    );
                                                    setViewingPoem(null);
                                                }}
                                                className="flex-1 min-w-[140px] py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
                                            >
                                                Aprovar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    await handleReview(
                                                        viewingPoem.id,
                                                        "REJECTED",
                                                    );
                                                    setViewingPoem(null);
                                                }}
                                                className="flex-1 min-w-[140px] py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
                                            >
                                                Rejeitar
                                            </button>
                                        </>
                                    )}

                                    {(viewingPoem.status === "APPROVED" ||
                                        viewingPoem.status ===
                                            "HIGHLIGHTED") && (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                await handleToggleHighlight(
                                                    viewingPoem.id,
                                                );
                                                setViewingPoem(null);
                                            }}
                                            className={`flex-1 min-w-[140px] py-3 rounded-xl font-bold transition ${
                                                viewingPoem.isHighlighted
                                                    ? "bg-purple-600 text-white hover:bg-purple-700"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            }`}
                                        >
                                            {viewingPoem.isHighlighted
                                                ? "★ Remover Destaque"
                                                : "☆ Destacar"}
                                        </button>
                                    )}
                                </>
                            )}

                            <button
                                type="button"
                                onClick={() => setViewingPoem(null)}
                                className={`px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition ${!isAdmin ? 'w-full' : ''}`}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
