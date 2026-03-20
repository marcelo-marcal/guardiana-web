// ================================
// IMPORTS DAS SEÇÕES
// ================================
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Sobre from "@/components/sections/Sobre";
import Publicacoes from "@/components/sections/Publicacoes";
import Autores from "@/components/sections/Autores";
import Contato from "@/components/sections/Contato";
import Footer from "@/components/layout/Footer";

// ================================
// HOME (Landing Page)
// ================================
export default function Home() {
    return (
        // Agora respeita Light / Dark automaticamente
        <main className="transition-colors duration-300">
            <Header />
            <Hero />
            <Sobre />
            <Publicacoes />
            <Autores />
            <Contato />
            <Footer />
        </main>
    );
}
