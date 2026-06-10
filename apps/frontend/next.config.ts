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
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3333",
                pathname: "/uploads/**",
            },
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "3333",
                pathname: "/uploads/**",
            },
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

export default nextConfig;
