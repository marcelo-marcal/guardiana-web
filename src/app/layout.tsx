import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header"; // Importando o Header

export const metadata: Metadata = {
    title: "Guardiana",
    description: "Editora Guardiana - Vozes que transformam o mundo",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className="antialiased transition-colors duration-300">
                {/* Header fixo */}
                <Header />

                {/* Espaçamento para não ficar atrás do header */}
                <main className="pt-20">{children}</main>
            </body>
        </html>
    );
}
