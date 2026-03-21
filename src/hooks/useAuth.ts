"use client";

// ================================
// HOOK DE AUTENTICAÇÃO (MOCK)
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
    // VERIFICA SESSÃO AO CARREGAR
    // ================================
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const isAuth = localStorage.getItem("auth");

        if (storedUser && isAuth === "true") {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    // ================================
    // LOGIN (MOCK)
    // ================================
    const login = (email: string, senha: string) => {
        // SIMULA BACKEND
        if (email === "admin@guardiana.com" && senha === "123456") {
            const userData = { email };

            // SALVA USUÁRIO
            localStorage.setItem("user", JSON.stringify(userData));

            // SALVA SESSÃO (ESSENCIAL)
            localStorage.setItem("auth", "true");

            setUser(userData);

            return true;
        }

        return false;
    };

    // ================================
    // LOGOUT
    // ================================
    const logout = () => {
        // LIMPA TUDO
        localStorage.removeItem("user");
        localStorage.removeItem("auth");

        setUser(null);
    };

    return { user, login, logout, loading };
}