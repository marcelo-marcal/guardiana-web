// ================================
// TYPES
// ================================
import type { Metadata } from "next";

// ================================
// ESTILOS GLOBAIS
// ================================
import "./globals.css";

// ================================
// COMPONENTES GLOBAIS
// ================================
import Header from "../components/layout/Header";

// ================================
// METADATA (SEO PROFISSIONAL)
// ================================
export const metadata: Metadata = {
    title: "Guardiana",
    description: "Editora Guardiana - Vozes que transformam o mundo",

    // SEO para redes sociais (Facebook, WhatsApp, etc)
    openGraph: {
        title: "Guardiana",
        description: "Editora Guardiana - Vozes que transformam o mundo",
        url: "https://guardiana.com", // depois você troca
        siteName: "Guardiana",
        locale: "pt_BR",
        type: "website",
    },

    // SEO para Twitter
    twitter: {
        card: "summary_large_image",
        title: "Guardiana",
        description: "Editora Guardiana - Vozes que transformam o mundo",
    },
};

// ================================
// ROOT LAYOUT
// ================================
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            {/* ================================
               BODY GLOBAL
               - antialiased melhora leitura
               - transition melhora troca de tema
            ================================= */}
            <body className="antialiased transition-colors duration-300">
                {/* ================================
                   HEADER GLOBAL (FIXO)
                   ⚠️ NÃO repetir nas páginas
                ================================= */}
                <Header />

                {/* ================================
                   CONTEÚDO PRINCIPAL
                   - pt-20 evita sobrepor header fixo
                ================================= */}
                <main className="pt-20">{children}</main>
            </body>
        </html>
    );
}
