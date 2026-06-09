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
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3333",
                pathname: "/uploads/**",
            },
        ],
    },
};

export default nextConfig;
