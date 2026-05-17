// ================================
// IMPORTS
// ================================
import path from "node:path";
import multer from "multer";
import { Router } from "express";
import { UploadController } from "../controllers/UploadController.js";
import { authenticate } from "../../auth/middleware/authenticate.js";

// ================================
// CONFIGURAÇÃO DO STORAGE
// ================================
const storage = multer.diskStorage({
    destination: (_request, _file, callback) => {
        callback(null, path.resolve("uploads/images"));
    },
    filename: (_request, file, callback) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(
            Math.random() * 1_000_000_000,
        )}`;

        const extension = path.extname(file.originalname).toLowerCase();

        callback(null, `${uniqueSuffix}${extension}`);
    },
});

// ================================
// FILTRO DE ARQUIVOS
// ================================
const fileFilter: multer.Options["fileFilter"] = (_request, file, callback) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(new Error("Formato inválido. Envie JPG, PNG ou WEBP."));
    }

    return callback(null, true);
};

// ================================
// MULTER
// ================================
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

// ================================
// ROUTER
// ================================
const uploadRoutes = Router();
const uploadController = new UploadController();

// ================================
// ROTAS DE UPLOAD
// ================================
uploadRoutes.post(
    "/images",
    authenticate,
    upload.single("image"),
    (request, response) => {
        return uploadController.uploadImage(request, response);
    },
);

export { uploadRoutes };