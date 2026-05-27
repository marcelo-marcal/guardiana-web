// ================================
// IMPORTS
// ================================
import type { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import path from "node:path";

// ================================
// CLIENTE SUPABASE
// ================================
// As variáveis de ambiente serão lidas pelo Render
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabaseBucket = process.env.SUPABASE_BUCKET_NAME!;

const supabase = createClient(supabaseUrl, supabaseKey);

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

            // Faz o upload para o Supabase Storage
            const { data, error } = await supabase.storage
                .from(supabaseBucket)
                .upload(fileName, request.file.buffer, {
                    contentType: request.file.mimetype,
                    upsert: false, // Não sobrescrever se o arquivo já existir
                });

            if (error) {
                throw error;
            }

            // Obtém a URL pública do arquivo
            const { data: { publicUrl } } = supabase.storage
                .from(supabaseBucket)
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