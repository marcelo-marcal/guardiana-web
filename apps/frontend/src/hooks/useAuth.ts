"use client";

// ================================
// IMPORTS
// ================================
import { useCallback, useEffect, useState } from "react";

// ================================
// CONFIGURAÇÃO DA API
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3333";

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
export const TOKEN_KEY = "guardiana_token";
export const USER_KEY = "guardiana_user";

// ================================
// HELPERS DE STORAGE
// ================================
export const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const getAuthUser = () => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    try {
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

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
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);

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
    const fetchUser = useCallback(async () => {
        if (typeof window === "undefined") {
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

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

            const userJson = JSON.stringify(data.user);
            if (localStorage.getItem(TOKEN_KEY)) {
                localStorage.setItem(USER_KEY, userJson);
            } else {
                sessionStorage.setItem(USER_KEY, userJson);
            }
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
        void fetchUser();

        const handleAuthUpdate = () => {
            void fetchUser();
        };

        window.addEventListener("auth:updated", handleAuthUpdate);

        return () => {
            window.removeEventListener("auth:updated", handleAuthUpdate);
        };
    }, [fetchUser]);

    // ================================
    // LOGIN REAL COM BACKEND
    // ================================
    const login = async (email: string, senha: string, remember = false) => {
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

            const storage = remember ? localStorage : sessionStorage;
            storage.setItem(TOKEN_KEY, data.token);
            storage.setItem(USER_KEY, JSON.stringify(data.user));

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

    return { user, login, logout, loading, fetchUser };
}