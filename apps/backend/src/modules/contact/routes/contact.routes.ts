// ================================
// IMPORTS
// ================================
import { Router, type Request, type Response } from "express";
import { ContactController } from "../controllers/ContactController.js";

// ================================
// ROTAS DE CONTATO
// ================================
const contactRoutes = Router();
const contactController = new ContactController();

contactRoutes.post("/", (req: Request, res: Response) => contactController.sendContact(req, res));

export { contactRoutes };