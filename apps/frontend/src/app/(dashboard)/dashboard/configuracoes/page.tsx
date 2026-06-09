"use client";

// ================================
// IMPORTS
// ================================
import { useCallback, useEffect, useState, useMemo } from "react";

// ================================
// CONFIGURAÇÕES
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
const TOKEN_KEY = "guardiana_token";

// ================================
// TIPAGENS
// ================================
type SocialLink = {
    nome: string;
    usuario: string;
    href: string;
    icone: string;
};

type SettingResponse = {
    success: boolean;
    value?: string;
    message?: string;
    error?: string;
};

type UpdateSettingResponse = {
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
// PÁGINA: CONFIGURAÇÕES
// ================================
export default function ConfiguracoesPage() {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const showToast = (text: string, type: 'success' | 'error' = 'success') => {
        setToastMessage({ text, type });
        setTimeout(() => setToastMessage(null), 3000);
    };

    const defaultLinks = useMemo<SocialLink[]>(() => [
        {
            nome: "Instagram",
            usuario: "@guardianaeditora",
            href: "https://www.instagram.com/guardianaeditora",
            icone: "◎",
        },
        {
            nome: "Facebook",
            usuario: "Em breve",
            href: "#",
            icone: "f",
        },
        {
            nome: "X",
            usuario: "@guardiana",
            href: "#",
            icone: "𝕏",
        },
    ], []);

    const fetchSettings = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/auth/settings/social_media_links`);
            const data = (await response.json()) as SettingResponse;

            if (data.success && data.value && data.value !== "false") {
                try {
                    const parsed = JSON.parse(data.value);
                    if (Array.isArray(parsed)) {
                        setSocialLinks(parsed);
                        return;
                    }
                } catch (e) {
                    console.error("Erro ao fazer parse das redes sociais:", e);
                }
            }
            setSocialLinks(defaultLinks);
        } catch (error) {
            console.error("Erro ao buscar configurações de redes sociais:", error);
            setSocialLinks(defaultLinks);
        } finally {
            setLoading(false);
        }
    }, [defaultLinks]);

    useEffect(() => {
        void fetchSettings();
    }, [fetchSettings]);

    const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
        const newLinks = [...socialLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setSocialLinks(newLinks);
    };

    const handleSaveSocialLinks = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) throw new Error("Sessão não encontrada.");

            const response = await fetch(`${API_URL}/auth/settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    key: "social_media_links",
                    value: JSON.stringify(socialLinks),
                }),
            });

            const data = (await response.json()) as UpdateSettingResponse;
            if (!response.ok) throw new Error(data.error || data.message || "Erro ao salvar redes sociais.");

            showToast("Redes sociais atualizadas com sucesso!");
        } catch (error) {
            showToast(getErrorMessage(error, "Erro ao salvar redes sociais."), 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Carregando configurações...</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto relative">
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
                    Configurações do Sistema
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Gerencie as preferências globais da plataforma Guardiana.
                </p>
            </header>

            <div className="bg-white dark:bg-[#0F1720] rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="p-8">
                    <h2 className="text-lg font-bold text-[#18384A] dark:text-white">
                        Redes Sociais no Rodapé
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Configure os links das redes sociais que aparecem no rodapé do site.
                    </p>

                    <div className="space-y-6 mt-6">
                        {socialLinks.map((link, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-2xl">
                                <input
                                    type="text"
                                    value={link.nome}
                                    onChange={(e) => handleSocialLinkChange(index, 'nome', e.target.value)}
                                    placeholder="Nome da Rede (ex: Instagram)"
                                    className="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-[#020617] dark:text-white"
                                />
                                <input
                                    type="text"
                                    value={link.usuario}
                                    onChange={(e) => handleSocialLinkChange(index, 'usuario', e.target.value)}
                                    placeholder="Usuário (ex: @guardianaeditora)"
                                    className="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-[#020617] dark:text-white"
                                />
                                <input
                                    type="text"
                                    value={link.href}
                                    onChange={(e) => handleSocialLinkChange(index, 'href', e.target.value)}
                                    placeholder="Link completo (URL)"
                                    className="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-[#020617] dark:text-white"
                                />
                                <input
                                    type="text"
                                    value={link.icone}
                                    onChange={(e) => handleSocialLinkChange(index, 'icone', e.target.value)}
                                    placeholder="Ícone (opcional)"
                                    className="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-[#020617] dark:text-white"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-white/5 flex justify-end">
                    <button
                        type="button"
                        disabled={saving}
                        onClick={handleSaveSocialLinks}
                        className="px-6 py-2 bg-[#C95F52] text-white rounded-full font-bold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {saving ? "Salvando..." : "Salvar Redes Sociais"}
                    </button>
                </div>
            </div>
        </div>
    );
}