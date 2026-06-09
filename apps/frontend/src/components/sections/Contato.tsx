"use client";

// ================================
// IMPORTS
// ================================
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

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
    // SUBMIT
    // ================================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFeedback({ type: null, message: "" });

        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await response.json().catch(() => null);

            if (response.ok) {
                setFeedback({ type: "success", message: "Mensagem enviada com sucesso! Em breve entraremos em contato." });
                // limpa formulário
                setForm({
                    nome: "",
                    email: "",
                    mensagem: "",
                });
            } else {
                setFeedback({ type: "error", message: data?.error || data?.message || "Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde." });
            }
        } catch (error) {
            console.error("Erro ao enviar contato:", error);
            setFeedback({ type: "error", message: "Erro de conexão. Verifique sua internet e tente novamente." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // ================================
        // SEÇÃO CONTATO
        // ================================
        <section
            id="contato"
            className="
                relative w-full overflow-hidden
                bg-[#F7F7F7] dark:bg-[#020617]
                transition-colors
                scroll-mt-24
            "
        >
            {/* ================================
                FAIXA AZUL INCLINADA
            ================================ */}
            <div
                className="
                    absolute left-0 right-0 top-16
                    h-[520px]
                    bg-[#18384A] dark:bg-[#0F1720]
                    [clip-path:polygon(0_0,100%_18%,100%_82%,0_100%)]
                "
            />

            {/* ================================
                CONTEÚDO PRINCIPAL
            ================================ */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-28">
                {/* ================================
                   CABEÇALHO
                ================================ */}
                <div className="text-center mb-14">
                    <span className="text-2xl text-white">Contato</span>

                    <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#D4AF37]">
                        Fale com a Guardiana
                    </h2>

                    <p className="mt-5 text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        Tem uma história para contar ou quer publicar seu livro?
                        Entre em contato conosco.
                    </p>
                </div>

                {/* ================================
                   GRID CONTATO + FORMULÁRIO
                ================================ */}
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
                    {/* ================================
                       BLOCO DE INFORMAÇÕES
                    ================================ */}
                    <div
                        className="
                            bg-white dark:bg-[#0F1720]
                            border border-gray-200 dark:border-white/10
                            rounded-xl
                            p-8
                            shadow-xl
                            transition-all duration-500
                            hover:-translate-y-2
                            hover:shadow-2xl
                        "
                    >
                        <h3 className="text-2xl font-extrabold text-[#18384A] dark:text-white">
                            Vamos conversar?
                        </h3>

                        <p className="mt-4 text-[#344454] dark:text-gray-300 leading-relaxed">
                            A Guardiana acolhe autoras, autores, leitores e
                            parceiros que acreditam no poder das histórias.
                        </p>

                        {/* ================================
                           INFORMAÇÕES DE CONTATO
                        ================================ */}
                        <div className="mt-8 space-y-5">
                            <div>
                                <span className="block text-sm font-bold text-[#C95F52] dark:text-[#D4AF37]">
                                    Editorial
                                </span>
                                <p className="mt-1 text-[#344454] dark:text-gray-300">
                                    Envio de originais, propostas e projetos.
                                </p>
                            </div>

                            <div>
                                <span className="block text-sm font-bold text-[#C95F52] dark:text-[#D4AF37]">
                                    Parcerias
                                </span>
                                <p className="mt-1 text-[#344454] dark:text-gray-300">
                                    Eventos, lançamentos, leituras e ações
                                    culturais.
                                </p>
                            </div>

                            <div>
                                <span className="block text-sm font-bold text-[#C95F52] dark:text-[#D4AF37]">
                                    Loja
                                </span>
                                <p className="mt-1 text-[#344454] dark:text-gray-300">
                                    Em breve: compras de livros físicos e ebooks
                                    pela plataforma.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ================================
                       FORMULÁRIO
                    ================================ */}
                    <form
                        onSubmit={handleSubmit}
                        className="
                            bg-white dark:bg-[#0F1720]
                            border border-gray-200 dark:border-white/10
                            rounded-xl
                            p-8
                            shadow-xl
                            space-y-6
                            transition-all duration-500
                            hover:-translate-y-2
                            hover:shadow-2xl
                        "
                    >
                        {/* NOME */}
                        <div>
                            <label className="text-sm font-medium text-[#18384A] dark:text-gray-300">
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
                                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                                    focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                                    transition
                                "
                            />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="text-sm font-medium text-[#18384A] dark:text-gray-300">
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
                                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                                    focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                                    transition
                                "
                            />
                        </div>

                        {/* MENSAGEM */}
                        <div>
                            <label className="text-sm font-medium text-[#18384A] dark:text-gray-300">
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
                                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                                    focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                                    transition
                                "
                            />
                        </div>

                        {/* FEEDBACK DE STATUS */}
                        {feedback.type && (
                            <div
                                className={`p-4 rounded-lg text-sm font-medium text-center ${
                                    feedback.type === "success"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                            >
                                {feedback.message}
                            </div>
                        )}

                        {/* BOTÃO */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                                w-full py-3 rounded-full
                                bg-[#C8A92F]
                                text-white
                                font-bold
                                hover:bg-[#b59828]
                                transition-all duration-300
                                disabled:opacity-70 disabled:cursor-not-allowed
                                flex items-center justify-center gap-2
                            "
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                "Enviar mensagem"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}