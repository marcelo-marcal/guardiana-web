// ================================
// IMPORTS
// ================================
import nodemailer, { type Transporter } from "nodemailer";

// ================================
// SERVICE: E-MAIL
// ================================
export class EmailService {
    private readonly transporter: Transporter;

    constructor() {
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

    // ================================
    // ENVIAR CÓDIGO DE VERIFICAÇÃO
    // ================================
    async sendVerificationCode(email: string, code: string) {
        const from =
            process.env.SMTP_FROM ||
            `"Guardiana Editora" <${process.env.SMTP_USER}>`;

        return this.transporter.sendMail({
            from,
            to: email,
            subject: "Seu código de acesso à Guardiana",
            text: `Seu código de acesso à Guardiana é: ${code}. Ele expira em 15 minutos. Se você não solicitou este acesso, ignore este e-mail.`,
            html: this.buildVerificationTemplate(code),
        });
    }

    // ================================
    // TEMPLATE HTML
    // ================================
    private buildVerificationTemplate(code: string) {
        return `
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Seu código de acesso à Guardiana</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ec;font-family:Arial,Helvetica,sans-serif;color:#18384A;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ec;padding:40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:28px;overflow:hidden;border:1px solid #ece7df;box-shadow:0 18px 45px rgba(24,56,74,0.12);">
                    <tr>
                        <td style="padding:42px 40px 24px;text-align:center;">
                            <div style="font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#C95F52;font-weight:700;">
                                Guardiana Editora
                            </div>

                            <h1 style="margin:22px 0 0;font-size:28px;line-height:1.2;color:#18384A;">
                                Seu código de acesso
                            </h1>

                            <p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#526173;">
                                Informe este código temporário para continuar acessando a plataforma Guardiana.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:0 40px 10px;">
                            <div style="background:#18384A;border-radius:22px;padding:28px;text-align:center;">
                                <div style="font-size:36px;letter-spacing:10px;font-weight:800;color:#D4AF37;">
                                    ${code}
                                </div>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:22px 40px 34px;">
                            <p style="margin:0;font-size:14px;line-height:1.7;color:#526173;">
                                Este código expira em <strong>15 minutos</strong>. Para sua segurança, não compartilhe este código com ninguém.
                            </p>

                            <p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:#526173;">
                                Se você não solicitou este acesso, pode ignorar este e-mail com segurança.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#f8f6f2;padding:24px 40px;text-align:center;border-top:1px solid #ece7df;">
                            <p style="margin:0;font-size:12px;line-height:1.6;color:#87909c;">
                                Este e-mail foi enviado automaticamente pela Guardiana Editora.
                            </p>

                            <p style="margin:8px 0 0;font-size:12px;color:#87909c;">
                                © Guardiana Editora
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;
    }
}