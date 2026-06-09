// ================================
// IMPORTS
// ================================
import type { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import path from "node:path";
import ws from "ws";

// Extrai o construtor corretamente dependendo de como o TS/Node exporta o módulo "ws"
const WsConstructor = typeof ws === "function" ? ws : (ws as any).default || (ws as any).WebSocket || ws;

// ================================
// CLIENTE SUPABASE
// ================================
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
    if (!supabaseInstance) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("SUPABASE_URL e SUPABASE_KEY não estão definidos no arquivo .env");
        }

        supabaseInstance = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false, // Desativa a busca por localStorage no Backend
            },
            realtime: {
                transport: WsConstructor as any, // Propriedade correta para injetar o WebSocket
            },
        });
    }
    return supabaseInstance;
}

function getSupabaseBucket() {
    return process.env.SUPABASE_BUCKET || process.env.SUPABASE_BUCKET_NAME || "guardiana-uploads";
}

// ================================
// CONTROLLER: UPLOADS
// ================================
export class UploadController {
    // ================================
    // UPLOAD DE IMAGEM
    // ================================
    async uploadImage(request: Request, response: Response) {
        if (!request.file) {
            return response.status(400).json({
                success: false,
                message: "Nenhuma imagem enviada.",
            });
        }

        try {
            // Gera um nome de arquivo único
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1_000_000_000)}`;
            const extension = path.extname(request.file.originalname).toLowerCase();
            const fileName = `${uniqueSuffix}${extension}`;

            const supabase = getSupabaseClient();
            const bucket = getSupabaseBucket();

            // Faz o upload para o Supabase Storage
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(fileName, request.file.buffer, {
                    contentType: request.file.mimetype,
                    upsert: false, // Não sobrescrever se o arquivo já existir
                });

            if (error) {
                throw error;
            }

            // Obtém a URL pública do arquivo
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(data.path);

            return response.status(201).json({
                success: true,
                file: {
                    filename: fileName,
                    originalName: request.file.originalname,
                    mimetype: request.file.mimetype,
                    size: request.file.size,
                    url: publicUrl,
                },
            });

        } catch (error) {
            console.error("Supabase upload error:", error);
            return response.status(500).json({
                success: false,
                message: "Erro ao fazer upload da imagem.",
            });
        }
    }
}