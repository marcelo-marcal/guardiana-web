// ================================
// IMPORTS
// ================================
import type { Request, Response } from "express";

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

        const fileUrl = `/uploads/images/${request.file.filename}`;

        return response.status(201).json({
            success: true,
            file: {
                filename: request.file.filename,
                originalName: request.file.originalname,
                mimetype: request.file.mimetype,
                size: request.file.size,
                url: fileUrl,
            },
        });
    }
}