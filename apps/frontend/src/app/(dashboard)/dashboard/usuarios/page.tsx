"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth, getAuthToken } from "@/hooks/useAuth";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3333";

type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: string;
    avatarUrl: string | null;
    lastLoginAt: string | null;
    lastActivityAt: string | null;
    createdAt: string;
};

// ================================
// HELPER: FORMATAR TEMPO RELATIVO
// ================================
function formatTimeAgo(dateString: string | null) {
    if (!dateString) return "Nunca";

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Agora mesmo";
    if (diffInSeconds < 3600) return `Há ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Há ${Math.floor(diffInSeconds / 3600)}h`;
    return date.toLocaleDateString("pt-BR");
}

function isOnline(lastActivity: string | null) {
    if (!lastActivity) return false;
    const activityDate = new Date(lastActivity);
    const now = new Date();
    // Considera online se teve atividade nos últimos 3 minutos
    return (now.getTime() - activityDate.getTime()) < 3 * 60 * 1000;
}

export default function UsuariosPage() {
    const { user: currentUser, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>("USER");
    const [submitting, setSubmitting] = useState(false);

    const loadUsers = useCallback(async (isRefresh = false) => {
        console.log("Iniciando carga de usuários...");
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const token = getAuthToken();
            if (!token) {
                console.warn("Nenhum token encontrado ao carregar usuários.");
                return;
            }

            const response = await fetch(`${API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Status da resposta:", response.status);

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log("Dados recebidos da API:", data);

            if (data.success && data.users) {
                console.log("Atualizando estado 'users' com", data.users.length, "itens");
                setUsers(data.users);
            } else {
                console.warn("API retornou sucesso mas sem lista de usuários:", data);
            }
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading) {
            void loadUsers();

            // Atualiza a lista a cada 60 segundos para manter o status online atualizado
            const interval = setInterval(() => {
                void loadUsers(true);
            }, 60000);

            return () => clearInterval(interval);
        }
    }, [loadUsers, authLoading]);

    const handleOpenModal = (user: User | null = null) => {
        if (user) {
            setEditingUser(user);
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
            setPassword("");
        } else {
            setEditingUser(null);
            setName("");
            setEmail("");
            setRole("USER");
            setPassword("");
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = getAuthToken();
            const method = editingUser ? "PUT" : "POST";
            const endpoint = editingUser
                ? `${API_URL}/users/${editingUser.id}`
                : `${API_URL}/users/admin`;

            const body: Record<string, string | UserRole> = { name, email, role };
            if (password) body.password = password;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setIsModalOpen(false);
                void loadUsers();
            } else {
                const data = await response.json();
                alert(data.message || "Erro ao salvar usuário.");
            }
        } catch {
            alert("Erro na requisição.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (user: User) => {
        const result = await Swal.fire({
            title: "Tem certeza?",
            text: `Você está prestes a excluir o usuário ${user.name}. Esta ação não pode ser desfeita!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#C95F52",
            cancelButtonColor: "#526173",
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar",
            background: document.documentElement.classList.contains("dark") ? "#0F1720" : "#fff",
            color: document.documentElement.classList.contains("dark") ? "#fff" : "#18384A",
        });

        if (result.isConfirmed) {
            try {
                setRefreshing(true);
                const token = getAuthToken();
                const response = await fetch(`${API_URL}/users/${user.id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    await loadUsers(true);
                    Swal.fire({
                        title: "Excluído!",
                        text: "O usuário foi removido com sucesso.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                        background: document.documentElement.classList.contains("dark") ? "#0F1720" : "#fff",
                        color: document.documentElement.classList.contains("dark") ? "#fff" : "#18384A",
                    });
                } else {
                    const data = await response.json();
                    Swal.fire({
                        title: "Erro!",
                        text: data.message || "Erro ao excluir usuário.",
                        icon: "error",
                        background: document.documentElement.classList.contains("dark") ? "#0F1720" : "#fff",
                        color: document.documentElement.classList.contains("dark") ? "#fff" : "#18384A",
                    });
                }
            } catch (error) {
                console.error("Erro ao excluir usuário:", error);
                Swal.fire({
                    title: "Erro!",
                    text: "Erro ao excluir usuário.",
                    icon: "error",
                    background: document.documentElement.classList.contains("dark") ? "#0F1720" : "#fff",
                    color: document.documentElement.classList.contains("dark") ? "#fff" : "#18384A",
                });
            } finally {
                setRefreshing(false);
            }
        }
    };

    const toggleAdmin = async (user: User) => {
        const newRole: UserRole = user.role === "USER" ? "ADMIN" : "USER";
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role: newRole }),
            });
            if (response.ok) {
                void loadUsers();
            }
        } catch {
            alert("Erro ao alterar permissão.");
        }
    };

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-[#18384A] dark:text-white">Gerenciamento de Usuários</h1>
                        {refreshing && (
                            <div className="w-5 h-5 border-2 border-[#C95F52] border-t-transparent rounded-full animate-spin" />
                        )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">Liste e gerencie os usuários da plataforma.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#C95F52] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#A84A3F] transition shadow-lg shadow-[#C95F52]/20"
                >
                    + Novo Usuário
                </button>
            </header>

            <div className="bg-white dark:bg-[#0F1720] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-white/5 text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                            <th className="px-6 py-4">Usuário</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Função</th>
                            <th className="px-6 py-4">Último Acesso</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-medium">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-6 h-6 border-2 border-[#C95F52] border-t-transparent rounded-full animate-spin" />
                                        Carregando usuários...
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Nenhum usuário encontrado.</td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#18384A] text-white flex items-center justify-center text-xs font-bold uppercase relative overflow-hidden">
                                                {u.avatarUrl ? (
                                                    <img
                                                        src={u.avatarUrl}
                                                        alt={u.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    u.name.charAt(0)
                                                )}
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                                            u.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700" :
                                            u.role === "ADMIN" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                {formatTimeAgo(u.lastLoginAt)}
                                            </span>
                                            {u.lastActivityAt && (
                                                <span className="text-[10px] text-gray-400">
                                                    Ativo {formatTimeAgo(u.lastActivityAt)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {isOnline(u.lastActivityAt) ? (
                                            <span className="flex items-center gap-1.5 text-xs text-green-600 font-bold animate-pulse">
                                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                                Online
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                                <span className="w-2 h-2 rounded-full bg-gray-300" />
                                                {u.status || "Inativo"}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => toggleAdmin(u)}
                                                className={`p-2 rounded-lg transition ${u.role === "USER" ? "text-blue-600 hover:bg-blue-50" : "text-orange-600 hover:bg-orange-50"}`}
                                                title={u.role === "USER" ? "Tornar Admin" : "Remover Admin"}
                                                disabled={u.id === currentUser?.id || u.role === "SUPER_ADMIN"}
                                            >
                                                {u.role === "USER" ? "↑" : "↓"}
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(u)}
                                                className="p-2 text-gray-400 hover:text-[#C95F52] transition disabled:opacity-30"
                                                title="Editar"
                                                disabled={currentUser?.role === "ADMIN" && u.role === "SUPER_ADMIN"}
                                            >
                                                ✎
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition"
                                                title="Excluir"
                                                disabled={u.id === currentUser?.id || (currentUser?.role === "ADMIN" && u.role === "SUPER_ADMIN") || refreshing}
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-[#0F1720] w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#18384A] dark:text-white">
                                {editingUser ? "Editar Usuário" : "Novo Usuário"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition p-2"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome</label>
                                <input
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white outline-none focus:ring-2 focus:ring-[#C95F52] transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white outline-none focus:ring-2 focus:ring-[#C95F52] transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    {editingUser ? "Nova Senha (opcional)" : "Senha"}
                                </label>
                                <input
                                    required={!editingUser}
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white outline-none focus:ring-2 focus:ring-[#C95F52] transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Função</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as UserRole)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white outline-none focus:ring-2 focus:ring-[#C95F52] transition"
                                >
                                    <option value="USER">Usuário Comum</option>
                                    <option value="ADMIN">Administrador</option>
                                    {currentUser?.role === "SUPER_ADMIN" && (
                                        <option value="SUPER_ADMIN">Super Administrador</option>
                                    )}
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-[#C95F52] text-white py-3 rounded-xl font-bold hover:bg-[#A84A3F] transition shadow-lg shadow-[#C95F52]/20 disabled:opacity-50"
                                >
                                    {submitting ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
