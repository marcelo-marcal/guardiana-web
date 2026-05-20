import nodemailer from "nodemailer";

export class EmailService {
    private transporter;

    constructor() {
        // Configuração do transportador (SMTP)
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendVerificationCode(email: string, code: string) {
        const mailOptions = {
            from: `"Guardiana Web" <${process.env.SMTP_USER}>`,
            to: email, // Envia para o e-mail passado por parâmetro (do usuário)
            subject: "Seu código de acesso - Guardiana",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #18384A;">Olá!</h1>
                    <p>Você solicitou um código de acesso para a plataforma Guardiana.</p>
                    <div style="background-color: #F7F7F7; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #C95F52;">${code}</span>
                    </div>
                    <p>Este código expira em 15 minutos.</p>
                </div>
            `,
        };

        return this.transporter.sendMail(mailOptions);
    }
}