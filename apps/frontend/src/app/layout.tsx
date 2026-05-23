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
// METADATA
// ================================
export const metadata: Metadata = {
    title: "Guardiana",
    description: "Editora Guardiana - Vozes que transformam o mundo",

    openGraph: {
        title: "Guardiana",
        description: "Editora Guardiana - Vozes que transformam o mundo",
        url: "https://guardiana.com",
        siteName: "Guardiana",
        locale: "pt_BR",
        type: "website",
    },

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
            <body className="bg-[#F7F7F7] text-[#18384A] antialiased transition-colors duration-300 dark:bg-[#020617] dark:text-white">
                <Header />

                {/* pt-16 = mesma altura do header h-16 */}
                <main className="pt-16">{children}</main>
            </body>
        </html>
    );
}
