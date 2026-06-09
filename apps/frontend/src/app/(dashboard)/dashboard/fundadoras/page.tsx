"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
const TOKEN_KEY = "guardiana_token";

type Founder = {
    id: string;
    name: string;
    role: string;
    description: string;
    imageUrl: string | null;
    position: string;
    order: number;
};

export default function FundadorasDashboard() {
    const { user } = useAuth();
    const [founders, setFounders] = useState<Founder[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFounder, setEditingFounder] = useState<Founder | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [description, setDescription] = useState("");
    const [position, setPosition] = useState("object-[center_20%]");
    const [order, setOrder] = useState(0);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const loadFounders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/founders`);
            const data = await response.json();
            if (data.success) {
                setFounders(data.founders);
            }
        } catch (error) {
            console.error("Erro ao carregar fundadoras:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadFounders();
    }, [loadFounders]);

    const handleOpenModal = (founder: Founder | null = null) => {
        if (founder) {
            setEditingFounder(founder);
            setName(founder.name);
            setRole(founder.role);
            setDescription(founder.description);
            setPosition(founder.position);
            setOrder(founder.order);
            setAvatarPreview(founder.imageUrl);
        } else {
            setEditingFounder(null);
            setName("");
            setRole("");
            setDescription("");
            setPosition("object-[center_20%]");
            setOrder(founders.length);
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
            const token = localStorage.getItem(TOKEN_KEY);
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

            const method = editingFounder ? "PUT" : "POST";
            const endpoint = editingFounder
                ? `${API_URL}/founders/${editingFounder.id}`
                : `${API_URL}/founders`;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, role, description, position, order, imageUrl }),
            });

            if (response.ok) {
                setIsModalOpen(false);
                void loadFounders();
            }
        } catch (error) {
            alert("Erro ao salvar.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir fundadora?")) return;
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            const response = await fetch(`${API_URL}/founders/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) void loadFounders();
        } catch (error) {
            alert("Erro ao deletar.");
        }
    };

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-[#18384A] dark:text-white">Gerenciar Fundadoras</h1>
                    <p className="text-gray-500">Adicione, edite ou remova as informações das fundadoras.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#C95F52] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#A84A3F] transition shadow-lg shadow-[#C95F52]/20"
                >
                    + Nova Fundadora
                </button>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p>Carregando...</p>
                ) : founders.map((f) => (
                    <div key={f.id} className="bg-white dark:bg-[#0F1720] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition">
                        <div className="relative h-48 w-full bg-gray-100 dark:bg-white/5">
                            {f.imageUrl && (
                                <Image src={f.imageUrl} alt={f.name} fill className={`object-cover ${f.position}`} />
                            )}
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-[#18384A] dark:text-white">{f.name}</h3>
                            <p className="text-[#C95F52] font-bold text-xs uppercase mb-3">{f.role}</p>
                            <p className="text-gray-500 text-sm line-clamp-3 mb-6 italic">"{f.description}"</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(f)}
                                    className="flex-1 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white rounded-lg font-bold text-sm hover:bg-gray-200 transition"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(f.id)}
                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition"
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
                    <div className="bg-white dark:bg-[#0F1720] w-full max-w-2xl rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-white/10 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#18384A] dark:text-white">
                                {editingFounder ? "Editar Fundadora" : "Nova Fundadora"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex justify-center mb-6">
                                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-white/10">
                                    {avatarPreview ? (
                                        <Image src={avatarPreview} alt="Preview" fill className={`object-cover ${position}`} />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">Sem foto</div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nome</label>
                                    <input required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Cargo/Função</label>
                                    <input required value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Descrição / Biografia</label>
                                <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white resize-none" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Posição da Imagem (Tailwind)</label>
                                    <input value={position} onChange={e => setPosition(e.target.value)} placeholder="Ex: object-[center_20%]" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Ordem de Exibição</label>
                                    <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-gray-500">Cancelar</button>
                                <button type="submit" disabled={submitting} className="flex-1 bg-[#C95F52] text-white py-3 rounded-xl font-bold disabled:opacity-50">
                                    {submitting ? "Salvando..." : "Salvar Fundadora"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
