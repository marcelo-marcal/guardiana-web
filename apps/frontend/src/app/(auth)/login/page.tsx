"use client";

// ================================
// IMPORTS
// ================================
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth, TOKEN_KEY, USER_KEY } from "@/hooks/useAuth";

// ================================
// CONFIGURAÇÕES
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3333";

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
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [interests, setInterests] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

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
    // LOGIN COM SENHA
    // ================================
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = (await response.json()) as {
                token?: string;
                user?: LoginUser;
                error?: string;
            };

            if (!response.ok) {
                throw new Error(data.error || "E-mail ou senha incorretos.");
            }

            if (!data.token || !data.user) {
                throw new Error("Resposta de login inválida.");
            }

            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem(TOKEN_KEY, data.token);
            storage.setItem(USER_KEY, JSON.stringify(data.user));
            window.dispatchEvent(new Event("auth:updated"));

            router.replace("/");
        } catch (error) {
            const message = getErrorMessage(error, "Erro ao fazer login.");
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // SOLICITAR CÓDIGO (BACKUP)
    // ================================
    const handleRequestCode = async () => {
        if (!email) {
            setError("Digite seu e-mail primeiro.");
            return;
        }

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
                    data.error || "Não foi possível enviar o código.",
                );
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

            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem(TOKEN_KEY, data.token);
            storage.setItem(USER_KEY, JSON.stringify(data.user));
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
                        password,
                        literaryInterests: interests,
                    }),
                },
            );

            const data =
                (await response.json()) as CompleteRegistrationResponse;

            if (!response.ok) {
                throw new Error(data.error || "Erro ao completar cadastro.");
            }

            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem(USER_KEY, JSON.stringify(data.user));
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
                                onSubmit={handleLogin}
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

                                <div>
                                    <label className="block text-sm font-semibold text-[#18384A] dark:text-gray-200">
                                        Senha
                                    </label>

                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="••••••••"
                                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm text-[#18384A] outline-none transition placeholder:text-gray-400 focus:border-[#C95F52] focus:ring-4 focus:ring-[#C95F52]/10 dark:border-white/10 dark:bg-[#020617] dark:text-white"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="peer appearance-none w-5 h-5 rounded-md border-2 border-gray-200 dark:border-white/10 checked:border-[#C95F52] checked:bg-[#C95F52] transition-all cursor-pointer"
                                            />
                                            <svg
                                                className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-[#526173] dark:text-gray-400 group-hover:text-[#18384A] dark:group-hover:text-white transition-colors">
                                            Manter-se conectado
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-2xl bg-[#C95F52] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#C95F52]/20 transition hover:-translate-y-0.5 hover:bg-[#B95045] disabled:opacity-60"
                                >
                                    {loading ? "Entrando..." : "Entrar"}
                                </button>

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white dark:bg-[#0F1720] px-2 text-gray-500">
                                            Ou
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleRequestCode}
                                    disabled={loading}
                                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-transparent px-5 py-4 text-sm font-bold text-[#18384A] dark:text-white transition hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-60"
                                >
                                    Entrar com código por e-mail
                                </button>

                                <p className="text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                                    Acesse com sua senha ou solicite um código
                                    temporário via e-mail.
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

                                <div className="flex items-center">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="peer appearance-none w-5 h-5 rounded-md border-2 border-gray-200 dark:border-white/10 checked:border-[#C95F52] checked:bg-[#C95F52] transition-all cursor-pointer"
                                            />
                                            <svg
                                                className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-[#526173] dark:text-gray-400 group-hover:text-[#18384A] dark:group-hover:text-white transition-colors">
                                            Manter-se conectado
                                        </span>
                                    </label>
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
                                        Defina uma senha
                                    </label>

                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="••••••••"
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

                                <div className="flex items-center">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="peer appearance-none w-5 h-5 rounded-md border-2 border-gray-200 dark:border-white/10 checked:border-[#C95F52] checked:bg-[#C95F52] transition-all cursor-pointer"
                                            />
                                            <svg
                                                className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-[#526173] dark:text-gray-400 group-hover:text-[#18384A] dark:group-hover:text-white transition-colors">
                                            Manter-se conectado
                                        </span>
                                    </label>
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