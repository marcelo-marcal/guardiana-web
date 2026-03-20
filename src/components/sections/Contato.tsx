"use client";

// ================================
// IMPORTS
// ================================
import { useState } from "react";

// ================================
// COMPONENTE CONTATO
// ================================
export default function Contato() {
    // ================================
    // ESTADO DO FORMULÁRIO
    // ================================
    const [form, setForm] = useState({
        nome: "",
        email: "",
        mensagem: "",
    });

    // ================================
    // ATUALIZA CAMPOS
    // ================================
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // ================================
    // SUBMIT (SIMULADO POR ENQUANTO)
    // ================================
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Dados enviados:", form);

        // 🔥 futuramente aqui entra API
        alert("Mensagem enviada com sucesso!");

        // limpa formulário
        setForm({
            nome: "",
            email: "",
            mensagem: "",
        });
    };

    return (
        // ================================
        // SEÇÃO CONTATO
        // ================================
        <section
            id="contato"
            className="
                w-full py-24 px-6
                bg-gray-50 dark:bg-[#020617]
                transition-colors
                scroll-mt-24
            "
        >
            <div className="max-w-5xl mx-auto">
                {/* ================================
                   CABEÇALHO
                ================================ */}
                <div className="text-center mb-12">
                    <span className="text-sm uppercase tracking-widest text-[#D4AF37]">
                        Contato
                    </span>

                    <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Fale com a Guardiana
                    </h2>

                    <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                        Tem uma história para contar ou quer publicar seu livro?
                        Entre em contato conosco.
                    </p>
                </div>

                {/* ================================
                   FORMULÁRIO
                ================================ */}
                <form
                    onSubmit={handleSubmit}
                    className="
                        bg-white dark:bg-[#020617]
                        border border-gray-200 dark:border-white/10
                        rounded-2xl
                        p-8
                        shadow-xl
                        space-y-6
                    "
                >
                    {/* NOME */}
                    <div>
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Nome
                        </label>
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            required
                            className="
                                w-full mt-2 px-4 py-3 rounded-lg
                                border border-gray-300 dark:border-white/20
                                bg-white dark:bg-[#020617]
                                text-gray-900 dark:text-white
                                focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                                transition
                            "
                        />
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="
                                w-full mt-2 px-4 py-3 rounded-lg
                                border border-gray-300 dark:border-white/20
                                bg-white dark:bg-[#020617]
                                text-gray-900 dark:text-white
                                focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                                transition
                            "
                        />
                    </div>

                    {/* MENSAGEM */}
                    <div>
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Mensagem
                        </label>
                        <textarea
                            name="mensagem"
                            value={form.mensagem}
                            onChange={handleChange}
                            rows={5}
                            required
                            className="
                                w-full mt-2 px-4 py-3 rounded-lg
                                border border-gray-300 dark:border-white/20
                                bg-white dark:bg-[#020617]
                                text-gray-900 dark:text-white
                                focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                                transition
                            "
                        />
                    </div>

                    {/* BOTÃO */}
                    <button
                        type="submit"
                        className="
                            w-full py-3 rounded-xl
                            bg-[#D4AF37]
                            text-black
                            font-medium
                            hover:opacity-90
                            transition
                        "
                    >
                        Enviar mensagem
                    </button>
                </form>
            </div>
        </section>
    );
}
