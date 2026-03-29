// ================================
// COMPONENTE: WITH AUTH (PROTEÇÃO DE ROTAS) - VERSÃO ANTI-FLASH
// ================================
// Função: Protege rotas do dashboard
// - NUNCA renderiza children antes de confirmar autenticação
// - Evita "flash" de conteúdo sensível
// ================================

"use client";

// ================================
// IMPORTS
// ================================
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// ================================
// PROPRIEDADES
// ================================
type WithAuthProps = {
    children: React.ReactNode;
};

// ================================
// COMPONENTE PRINCIPAL
// ================================
export default function WithAuth({ children }: WithAuthProps) {
    // ================================
    // HOOKS
    // ================================
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // ================================
    // VERIFICAÇÃO DE AUTENTICAÇÃO
    // ================================
    useEffect(() => {
        // 1. Segurança: só roda no cliente
        if (typeof window === "undefined") return;

        // 2. Se ainda está carregando a sessão → aguarda (não faz nada)
        if (loading) return;

        // 3. Se NÃO tem usuário → redireciona IMEDIATAMENTE
        if (!user) {
            // Salva rota para redirecionar após login futuro
            localStorage.setItem("redirectTo", pathname || "/dashboard");
            router.replace("/login");
        }
        // 4. Se tem usuário → permite renderizar (o return final faz isso)
    }, [user, loading, router, pathname]);

    // ================================
    // BLOQUEIO TOTAL: enquanto carrega OU não tem usuário
    // ================================
    // Nunca renderiza children nestes casos → zero flash de conteúdo
    if (loading || !user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-white dark:bg-[#020617] transition-colors">
                <div className="text-center">
                    <div
                        className="w-10 h-10 mx-auto mb-4 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"
                        aria-label="Carregando autenticação"
                    ></div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Verificando sessão...
                    </p>
                </div>
            </div>
        );
    }

    // ================================
    // AUTENTICADO: libera o conteúdo com segurança
    // ================================
    return <>{children}</>;
}
