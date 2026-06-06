"use client";

// ================================
// IMPORTS
// ================================
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

// ================================
// CONFIGURAÇÕES
// ================================
const TOKEN_KEY = "guardiana_token";
const USER_KEY = "guardiana_user";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

// ================================
// TIPAGENS
// ================================
type LoginMode = "email" | "code" | "registration";

type LoginUser = {
    id: string;
    email: string;
    name: string;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
    literaryInterests?: string | null;
};

type RequestCodeResponse = {
    action?: "LOGGED_IN" | "CODE_SENT";
    token?: string;
    user?: LoginUser;
    error?: string;
};

type VerifyCodeResponse = {
    token: string;
    user: LoginUser;
    requiresRegistration: boolean;
    error?: string;
};

type CompleteRegistrationResponse = {
    user: LoginUser;
    error?: string;
};

// ================================
// HELPER: ERRO
// ================================
function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

// ================================
// PÁGINA: LOGIN
// ================================
export default function LoginPage() {
    const router = useRouter();
    const { user: authUser, loading: authLoading } = useAuth();

    const [loginMode, setLoginMode] = useState<LoginMode>("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [interests, setInterests] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ================================
    // REDIRECIONAR USUÁRIO JÁ LOGADO
    // ================================
    useEffect(() => {
        if (authLoading || !authUser) return;

        const emailPrefix = authUser.email.split("@")[0];
        const needsToRegister = authUser.name === emailPrefix;

        if (needsToRegister) {
            setLoginMode("registration");
            setEmail(authUser.email);
            return;
        }

        router.replace("/");
    }, [authUser, authLoading, router]);

    // ================================
    // SOLICITAR CÓDIGO / LOGIN DIRETO
    // ================================
    const handleRequestCode = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/auth/request-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    role: "USER",
                }),
            });

            const data = (await response.json()) as RequestCodeResponse;

            if (!response.ok) {
                throw new Error(
                    data.error || "Não foi possível iniciar o acesso.",
                );
            }

            if (data.action === "LOGGED_IN") {
                if (!data.token || !data.user) {
                    throw new Error("Resposta de login inválida.");
                }

                localStorage.setItem(TOKEN_KEY, data.token);
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
                window.dispatchEvent(new Event("auth:updated"));

                router.replace("/");
                return;
            }

            setLoginMode("code");
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Não foi possível enviar o código de acesso.",
            );

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // VERIFICAR CÓDIGO
    // ================================
    const handleVerifyCode = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/auth/verify-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    code,
                }),
            });

            const data = (await response.json()) as VerifyCodeResponse;

            if (!response.ok) {
                throw new Error(data.error || "Código inválido ou expirado.");
            }

            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            window.dispatchEvent(new Event("auth:updated"));

            if (data.requiresRegistration) {
                setLoginMode("registration");
                return;
            }

            router.replace("/");
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Código inválido ou expirado.",
            );

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // CONCLUIR CADASTRO
    // ================================
    const handleCompleteRegistration = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/auth/complete-registration`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        name,
                        literaryInterests: interests,
                    }),
                },
            );

            const data =
                (await response.json()) as CompleteRegistrationResponse;

            if (!response.ok) {
                throw new Error(data.error || "Erro ao completar cadastro.");
            }

            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            window.dispatchEvent(new Event("auth:updated"));

            router.replace("/");
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Erro ao completar cadastro.",
            );

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // TEXTOS DINÂMICOS
    // ================================
    const title =
        loginMode === "email"
            ? "Acesse sua conta"
            : loginMode === "code"
              ? "Confirme seu acesso"
              : "Complete seu cadastro";

    const subtitle =
        loginMode === "email"
            ? "Digite seu e-mail para entrar na plataforma Guardiana."
            : loginMode === "code"
              ? `Enviamos um código temporário para ${email}.`
              : "Conte-nos como você gostaria de aparecer na plataforma.";

    return (
        <main className="min-h-screen grid lg:grid-cols-[0.95fr_1.05fr] bg-[#F4F1EC] dark:bg-[#020617]">
            {/* ================================
                COLUNA VISUAL
            ================================ */}
            <section className="hidden lg:flex relative overflow-hidden bg-[#18384A]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.25),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(201,95,82,0.28),transparent_35%)]" />

                <div className="relative z-10 flex flex-col justify-between p-14 text-white">
                    <Link href="/" className="inline-flex">
                        <Image
                            src="/logo.svg"
                            alt="Guardiana Editora"
                            width={150}
                            height={60}
                            priority
                            className="brightness-0 invert"
                        />
                    </Link>

                    <div>
                        <p className="max-w-md text-3xl font-extrabold leading-tight">
                            Uma plataforma editorial para leitores, autores e
                            curadoria.
                        </p>

                        <p className="mt-5 max-w-md text-white/70 leading-relaxed">
                            Entre com segurança. A Guardiana identifica seu
                            perfil automaticamente e direciona você para o
                            ambiente correto.
                        </p>
                    </div>

                    <p className="text-sm text-white/50">
                        Guardiana Editora © Plataforma editorial
                    </p>
                </div>
            </section>

            {/* ================================
                COLUNA DO FORMULÁRIO
            ================================ */}
            <section className="flex min-h-screen items-center justify-center px-6 py-12">
                <div className="w-full max-w-[440px]">
                    <div className="mb-10 text-center lg:hidden">
                        <Link href="/" className="inline-flex justify-center">
                            <Image
                                src="/logo.svg"
                                alt="Guardiana Editora"
                                width={150}
                                height={60}
                                priority
                                className="dark:invert"
                            />
                        </Link>
                    </div>

                    <div className="rounded-[2rem] bg-white dark:bg-[#0F1720] border border-black/5 dark:border-white/10 shadow-2xl shadow-black/10 p-8 md:p-10">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#C95F52]">
                                Guardiana Editora
                            </span>

                            <h1 className="mt-4 text-3xl font-extrabold text-[#18384A] dark:text-white">
                                {title}
                            </h1>

                            <p className="mt-3 text-sm leading-relaxed text-[#526173] dark:text-gray-400">
                                {subtitle}
                            </p>
                        </div>

                        {error && (
                            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {loginMode === "email" && (
                            <form
                                onSubmit={handleRequestCode}
                                className="mt-8 space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-[#18384A] dark:text-gray-200">
                                        E-mail
                                    </label>

                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="seu@email.com"
                                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm text-[#18384A] outline-none transition placeholder:text-gray-400 focus:border-[#C95F52] focus:ring-4 focus:ring-[#C95F52]/10 dark:border-white/10 dark:bg-[#020617] dark:text-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-2xl bg-[#C95F52] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#C95F52]/20 transition hover:-translate-y-0.5 hover:bg-[#B95045] disabled:opacity-60"
                                >
                                    {loading
                                        ? "Enviando código..."
                                        : "Continuar"}
                                </button>

                                <p className="text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                                    Usaremos seu e-mail apenas para confirmar
                                    seu acesso com segurança.
                                </p>
                            </form>
                        )}

                        {loginMode === "code" && (
                            <form
                                onSubmit={handleVerifyCode}
                                className="mt-8 space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-[#18384A] dark:text-gray-200">
                                        Código de acesso
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={code}
                                        onChange={(event) =>
                                            setCode(event.target.value)
                                        }
                                        placeholder="000000"
                                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-center text-2xl tracking-[0.4em] text-[#18384A] outline-none transition placeholder:text-gray-300 focus:border-[#C95F52] focus:ring-4 focus:ring-[#C95F52]/10 dark:border-white/10 dark:bg-[#020617] dark:text-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-2xl bg-[#C95F52] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#C95F52]/20 transition hover:bg-[#B95045] disabled:opacity-60"
                                >
                                    {loading ? "Verificando..." : "Entrar"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setLoginMode("email");
                                        setCode("");
                                        setError("");
                                    }}
                                    className="w-full text-sm font-medium text-[#526173] transition hover:text-[#C95F52] dark:text-gray-400"
                                >
                                    Usar outro e-mail
                                </button>
                            </form>
                        )}

                        {loginMode === "registration" && (
                            <form
                                onSubmit={handleCompleteRegistration}
                                className="mt-8 space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-[#18384A] dark:text-gray-200">
                                        Nome ou pseudônimo
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        placeholder="Como deseja ser chamado(a)?"
                                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm text-[#18384A] outline-none transition placeholder:text-gray-400 focus:border-[#C95F52] focus:ring-4 focus:ring-[#C95F52]/10 dark:border-white/10 dark:bg-[#020617] dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#18384A] dark:text-gray-200">
                                        Interesses literários
                                    </label>

                                    <textarea
                                        value={interests}
                                        onChange={(event) =>
                                            setInterests(event.target.value)
                                        }
                                        rows={3}
                                        placeholder="Poesia, contos, crônicas..."
                                        className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm text-[#18384A] outline-none transition placeholder:text-gray-400 focus:border-[#C95F52] focus:ring-4 focus:ring-[#C95F52]/10 dark:border-white/10 dark:bg-[#020617] dark:text-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-2xl bg-[#C95F52] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#C95F52]/20 transition hover:bg-[#B95045] disabled:opacity-60"
                                >
                                    {loading
                                        ? "Salvando..."
                                        : "Concluir cadastro"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}