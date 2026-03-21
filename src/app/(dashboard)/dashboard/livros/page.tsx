"use client";

// ================================
// IMPORTS
// ================================
import { useEffect, useState } from "react";

// ================================
// MOCK INICIAL
// ================================
const initialLivros = [
    { id: 1, titulo: "Livro 1", autora: "Jenifer" },
    { id: 2, titulo: "Livro 2", autora: "Jenny" },
];

// ================================
// CRUD LIVROS
// ================================
export default function LivrosAdmin() {
    const [livros, setLivros] = useState<typeof initialLivros>([]);
    const [titulo, setTitulo] = useState("");
    const [autora, setAutora] = useState("");

    // ================================
    // CARREGAR DO "BANCO" (localStorage)
    // ================================
    useEffect(() => {
        const data = localStorage.getItem("livros");

        if (data) {
            setLivros(JSON.parse(data));
        } else {
            setLivros(initialLivros);
        }
    }, []);

    // ================================
    // SALVAR NO "BANCO" (localStorage)
    // ================================
    useEffect(() => {
        if (livros.length > 0) {
            localStorage.setItem("livros", JSON.stringify(livros));
        }
    }, [livros]);

    // ================================
    // ADICIONAR LIVRO
    // ================================
    const adicionarLivro = () => {
        if (!titulo || !autora) return;

        const novo = {
            id: Date.now(),
            titulo,
            autora,
        };

        setLivros([...livros, novo]);
        setTitulo("");
        setAutora("");
    };

    // ================================
    // REMOVER LIVRO
    // ================================
    const removerLivro = (id: number) => {
        setLivros(livros.filter((l) => l.id !== id));
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gerenciar Livros
            </h1>

            {/* ================================
                FORM
            ================================ */}
            <div className="mt-6 flex gap-2">
                <input
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="px-3 py-2 border rounded bg-white dark:bg-[#020617] text-gray-900 dark:text-white"
                />

                <input
                    placeholder="Autora"
                    value={autora}
                    onChange={(e) => setAutora(e.target.value)}
                    className="px-3 py-2 border rounded bg-white dark:bg-[#020617] text-gray-900 dark:text-white"
                />

                <button
                    onClick={adicionarLivro}
                    className="bg-[#D4AF37] px-4 py-2 rounded text-black"
                >
                    Adicionar
                </button>
            </div>

            {/* ================================
                LISTA
            ================================ */}
            <ul className="mt-6 space-y-2">
                {livros.map((livro) => (
                    <li
                        key={livro.id}
                        className="flex justify-between border p-3 rounded bg-white dark:bg-[#020617] border-gray-200 dark:border-white/10"
                    >
                        <span className="text-gray-900 dark:text-white">
                            {livro.titulo} - {livro.autora}
                        </span>

                        <button
                            onClick={() => removerLivro(livro.id)}
                            className="text-red-500"
                        >
                            Remover
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
