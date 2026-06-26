// ================================
// IMPORTS
// ================================
import type { NextConfig } from "next";

// ================================
// CONFIGURAÇÃO DO NEXT
// ================================
const nextConfig: NextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
