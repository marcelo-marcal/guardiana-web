"use client";

// ================================
// HOOK DE AUTENTICAÇÃO (MOCK) - VERSÃO SYNC
// ================================
// Correção: Adiciona evento personalizado para sincronizar
// o estado de autenticação entre todos os componentes
// que usam useAuth() em tempo real
// ================================

import { useEffect, useState } from "react";

// ================================
// TIPAGEM DO USUÁRIO
// ================================
type User = {
    email: string;
};

// ================================
// HOOK PRINCIPAL
// ================================
export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // ================================
    // FUNÇÃO INTERNA: Verificar sessão no localStorage
    // ================================
    // Centraliza a lógica de leitura para reuso no listener
    const checkAuth = () => {
        // Segurança: só executa no cliente
        if (typeof window === "undefined") {
            setLoading(false);
            return;
        }

        const storedUser = localStorage.getItem("user");
        const isAuth = localStorage.getItem("auth");

        if (storedUser && isAuth === "true") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                // Se houver erro ao parsear, limpa dados inválidos
                console.error("Erro ao carregar usuário:", error);
                localStorage.removeItem("user");
                localStorage.removeItem("auth");
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    // ================================
    // EFEITO: Verifica ao montar + Escuta evento de sync
    // ================================
    useEffect(() => {
        // 1. Verificação inicial ao carregar o componente
        checkAuth();

        // 2. Listener para evento personalizado de atualização de auth
        // Quando qualquer componente disparar 'auth:updated', este hook re-verifica
        const handleAuthUpdate = () => checkAuth();
        window.addEventListener("auth:updated", handleAuthUpdate);

        // Cleanup: remove listener ao desmontar (evita memory leak)
        return () => {
            window.removeEventListener("auth:updated", handleAuthUpdate);
        };
    }, []);

    // ================================
    // LOGIN (MOCK)
    // ================================
    const login = (email: string, senha: string) => {
        // Simula validação de backend
        if (email === "admin@guardiana.com" && senha === "123456") {
            const userData = { email };

            // Salva no localStorage (persistência)
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("auth", "true");

            // Atualiza estado local deste hook
            setUser(userData);

            // DISPARA EVENTO: avisa TODOS os componentes que auth mudou
            // Isso faz o Header, Dashboard, etc. re-verificarem o estado
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("auth:updated"));
            }

            return true;
        }
        return false;
    };

    // ================================
    // LOGOUT
    // ================================
    const logout = () => {
        // Limpa dados do localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("auth");

        // Atualiza estado local
        setUser(null);

        // DISPARA EVENTO: avisa TODOS os componentes que auth mudou
        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("auth:updated"));
        }
    };

    return { user, login, logout, loading };
}