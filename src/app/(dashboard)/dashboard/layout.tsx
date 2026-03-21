"use client";

// ================================
// IMPORTS
// ================================
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ================================
// LAYOUT DASHBOARD (PROTEGIDO)
// ================================
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ================================
    // CONTROLE DE AUTENTICAÇÃO
    // ================================
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const isAuth = localStorage.getItem("auth");

        // Se NÃO estiver logado → manda pro login
        if (isAuth !== "true") {
            router.push("/login");
        } else {
            setLoading(false);
        }
    }, [router]);

    // Enquanto verifica login → não renderiza nada
    if (loading) return null;

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-[#020617] transition-colors">
            {/* ================================
                SIDEBAR
            ================================ */}
            <aside className="w-64 bg-white dark:bg-[#020617] border-r border-gray-200 dark:border-white/10 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Admin
                </h2>

                <nav className="flex flex-col gap-4 text-gray-700 dark:text-gray-300">
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/dashboard/livros">Livros</Link>
                    <Link href="/dashboard/publicacoes">Publicações</Link>
                    <Link href="/dashboard/configuracoes">Configurações</Link>
                </nav>

                {/* ================================
                   LOGOUT
                ================================ */}
                <button
                    onClick={() => {
                        localStorage.removeItem("auth");
                        router.push("/login");
                    }}
                    className="mt-10 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Sair
                </button>
            </aside>

            {/* ================================
                CONTEÚDO
            ================================ */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
