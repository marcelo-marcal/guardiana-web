"use client";

// ================================
// IMPORTS
// ================================
import { useCallback, useEffect, useState } from "react";

// ================================
// CONFIGURAÇÃO DA API
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

// ================================
// TIPAGEM DO USUÁRIO
// ================================
type User = {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
    status: string;
    avatarUrl: string | null;
};

// ================================
// RESPOSTA DO LOGIN
// ================================
type LoginResponse = {
    success: boolean;
    token: string;
    user: User;
    message?: string;
};

// ================================
// RESPOSTA DO /AUTH/ME
// ================================
type MeResponse = {
    success: boolean;
    user: User;
    message?: string;
};

// ================================
// CHAVES DO LOCALSTORAGE
// ================================
const TOKEN_KEY = "guardiana_token";
const USER_KEY = "guardiana_user";

// ================================
// HOOK PRINCIPAL
// ================================
export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // ================================
    // FUNÇÃO INTERNA: limpar sessão
    // ================================
    const clearSession = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        // Remove chaves antigas do mock
        localStorage.removeItem("auth");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");

        setUser(null);
    }, []);

    // ================================
    // FUNÇÃO INTERNA: verificar sessão real
    // ================================
    const checkAuth = useCallback(async () => {
        if (typeof window === "undefined") {
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem(TOKEN_KEY);

            if (!token) {
                clearSession();
                return;
            }

            const response = await fetch(`${API_URL}/auth/me`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = (await response.json()) as MeResponse;

            if (!response.ok || !data.success) {
                clearSession();
                return;
            }

            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            setUser(data.user);
        } catch {
            clearSession();
        } finally {
            setLoading(false);
        }
    }, [clearSession]);

    // ================================
    // EFEITO: Verifica ao montar + Escuta evento de sync
    // ================================
    useEffect(() => {
        void checkAuth();

        const handleAuthUpdate = () => {
            void checkAuth();
        };

        window.addEventListener("auth:updated", handleAuthUpdate);

        return () => {
            window.removeEventListener("auth:updated", handleAuthUpdate);
        };
    }, [checkAuth]);

    // ================================
    // LOGIN REAL COM BACKEND
    // ================================
    const login = async (email: string, senha: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password: senha,
                }),
            });

            const data = (await response.json()) as LoginResponse;

            if (!response.ok || !data.success) {
                return false;
            }

            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));

            setUser(data.user);

            window.dispatchEvent(new Event("auth:updated"));

            return true;
        } catch {
            return false;
        }
    };

    // ================================
    // LOGOUT
    // ================================
    const logout = () => {
        clearSession();
        window.dispatchEvent(new Event("auth:updated"));
    };

    return { user, login, logout, loading };
}