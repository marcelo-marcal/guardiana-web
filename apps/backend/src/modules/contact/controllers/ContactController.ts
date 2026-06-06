import { type Request, type Response } from "express";
import { EmailService } from "../../../shared/services/EmailService.js";

export class ContactController {
    

    async sendContact(req: Request, res: Response) {
        try {
            const { nome, email, mensagem } = req.body;

            if (!nome || !email || !mensagem) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios." });
            }

            const emailService = new EmailService();
            await emailService.sendContactEmail(nome, email, mensagem);
            
            return res.status(200).json({ message: "Contato recebido com sucesso!" });
        } catch (error) {
            console.error("Erro ao enviar contato:", error);
            return res.status(500).json({ error: "Erro ao enviar contato." });
        }
    }
}
