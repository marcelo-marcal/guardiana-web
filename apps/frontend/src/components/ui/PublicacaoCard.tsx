"use client";

// ================================
//  Tipo
// ================================
import { Publicacao } from "../../data/publicacoes";

// ================================
//  Props
// ================================
type Props = {
    publicacao: Publicacao;
};

// ================================
// Card com animação
// ================================
export default function PublicacaoCard({ publicacao }: Props) {
    return (
        // Animação de entrada + hover premium
        <div
            className="
                group
                rounded-2xl
                border border-gray-200 dark:border-white/10
                p-6
                bg-white dark:bg-[#020617]

                opacity-0 translate-y-6
                animate-fadeIn

                hover:shadow-2xl
                hover:-translate-y-1

                transition-all duration-500
            "
            style={{ animationDelay: "0.2s" }} // adiciona delay leve
        >
            {/* Categoria */}
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
                {publicacao.categoria}
            </span>

            {/* Título */}
            <h3 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#D4AF37] transition">
                {publicacao.titulo}
            </h3>

            {/* Descrição */}
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {publicacao.descricao}
            </p>

            {/* Autor + Data */}
            <div className="mt-6 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{publicacao.autor}</span>
                <span>{publicacao.data}</span>
            </div>
        </div>
    );
}
