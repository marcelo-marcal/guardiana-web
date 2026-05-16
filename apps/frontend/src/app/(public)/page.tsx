// ================================
// IMPORTS DAS SEÇÕES
// ================================
import dynamic from "next/dynamic";
import Hero from "../../components/sections/Hero";

// ================================
// LAZY LOAD (PERFORMANCE)
// - Só carrega quando necessário
// ================================
const Sobre = dynamic(() => import("../../components/sections/Sobre"));
const Livros = dynamic(() => import("../../components/sections/Livros"));
const Publicacoes = dynamic(
    () => import("../../components/sections/Publicacoes"),
);
const Autores = dynamic(() => import("../../components/sections/Autores"));
const Contato = dynamic(() => import("../../components/sections/Contato"));
const Footer = dynamic(() => import("../../components/layout/Footer"));

// ================================
// HOME (Landing Page)
// ================================
export default function Home() {
    return (
        // Agora respeita Light / Dark automaticamente
        <main className="transition-colors duration-300">
            {/* HERO = PRIORIDADE MÁXIMA */}
            <Hero />

            {/* ================================
               SEÇÕES CARREGADAS SOB DEMANDA
               melhora performance geral
            ================================= */}
            <Sobre />
            <Livros />
            <Publicacoes />
            <Autores />
            <Contato />
            <Footer />
        </main>
    );
}
