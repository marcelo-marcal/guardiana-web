"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // Novo estado para a senha do administrador
    const [code, setCode] = useState("");
    const [userLoginStep, setUserLoginStep] = useState<"email" | "code">("email"); // Renomeado de 'step' para clareza
    const [loginMode, setLoginMode] = useState<"selectRole" | "user" | "admin">("selectRole"); // Novo estado para seleção de perfil
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

    // Enviar solicitação de código para o backend (para usuário comum)
    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const res = await fetch(`${API_URL}/auth/request-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Erro desconhecido ao solicitar código.");
            }
            
            setUserLoginStep("code"); // Corrigido: Usar userLoginStep
        } catch (error: any) {
            console.error("Erro ao solicitar código:", error); // Log mais específico
            setError(error.message || "Não conseguimos enviar o código. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    // Verificar código no backend
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/auth/verify-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Código inválido.");
            
            // Salva token e dados do usuário no localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/dashboard");
        } catch (error) {
            console.error("Erro ao verificar código:", error);
            setError(error.message || "Código inválido ou expirado.");
        } finally {
            setLoading(false);
        }
    };

    // Login de Administrador (email/senha)
    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/auth/admin-login`, { // Novo endpoint
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Credenciais inválidas.");

            // Salva token e dados do usuário no localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Erro no login de administrador:", error);
            setError(error.message || "Credenciais inválidas.");
        } finally {
            setLoading(false);
        }
    };

    const renderLoginForms = () => {
        if (loginMode === "user") {
            return (
                <form onSubmit={userLoginStep === "email" ? handleRequestCode : handleVerifyCode} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            E-mail
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-[#020617] dark:text-white focus:ring-2 focus:ring-[#C95F52] outline-none transition"
                            placeholder="seu@email.com"
                            disabled={userLoginStep === "code"} // Desabilita o input de e-mail após o código ser solicitado
                        />
                    </div>
                    {userLoginStep === "code" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Código de 6 dígitos
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full px-4 py-3 text-center tracking-widest text-2xl rounded-lg border border-gray-200 dark:border-white/10 dark:bg-[#020617] dark:text-white focus:ring-2 focus:ring-[#C95F52] outline-none transition"
                                placeholder="000000"
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#C95F52] hover:bg-[#A84A3F] text-white font-bold py-3 rounded-lg transition duration-300 disabled:opacity-50"
                    >
                        {loading ? (userLoginStep === "email" ? "Enviando..." : "Verificando...") : (userLoginStep === "email" ? "Receber Código" : "Entrar")}
                    </button>
                    {userLoginStep === "code" && (
                        <button
                            type="button"
                            onClick={() => setUserLoginStep("email")}
                            className="w-full text-sm text-gray-500 hover:text-[#C95F52] transition"
                        >
                            Usar outro e-mail
                        </button>
                    )}
                    {/* Botão para voltar à seleção de perfil */}
                    <button
                        type="button"
                        onClick={() => { setLoginMode("selectRole"); setError(""); setEmail(""); setCode(""); setPassword(""); setUserLoginStep("email"); }}
                        className="w-full text-sm text-gray-500 hover:text-[#18384A] transition mt-4"
                    >
                        Voltar para seleção de perfil
                    </button>
                </form>
            );
        } else if (loginMode === "admin") {
            return (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            E-mail
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-[#020617] dark:text-white focus:ring-2 focus:ring-[#C95F52] outline-none transition"
                            placeholder="admin@guardiana.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-[#020617] dark:text-white focus:ring-2 focus:ring-[#C95F52] outline-none transition"
                            placeholder="********"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#18384A] hover:bg-[#122b3a] text-white font-bold py-3 rounded-lg transition duration-300 disabled:opacity-50"
                    >
                        {loading ? "Entrando..." : "Entrar como Administrador"}
                    </button>
                    {/* Botão para voltar à seleção de perfil */}
                    <button
                        type="button"
                        onClick={() => { setLoginMode("selectRole"); setError(""); setEmail(""); setCode(""); setPassword(""); setUserLoginStep("email"); }}
                        className="w-full text-sm text-gray-500 hover:text-[#18384A] transition mt-4"
                    >
                        Voltar para seleção de perfil
                    </button>
                </form>
            );
        } else { // loginMode === "selectRole"
            return (
                <div className="space-y-4">
                    <button
                        onClick={() => { setLoginMode("user"); setError(""); }}
                        className="w-full bg-[#C95F52] hover:bg-[#A84A3F] text-white font-bold py-3 rounded-lg transition duration-300"
                    >
                        Entrar como Usuário
                    </button>
                    <button
                        onClick={() => { setLoginMode("admin"); setError(""); }}
                        className="w-full bg-[#18384A] hover:bg-[#122b3a] text-white font-bold py-3 rounded-lg transition duration-300"
                    >
                        Entrar como Administrador
                    </button>
                </div>
            );
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#F7F7F7] dark:bg-[#020617] px-6">
            <div className="w-full max-w-md bg-white dark:bg-[#0F1720] rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-white/10">
                <div className="text-center mb-8">
                    <Link href="/">
                        <Image 
                            src="/logo.svg" 
                            alt="Guardiana" 
                            width={150} 
                            height={50} 
                            className="mx-auto mb-6 dark:invert"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold text-[#18384A] dark:text-white">
                        {loginMode === "selectRole" ? "Escolha seu perfil" : (loginMode === "user" ? (userLoginStep === "email" ? "Bem-vinda(o) de volta" : "Verifique seu e-mail") : "Login de Administrador")}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {loginMode === "selectRole"
                            ? "Selecione como você deseja acessar a plataforma."
                            : (loginMode === "user"
                                ? (userLoginStep === "email"
                                    ? "Digite seu e-mail para acessar sua conta ou criar uma nova."
                                    : `Enviamos um código de acesso para ${email}`)
                                : "Acesse o painel administrativo com suas credenciais.")
                        }
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/50">
                        {error}
                    </div>
                )}

                {renderLoginForms()}
            </div>
        </main>
    );
}