import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";

const authService = new AuthService();

export class AuthController {
    async request(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ error: "E-mail obrigatório" });
            
            const result = await authService.requestAccessCode(email);
            return res.json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async verify(req: Request, res: Response) {
        try {
            const { email, code } = req.body;
            if (!email || !code) return res.status(400).json({ error: "E-mail e código são obrigatórios" });

            const result = await authService.verifyCode(email, code);
            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async adminLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: "E-mail e senha são obrigatórios" });

            const result = await authService.adminLogin(email, password);
            return res.json(result);
        } catch (error: any) {
            return res.status(401).json({ error: error.message }); // 401 Unauthorized para falhas de login
        }
    }

    async completeRegistration(req: Request, res: Response) {
        try {
            const { email, name, literaryInterests } = req.body;
            if (!email || !name) return res.status(400).json({ error: "E-mail e nome são obrigatórios" });

            const result = await authService.completeRegistration(email, name, literaryInterests);
            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async me(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) return res.status(401).json({ success: false, error: "Não autorizado" });

            const token = authHeader.split(" ")[1];
            const user = await authService.getMe(token);
            return res.json({ success: true, user });
        } catch (error: any) {
            return res.status(401).json({ success: false, error: error.message });
        }
    }
}