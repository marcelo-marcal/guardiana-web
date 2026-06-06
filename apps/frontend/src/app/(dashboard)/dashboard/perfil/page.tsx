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
    const [password, setPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
    const [submitting, setSubmitting] = useState(false);

    // ================================
    // CARREGAR POEMAS
    // ================================
    const loadPoems = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        if (user) {
            void loadPoems();
            setName(user.name || "");
            setAvatarPreview(user.avatarUrl || null);
        }
    }, [user, loadPoems]);

    // ================================
    // UPLOAD AVATAR
    // ================================
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // ================================
    // ATUALIZAR PERFIL
    // ================================
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) throw new Error("Usuário não autenticado.");

            let avatarUrl = user?.avatarUrl;

            // Upload de avatar se um novo arquivo foi selecionado
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

            const updateData: UpdateProfileDTO = { name };
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

            await fetchUser(); // Recarrega os dados do usuário no hook de autenticação
            setPassword("");
            setAvatarFile(null);
            alert("Perfil atualizado com sucesso!");

        } catch (error) {
            alert(getErrorMessage(error, "Não foi possível atualizar o perfil."));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-[#18384A] dark:text-white">
                    Meu Perfil
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Gerencie suas informações e suas publicações.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* COLUNA DO FORMULÁRIO */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleUpdateProfile} className="p-6 bg-white dark:bg-[#0F1720] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6">
                        <h2 className="text-xl font-bold text-[#18384A] dark:text-white">Informações Pessoais</h2>
                        
                        {/* AVATAR */}
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

                        {/* NOME */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white outline-none focus:ring-2 focus:ring-[#C95F52] transition"
                            />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#0F1720]/50 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>

                        {/* SENHA */}
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

                {/* COLUNA DOS POEMAS */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-[#18384A] dark:text-white mb-6">Meus Poemas</h2>
                    {loadingPoems ? (
                        <div className="text-center py-10 text-gray-400">Carregando seus poemas...</div>
                    ) : poems.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2">
                            {poems.map((poem) => (
                                <div key={poem.id} className="p-6 bg-white dark:bg-[#0F1720] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                                                poem.status === "APPROVED" ? "bg-green-100 text-green-700"
                                                : poem.status === "REJECTED" ? "bg-red-100 text-red-700"
                                                : poem.status === "HIGHLIGHTED" ? "bg-purple-100 text-purple-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                                {poem.status === "PENDING" ? "Em Revisão"
                                                 : poem.status === "APPROVED" ? "Aprovado"
                                                 : poem.status === "REJECTED" ? "Recusado"
                                                 : "Em Destaque"}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[#18384A] dark:text-white mb-2 leading-tight">{poem.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 line-clamp-4 text-sm italic">
                                            &quot;{poem.content}&quot;
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 text-[10px] text-gray-400">
                                        Enviado em {new Date(poem.createdAt).toLocaleDateString("pt-BR")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                            <div className="text-5xl mb-4">✍️</div>
                            <h2 className="text-xl font-bold text-[#18384A] dark:text-white">Nenhum poema enviado</h2>
                            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                Você ainda não enviou nenhum poema. Que tal começar agora?
                            </p>
                            <button
                                type="button"
                                className="mt-6 px-6 py-2 bg-[#18384A] text-white rounded-full font-bold hover:opacity-90 transition"
                                onClick={() => {
                                    window.location.href = '/dashboard';
                                }}
                            >
                                Escrever Poesia
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}