"use client";

// ================================
// IMPORTS
// ================================
import { useCallback, useEffect, useState } from "react";

// ================================
// CONFIGURAÇÕES
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
const TOKEN_KEY = "guardiana_token";

// ================================
// TIPAGENS
// ================================
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
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ================================
    // BUSCAR CONFIGURAÇÃO
    // ================================
    const fetchSetting = useCallback(async () => {
        try {
            const response = await fetch(
                `${API_URL}/auth/settings/show_poems_section`,
            );

            const data = (await response.json()) as SettingResponse;

            if (data.success) {
                setIsVisible(data.value === "true");
            }
        } catch (error) {
            console.error("Erro ao buscar configuração:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // ================================
    // CARREGAR AO ABRIR A TELA
    // ================================
    useEffect(() => {
        void fetchSetting();
    }, [fetchSetting]);

    // ================================
    // ATIVAR/DESATIVAR SEÇÃO
    // ================================
    const handleToggle = async () => {
        const newValue = !isVisible;

        setSaving(true);

        try {
            const token = localStorage.getItem(TOKEN_KEY);

            if (!token) {
                throw new Error(
                    "Sessão não encontrada. Por favor, faça login novamente.",
                );
            }

            const response = await fetch(`${API_URL}/auth/settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    key: "show_poems_section",
                    value: String(newValue),
                }),
            });

            const data = (await response.json()) as UpdateSettingResponse;

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        data.message ||
                        "Erro ao atualizar configuração.",
                );
            }

            setIsVisible(newValue);
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Erro ao atualizar configuração.",
            );

            alert(`Falha: ${message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-gray-500">Carregando configurações...</div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-[#18384A] dark:text-white">
                    Configurações do Sistema
                </h1>

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Gerencie as preferências globais da plataforma Guardiana.
                </p>
            </header>

            <div className="bg-white dark:bg-[#0F1720] rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center justify-between gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-lg font-bold text-[#18384A] dark:text-white">
                                Seção de Poemas na Página Inicial
                            </h2>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Ative ou desative a exibição da seção Poesias em
                                Destaque na página inicial do site.
                            </p>
                        </div>

                        <button
                            type="button"
                            disabled={saving}
                            onClick={handleToggle}
                            className={`${
                                isVisible
                                    ? "bg-[#C95F52]"
                                    : "bg-gray-200 dark:bg-gray-700"
                            } relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C95F52] focus:ring-offset-2 disabled:opacity-50`}
                        >
                            <span
                                aria-hidden="true"
                                className={`${
                                    isVisible
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                } pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                            />
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-white/5">
                    <p className="text-xs text-gray-400 italic">
                        * Alterações nesta seção impactam imediatamente a
                        visibilidade para todos os visitantes do site.
                    </p>
                </div>
            </div>
        </div>
    );
}
