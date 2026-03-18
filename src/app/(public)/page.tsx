import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Sobre from "@/components/sections/Sobre";
import Publicacoes from "@/components/sections/Publicacoes";

export default function Home() {
    return (
        <main className="bg-[#0F1720] text-white">
            <Header />
            <Hero />
            <Sobre />
            <Publicacoes />
        </main>
    );
}
