"use client";

// ================================
// IMPORTS
// ================================
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

// ================================
// CONFIGURAÇÕES
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
const TOKEN_KEY = "guardiana_token";

// ================================
// TIPAGENS
// ================================
type PoemStatus = "PENDING" | "APPROVED" | "REJECTED" | "HIGHLIGHTED";

type Poem = {
    id: string;
    title: string;
    content: string;
    status: PoemStatus;
    isHighlighted: boolean;
    createdAt: string;
};

type PoemsResponse = {
    success: boolean;
    poems?: Poem[];
    message?: string;
};

type UpdateProfileDTO = {
    name?: string;
    email?: string;
    password?: string;
    avatarUrl?: string;
};

// ================================
// HELPER: ERRO
// ================================
function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

// ================================
// PERFIL PAGE
// ================================
export default function PerfilPage() {
    const { user, fetchUser } = useAuth();

    const [poems, setPoems] = useState<Poem[]>([]);
    const [loadingPoems, setLoadingPoems] = useState(true);

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
    const [submitting, setSubmitting] = useState(false);
    
    const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const showToast = (text: string, type: 'success' | 'error' = 'success') => {
        setToastMessage({ text, type });
        setTimeout(() => setToastMessage(null), 3000);
    };

    const loadPoems = useCallback(async () => {
        if (user?.role !== 'USER') {
            setLoadingPoems(false);
            return;
        }
        try {
            setLoadingPoems(true);
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) return;

            const response = await fetch(`${API_URL}/poems/my-poems`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Falha ao carregar poemas.");

            const data = (await response.json()) as PoemsResponse;
            if (data.success && data.poems) {
                setPoems(data.poems);
            }
        } catch (error) {
            console.error("Erro ao carregar poemas:", error);
        } finally {
            setLoadingPoems(false);
        }
    }, [user?.role]);

    useEffect(() => {
        if (user) {
            void loadPoems();
            setName(user.name || "");
            setEmail(user.email || "");
            setAvatarPreview(user.avatarUrl || null);
        }
    }, [user, loadPoems]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) throw new Error("Usuário não autenticado.");

            let avatarUrl = user?.avatarUrl;

            if (avatarFile) {
                const formData = new FormData();
                formData.append("image", avatarFile);

                const uploadResponse = await fetch(`${API_URL}/uploads/images`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });

                const uploadData = await uploadResponse.json();
                if (!uploadResponse.ok || !uploadData.file?.url) {
                    throw new Error(uploadData.message || "Erro ao fazer upload da imagem.");
                }
                avatarUrl = uploadData.file.url;
            }

            const updateData: UpdateProfileDTO = { name, email };
            if (password) {
                updateData.password = password;
            }
            if (avatarUrl) {
                updateData.avatarUrl = avatarUrl;
            }

            const response = await fetch(`${API_URL}/users/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao atualizar perfil.");
            }

            await fetchUser();
            window.dispatchEvent(new Event("auth:updated"));
            setPassword("");
            setAvatarFile(null);
            
            showToast("Perfil atualizado com sucesso!");

        } catch (error) {
            showToast(getErrorMessage(error, "Não foi possível atualizar o perfil."), 'error');
        } finally {
            setSubmitting(false);
        }
    };

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
                body: JSON.stringify({
                    title,
                    content,
                }),
            });

            if (!response.ok) {
                const serverError = await response.text();

                console.error("Erro do servidor:", serverError);

                throw new Error("O servidor retornou um erro inesperado.");
            }

            setIsModalOpen(false);
            setTitle("");
            setContent("");

            await loadPoems();
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Erro ao enviar sua poesia para revisão.",
            );

            showToast(message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 relative">
            {toastMessage && (
                <div 
                    className={`fixed bottom-10 right-10 z-50 animate-fade-in px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 opacity-100 ${
                        toastMessage.type === 'success' ? 'bg-[#16B83E] text-white' : 'bg-red-500 text-white'
                    }`}
                >
                    {toastMessage.type === 'success' ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    <span className="font-medium text-sm">{toastMessage.text}</span>
                </div>
            )}

            <header className="mb-10">
                <h1 className="text-3xl font-bold text-[#18384A] dark:text-white">
                    Meu Perfil
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Gerencie suas informações e suas publicações.
                </p>
            </header>

            <div className={`grid grid-cols-1 ${user?.role === 'USER' ? 'lg:grid-cols-3' : ''} gap-10`}>
                <div className={`${user?.role === 'USER' ? 'lg:col-span-1' : 'max-w-md mx-auto w-full'}`}>
                    <form onSubmit={handleUpdateProfile} className="p-6 bg-white dark:bg-[#0F1720] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6">
                        <h2 className="text-xl font-bold text-[#18384A] dark:text-white">Informações Pessoais</h2>
                        
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-24 h-24">
                                {avatarPreview ? (
                                    <Image src={avatarPreview} alt="Avatar" layout="fill" className="rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-700 dark:text-gray-300">
                                        {name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <label className="cursor-pointer text-sm font-medium text-[#C95F52] hover:underline">
                                Trocar foto
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white outline-none focus:ring-2 focus:ring-[#C95F52] transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white outline-none focus:ring-2 focus:ring-[#C95F52] transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nova Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Deixe em branco para não alterar"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white outline-none focus:ring-2 focus:ring-[#C95F52] transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[#C95F52] text-white py-3.5 rounded-xl font-bold hover:bg-[#A84A3F] transition shadow-lg shadow-[#C95F52]/20 disabled:opacity-50"
                        >
                            {submitting ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </form>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-[#0F1720] w-full max-w-2xl rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#18384A] dark:text-white">Nova Poesia</h2>
                            <button
                                type="button"
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