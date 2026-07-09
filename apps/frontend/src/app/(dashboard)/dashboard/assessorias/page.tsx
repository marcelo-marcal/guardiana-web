"use client";

import { useCallback, useEffect, useState } from "react";
import { getAuthToken } from "@/hooks/useAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3333";

type Advisory = {
    id: string;
    title: string;
    description: string;
    items: string[];
    isActive: boolean;
    order: number;
};

export default function AssessoriasDashboard() {
    const [advisories, setAdvisories] = useState<Advisory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdvisory, setEditingAdvisory] = useState<Advisory | null>(null);

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [items, setItems] = useState<string[]>([]);
    const [newItem, setNewItem] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [order, setOrder] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const loadAdvisories = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/advisories`);
            const data = await response.json();
            if (data.success) {
                setAdvisories(data.advisories);
            }
        } catch {
            console.error("Erro ao carregar assessorias");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadAdvisories();
    }, [loadAdvisories]);

    const handleOpenModal = (advisory: Advisory | null = null) => {
        if (advisory) {
            setEditingAdvisory(advisory);
            setTitle(advisory.title);
            setDescription(advisory.description);
            setItems(advisory.items || []);
            setIsActive(advisory.isActive);
            setOrder(advisory.order);
        } else {
            setEditingAdvisory(null);
            setTitle("");
            setDescription("");
            setItems([]);
            setIsActive(true);
            setOrder(advisories.length);
        }
        setNewItem("");
        setIsModalOpen(true);
    };

    const handleAddItem = () => {
        if (newItem.trim()) {
            setItems([...items, newItem.trim()]);
            setNewItem("");
        }
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = getAuthToken();

            const method = editingAdvisory ? "PUT" : "POST";
            const endpoint = editingAdvisory
                ? `${API_URL}/advisories/${editingAdvisory.id}`
                : `${API_URL}/advisories`;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, items, isActive, order }),
            });

            if (response.ok) {
                setIsModalOpen(false);
                void loadAdvisories();
            }
        } catch {
            alert("Erro ao salvar.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir assessoria?")) return;
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/advisories/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) void loadAdvisories();
        } catch {
            alert("Erro ao deletar.");
        }
    };

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-[#18384A] dark:text-white">Gerenciar Assessorias</h1>
                    <p className="text-gray-500">Cadastre conteúdos com título, descrição e itens para a página de assessorias.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#C95F52] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#A84A3F] transition shadow-lg shadow-[#C95F52]/20"
                >
                    + Nova Assessoria
                </button>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p>Carregando...</p>
                ) : advisories.length === 0 ? (
                    <p className="col-span-full text-center py-10 text-gray-400">Nenhuma assessoria cadastrada.</p>
                ) : advisories.map((a) => (
                    <div key={a.id} className={`bg-white dark:bg-[#0F1720] rounded-2xl border ${a.isActive ? 'border-gray-100 dark:border-white/10' : 'border-red-200 dark:border-red-900/30 grayscale'} overflow-hidden shadow-sm hover:shadow-md transition p-6 flex flex-col`}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-[#18384A] dark:text-white">{a.title}</h3>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${a.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {a.isActive ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{a.description}</p>

                        <div className="mb-6 flex-1">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Itens:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                                {a.items.slice(0, 3).map((item, i) => (
                                    <li key={i} className="line-clamp-1">{item}</li>
                                ))}
                                {a.items.length > 3 && <li>... e mais {a.items.length - 3}</li>}
                            </ul>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleOpenModal(a)}
                                className="flex-1 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white rounded-lg font-bold text-xs hover:bg-gray-200 transition"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(a.id)}
                                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-xs hover:bg-red-100 transition"
                            >
                                🗑
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#0F1720] w-full max-w-2xl rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-white/10 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#18384A] dark:text-white">
                                {editingAdvisory ? "Editar Assessoria" : "Nova Assessoria"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Título</label>
                                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Descrição</label>
                                <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Itens</label>
                                <div className="flex gap-2 mb-2">
                                    <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Novo item..." className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white" onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddItem())} />
                                    <button type="button" onClick={handleAddItem} className="bg-[#18384A] text-white px-4 py-2 rounded-xl font-bold">+</button>
                                </div>
                                <ul className="space-y-2">
                                    {items.map((item, i) => (
                                        <li key={i} className="flex justify-between items-center bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-lg">
                                            <span className="text-sm dark:text-gray-300">{item}</span>
                                            <button type="button" onClick={() => handleRemoveItem(i)} className="text-red-500 text-xs">Remover</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Ordem</label>
                                    <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020617] dark:text-white" />
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#C95F52] focus:ring-[#C95F52]" />
                                        <span className="text-sm font-medium">Ativo</span>
                                    </label>
                                </div>
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
