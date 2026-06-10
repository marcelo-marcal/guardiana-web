"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth, getAuthToken } from "@/hooks/useAuth";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3333";

type CouncilMember = {
    id: string;
    name: string;
    country: string;
    imageUrl: string | null;
    order: number;
};

export default function ConselhoDashboard() {
    const [members, setMembers] = useState<CouncilMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<CouncilMember | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [order, setOrder] = useState(0);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const loadMembers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/council`);
            const data = await response.json();
            if (data.success) {
                setMembers(data.members);
            }
        } catch {
            console.error("Erro ao carregar membros do conselho");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadMembers();
    }, [loadMembers]);

    const handleOpenModal = (member: CouncilMember | null = null) => {
        if (member) {
            setEditingMember(member);
            setName(member.name);
            setCountry(member.country);
            setOrder(member.order);
            setAvatarPreview(member.imageUrl);
        } else {
            setEditingMember(null);
            setName("");
            setCountry("");
            setOrder(members.length);
            setAvatarPreview(null);
        }
        setAvatarFile(null);
        setIsModalOpen(true);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = getAuthToken();
            let imageUrl = avatarPreview;

            if (avatarFile) {
                const formData = new FormData();
                formData.append("image", avatarFile);
                const uploadRes = await fetch(`${API_URL}/uploads/images`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
                const uploadData = await uploadRes.json();
                if (uploadRes.ok && uploadData.file?.url) {
                    imageUrl = uploadData.file.url;
                }
            }

            const method = editingMember ? "PUT" : "POST";
            const endpoint = editingMember
                ? `${API_URL}/council/${editingMember.id}`
                : `${API_URL}/council`;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, country, order, imageUrl }),
            });

            if (response.ok) {
                setIsModalOpen(false);
                void loadMembers();
            }
        } catch {
            alert("Erro ao salvar.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir membro do conselho?")) return;
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/council/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) void loadMembers();
        } catch {
            alert("Erro ao deletar.");
        }
    };

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-[#18384A] dark:text-white">Gerenciar Conselho Editorial</h1>
                    <p className="text-gray-500">Adicione, edite ou remova membros do conselho editorial.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#C95F52] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#A84A3F] transition shadow-lg shadow-[#C95F52]/20"
                >
                    + Novo Membro
                </button>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                    <p>Carregando...</p>
                ) : members.length === 0 ? (
                    <p className="col-span-full text-center py-10 text-gray-400">Nenhum membro cadastrado.</p>
                ) : members.map((m) => (
                    <div key={m.id} className="bg-white dark:bg-[#0F1720] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition">
                        <div className="relative h-48 w-full bg-gray-100 dark:bg-white/5">
                            {m.imageUrl && (
                                <Image src={m.imageUrl} alt={m.name} fill className="object-cover" />
                            )}
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-[#18384A] dark:text-white">{m.name}</h3>
                            <p className="text-[#C95F52] font-bold text-xs uppercase mb-4">{m.country}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(m)}
                                    className="flex-1 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white rounded-lg font-bold text-xs hover:bg-gray-200 transition"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(m.id)}
                                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-xs hover:bg-red-100 transition"
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#0F1720] w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#18384A] dark:text-white">
                                {editingMember ? "Editar Membro" : "Novo Membro"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex justify-center mb-6">
                                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-white/10">
                                    {avatarPreview ? (
                                        <Image src={avatarPreview} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">Sem foto</div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Nome</label>
                                <input required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">País</label>
                                <input required value={country} onChange={e => setCountry(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Ordem de Exibição</label>
                                <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white" />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-gray-500">Cancelar</button>
                                <button type="submit" disabled={submitting} className="flex-1 bg-[#C95F52] text-white py-3 rounded-xl font-bold disabled:opacity-50">
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
