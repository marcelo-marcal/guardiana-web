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
    // ENVIAR CONTATO DO SITE
    // ================================
    async sendContactEmail(name: string, email: string, message: string) {
        const to = process.env.CONTACT_EMAIL || process.env.SMTP_USER || "contato@editoraguardiana.com";
        const from = process.env.SMTP_FROM || '"Guardiana Editora" <' + process.env.SMTP_USER + '>';

        return this.transporter.sendMail({
            from,
            to,
            replyTo: email,
            subject: "Novo contato pelo site: " + name,
            text: "Nome: " + name + "\nE-mail: " + email + "\n\nMensagem:\n" + message,
            html: this.buildContactTemplate(name, email, message),
        });
    }

    // ================================
    // TEMPLATE HTML PARA CONTATO
    // ================================
    private buildContactTemplate(name: string, email: string, message: string) {
        return "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Novo contato do site</title>\n</head>\n<body style=\"margin:0;padding:0;background:#f4f1ec;font-family:Arial,Helvetica,sans-serif;color:#18384A;\">\n    <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"background:#f4f1ec;padding:40px 16px;\">\n        <tr>\n            <td align=\"center\">\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"max-width:560px;background:#ffffff;border-radius:28px;overflow:hidden;border:1px solid #ece7df;box-shadow:0 18px 45px rgba(24,56,74,0.12);\">\n                    <tr>\n                        <td style=\"padding:42px 40px 24px;\">\n                            <div style=\"font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#C95F52;font-weight:700;text-align:center;\">\n                                Guardiana Editora\n                            </div>\n\n                            <h1 style=\"margin:22px 0 0;font-size:24px;line-height:1.2;color:#18384A;text-align:center;\">\n                                Novo contato recebido\n                            </h1>\n\n                            <div style=\"margin:24px 0 0;font-size:15px;line-height:1.7;color:#526173;\">\n                                <p style=\"margin:0;\"><strong>Nome:</strong> " + name + "</p>\n                                <p style=\"margin:8px 0 0;\"><strong>E-mail:</strong> " + email + "</p>\n                            </div>\n                        </td>\n                    </tr>\n\n                    <tr>\n                        <td style=\"padding:0 40px 10px;\">\n                            <div style=\"background:#f8f6f2;border-radius:12px;padding:24px;font-size:15px;line-height:1.7;color:#526173;white-space:pre-wrap;\">\n                                <strong>Mensagem:</strong><br><br>" + message.replace(/\n/g, '<br>') + "\n                            </div>\n                        </td>\n                    </tr>\n\n                    <tr>\n                        <td style=\"background:#f8f6f2;padding:24px 40px;text-align:center;border-top:1px solid #ece7df;\">\n                            <p style=\"margin:0;font-size:12px;line-height:1.6;color:#87909c;\">\n                                Este e-mail foi enviado automaticamente pelo formulário do site.\n                            </p>\n                            <p style=\"margin:8px 0 0;font-size:12px;color:#87909c;\">\n                                © Guardiana Editora\n                            </p>\n                        </td>\n                    </tr>\n                </table>\n            </td>\n        </tr>\n    </table>\n</body>\n</html>";
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