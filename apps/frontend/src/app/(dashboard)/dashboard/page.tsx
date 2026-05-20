"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

export default function UserDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<"poemas" | "livros">("poemas");

    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

    // ================================
    // ESTADOS: MODAL E FORMULÁRIO
    // ================================
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [poems, setPoems] = useState<any[]>([]);
    const [loadingPoems, setLoadingPoems] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
    const TOKEN_KEY = "guardiana_token";

    // ================================
    // CARREGAR MEUS POEMAS (REAL)
    // ================================
    const loadPoems = async () => {
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) return;

            // Se for admin, busca todas. Se não, busca apenas as próprias.
            const endpoint = isAdmin ? `${API_URL}/poems/admin/all` : `${API_URL}/poems/my-poems`;
            
            const response = await fetch(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Falha ao carregar poemas");

            const data = await response.json();
            
            if (data.success) {
                setPoems(data.poems);
            }
        } catch (error) {
            console.error("Erro ao carregar poemas:", error);
        } finally {
            setLoadingPoems(false);
        }
    };

    useEffect(() => {
        if (user) void loadPoems();
    }, [user]);

    // ================================
    // ADMIN: APROVAR/REJEITAR POESIA
    // ================================
    const handleReview = async (poemId: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            let rejectionReason = "";
            if (status === 'REJECTED') {
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
                body: JSON.stringify({ status, rejectionReason }),
            });

            if (!response.ok) throw new Error("Erro ao revisar poesia.");
            await loadPoems();
        } catch (error) {
            alert("Não foi possível processar a revisão.");
        }
    };

    // ================================
    // ADMIN: DESTACAR POESIA
    // ================================
    const handleToggleHighlight = async (poemId: string) => {
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            const response = await fetch(`${API_URL}/poems/${poemId}/highlight`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Erro ao destacar poesia.");
            
            await loadPoems();
        } catch (error: any) {
            alert(error.message);
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
            
            const response = await fetch(`${API_URL}/poems`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("Erro do servidor (HTML recebido):", errorData);
                throw new Error("O servidor retornou um erro inesperado.");
            }

            const data = await response.json();
            
            setIsModalOpen(false);
            setTitle("");
            setContent("");
            await loadPoems(); // Recarrega a lista real

        } catch (error) {
            alert(error instanceof Error ? error.message : "Erro ao enviar sua poesia para revisão.");
        } finally {
            setSubmitting(false);
        }
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

            {/* ABAS */}
            {isAdmin && (
                <div className="flex gap-4 border-b border-gray-200 dark:border-white/10 mb-8">
                    <button 
                        onClick={() => setActiveTab("poemas")}
                        className={`pb-4 px-2 font-medium transition ${activeTab === "poemas" ? "border-b-2 border-[#C95F52] text-[#C95F52]" : "text-gray-500"}`}
                    >
                        Meus Poemas
                    </button>
                    <button 
                        onClick={() => setActiveTab("livros")}
                        className={`pb-4 px-2 font-medium transition ${activeTab === "livros" ? "border-b-2 border-[#C95F52] text-[#C95F52]" : "text-gray-500"}`}
                    >
                        Minha Biblioteca (E-books)
                    </button>
                </div>
            )}

            {activeTab === "poemas" || !isAdmin ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Card de Novo Poema */}
                    {!isAdmin && (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="h-64 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#C95F52] hover:bg-gray-50 dark:hover:bg-white/5 transition group"
                        >
                            <span className="text-4xl text-gray-300 group-hover:text-[#C95F52]">+</span>
                            <span className="font-semibold text-gray-500 group-hover:text-[#C95F52]">Escrever Poesia</span>
                        </button>
                    )}

                    {/* LISTA REAL DE POEMAS */}
                    {loadingPoems ? (
                        <div className="col-span-full py-10 text-center text-gray-400">Carregando suas obras...</div>
                    ) : (
                        poems.map((poem) => (
                            <div key={poem.id} className="p-6 bg-white dark:bg-[#0F1720] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                                            poem.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            poem.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                            poem.status === 'HIGHLIGHTED' ? 'bg-purple-100 text-purple-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {poem.status === 'PENDING' ? 'Em Revisão' : 
                                             poem.status === 'APPROVED' ? 'Aprovado' : 
                                             poem.status === 'REJECTED' ? 'Recusado' : 'Em Destaque'}
                                        </span>
                                    </div>
                                    {isAdmin && (
                                        <p className="text-[10px] text-[#C95F52] font-bold mb-1 uppercase">
                                            Autor(a): {poem.user?.name || 'Desconhecido'}
                                        </p>
                                    )}
                                    <h3 className="text-lg font-bold text-[#18384A] dark:text-white mb-2 leading-tight">{poem.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 line-clamp-4 text-sm italic">
                                        "{poem.content}"
                                    </p>
                                </div>

                                {isAdmin && (
                                    <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-gray-50 dark:border-white/5">
                                        {poem.status === 'PENDING' && (
                                            <>
                                                <button onClick={() => handleReview(poem.id, 'APPROVED')} className="px-3 py-1.5 bg-green-600 text-white text-[10px] font-bold rounded-lg hover:bg-green-700 transition">Aprovar</button>
                                                <button onClick={() => handleReview(poem.id, 'REJECTED')} className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 transition">Rejeitar</button>
                                            </>
                                        )}
                                        {(poem.status === 'APPROVED' || poem.status === 'HIGHLIGHTED') && (
                                            <button 
                                                onClick={() => handleToggleHighlight(poem.id)}
                                                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition ${poem.isHighlighted ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                            >
                                                {poem.isHighlighted ? '★ Destacado' : '☆ Destacar'}
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 text-[10px] text-gray-400">
                                    Enviado em {new Date(poem.createdAt).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                    <div className="text-5xl mb-4">📚</div>
                    <h2 className="text-xl font-bold text-[#18384A] dark:text-white">Sua estante está vazia</h2>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                        Em breve você poderá adquirir e-books da Guardiana e acessá-los diretamente por aqui.
                    </p>
                    <button className="mt-6 px-6 py-2 bg-[#18384A] text-white rounded-full font-bold hover:opacity-90 transition">
                        Ver catálogo de livros
                    </button>
                </div>
            )}

            {/* ================================
                MODAL: NOVA POESIA
            ================================ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-[#0F1720] w-full max-w-2xl rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#18384A] dark:text-white">Nova Poesia</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
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
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-[#C95F52] text-white py-3.5 rounded-xl font-bold hover:bg-[#A84A3F] transition shadow-lg shadow-[#C95F52]/20 disabled:opacity-50"
                                >
                                    {submitting ? "Publicando..." : "Enviar para Guardiana"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}