// ================================
// IMPORTS
// ================================
import Header from "../../../components/layout/Header";
import Sobre from "../../../components/sections/Sobre";

// ================================
// PÁGINA SOBRE
// ================================
export default function SobrePage() {
    return (
        // Respeita Light / Dark
        <main className="transition-colors duration-300">
            {/* Header */}
            <Header />

            {/* 
                Aqui reutilizamos o MESMO componente da Home
                Isso é arquitetura profissional (reuso)
            */}
            <Sobre />
        </main>
    );
}
