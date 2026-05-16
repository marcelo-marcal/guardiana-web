"use client";

// ================================
// IMPORTS
// ================================
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";

// ================================
// LOGIN ADMIN
// ================================
export default function Login() {
    const { login } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    // ================================
    // SUBMIT
    // ================================
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        const success = login(email, senha);

        if (success) {
            router.push("/dashboard"); // entra no painel
        } else {
            alert("Credenciais inválidas");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#020617] px-6">
            <div className="w-full max-w-md bg-white dark:bg-[#020617] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-xl">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                    Login Admin
                </h1>

                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-[#020617] text-gray-900 dark:text-white"
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-[#020617] text-gray-900 dark:text-white"
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-medium hover:opacity-90 transition"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
