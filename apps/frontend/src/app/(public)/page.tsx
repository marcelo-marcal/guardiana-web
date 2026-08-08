"use client";

// ================================
// IMPORTS
// ================================
import dynamic from "next/dynamic";
import { useEffect } from "react";
import Hero from "../../components/sections/Hero";
import PoemasDestaque from "@/components/sections/PoemasDestaque";

// ================================
// LAZY LOAD
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
// HOME
// ================================
export default function Home() {
    // ================================
    // SEMPRE ABRIR A HOME NO TOPO
    // ================================
    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="bg-[#F7F7F7] transition-colors duration-300 dark:bg-[#020617]">
            <Hero />
            <Sobre />
            <Livros />
            <Publicacoes />
            <PoemasDestaque />
            <Autores />
            <Contato />
            <Footer />
        </main>
    );
}