import nodemailer from 'nodemailer'

interface EmailOptions {
    to: string
    subject: string
    html: string
}

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    })

    /**
     * Envia um email
     */
    static async send({ to, subject, html }: EmailOptions): Promise<boolean> {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || 'noreply@example.com',
                to,
                subject,
                html,
            })
            return true
        } catch (error) {
            console.error('Erro ao enviar email:', error)
            return false
        }
    }

    /**
     * Template de email de verificação
     */
    static getVerificationEmailHtml(name: string, verificationLink: string): string {
        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bem-vindo, ${name}!</h2>
        <p>Obrigado por se registrar. Para verificar seu email, clique no link abaixo:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
          Verificar Email
        </a>
        <p>Ou copie e cole este link no seu navegador:</p>
        <p>${verificationLink}</p>
        <p>Este link expira em 24 horas.</p>
      </div>
    `
    }

    /**
     * Template de email de reset de senha
     */
    static getResetPasswordEmailHtml(name: string, resetLink: string): string {
        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Redefinição de Senha</h2>
        <p>Olá${name ? `, ${name}` : ''}!</p>
        <p>Recebemos uma solicitação para redefinir sua senha. Clique no link abaixo:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">
          Redefinir Senha
        </a>
        <p>Ou copie e cole este link no seu navegador:</p>
        <p>${resetLink}</p>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou esta alteração, ignore este email.</p>
      </div>
    `
    }
}