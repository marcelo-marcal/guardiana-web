// ================================
// IMPORTS
// ================================
import { Router, Request, Response } from "express";
import { ContactController } from "../controllers/ContactController.js";

// ================================
// ROTAS DE CONTATO
// ================================
const contactRoutes = Router();
const contactController = new ContactController();

contactRoutes.post("/", (Request, Response) => contactController.sendContact(req, res));

export { contactRoutes };