import { prisma } from '@/lib/prisma'
import { PasswordUtils } from '@/lib/utils/password'
import { TokenUtils } from '@/lib/utils/token'
import { EmailService } from '@/lib/utils/email'
import type {
    RegisterInput,
    LoginInput,
    ResetPasswordInput,
    ConfirmResetPasswordInput,
    AuthResponse,
} from '@/lib/types/auth.types'

export class AuthService {
    /**
     * Registra um novo usuário
     */
    static async register(input: RegisterInput): Promise<AuthResponse> {
        try {
            const { name, email, password } = input

            // Validar entrada
            if (!email || !password || !name) {
                return {
                    success: false,
                    message: 'Todos os campos são obrigatórios',
                }
            }

            // Validar força da senha
            const passwordValidation = PasswordUtils.validate(password)
            if (!passwordValidation.valid) {
                return {
                    success: false,
                    message: passwordValidation.message || 'Senha inválida',
                }
            }

            // Verificar se o email já existe
            const existingUser = await prisma.user.findUnique({
                where: { email },
            })

            if (existingUser) {
                return {
                    success: false,
                    message: 'Este email já está cadastrado',
                }
            }

            // Hash da senha
            const hashedPassword = await PasswordUtils.hash(password)

            // Criar usuário
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                },
            })

            return {
                success: true,
                message: 'Usuário registrado com sucesso',
                data: user,
            }
        } catch (error) {
            console.error('Erro ao registrar usuário:', error)
            return {
                success: false,
                message: 'Erro ao registrar usuário',
                error: error instanceof Error ? error.message : 'Erro desconhecido',
            }
        }
    }

    /**
     * Faz login de um usuário
     */
    static async login(input: LoginInput): Promise<AuthResponse> {
        try {
            const { email, password } = input

            // Validar entrada
            if (!email || !password) {
                return {
                    success: false,
                    message: 'Email e senha são obrigatórios',
                }
            }

            // Buscar usuário
            const user = await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    image: true,
                },
            })

            if (!user || !user.password) {
                return {
                    success: false,
                    message: 'Email ou senha incorretos',
                }
            }

            // Verificar senha
            const isPasswordValid = await PasswordUtils.verify(password, user.password)

            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Email ou senha incorretos',
                }
            }

            // Retornar dados do usuário (sem a senha)
            const { password: _, ...userWithoutPassword } = user

            return {
                success: true,
                message: 'Login realizado com sucesso',
                data: userWithoutPassword,
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error)
            return {
                success: false,
                message: 'Erro ao fazer login',
                error: error instanceof Error ? error.message : 'Erro desconhecido',
            }
        }
    }

    /**
     * Solicita reset de senha
     */
    static async requestPasswordReset(input: ResetPasswordInput): Promise<AuthResponse> {
        try {
            const { email } = input

            if (!email) {
                return {
                    success: false,
                    message: 'Email é obrigatório',
                }
            }

            // Buscar usuário
            const user = await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            })

            // Por segurança, sempre retornamos sucesso mesmo se o email não existir
            if (!user) {
                return {
                    success: true,
                    message: 'Se o email existir, você receberá instruções para redefinir sua senha',
                }
            }

            // Deletar tokens antigos deste email
            await prisma.passwordResetToken.deleteMany({
                where: { email },
            })

            // Gerar novo token
            const token = TokenUtils.generate()
            const expires = TokenUtils.getExpirationDate(1) // 1 hora

            // Salvar token no banco
            await prisma.passwordResetToken.create({
                data: {
                    email,
                    token,
                    expires,
                },
            })

            // Enviar email
            const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
            await EmailService.send({
                to: email,
                subject: 'Redefinição de Senha',
                html: EmailService.getResetPasswordEmailHtml(user.name || '', resetLink),
            })

            return {
                success: true,
                message: 'Se o email existir, você receberá instruções para redefinir sua senha',
            }
        } catch (error) {
            console.error('Erro ao solicitar reset de senha:', error)
            return {
                success: false,
                message: 'Erro ao solicitar reset de senha',
                error: error instanceof Error ? error.message : 'Erro desconhecido',
            }
        }
    }

    /**
     * Confirma reset de senha
     */
    static async confirmPasswordReset(input: ConfirmResetPasswordInput): Promise<AuthResponse> {
        try {
            const { token, password } = input

            // Validar entrada
            if (!token || !password) {
                return {
                    success: false,
                    message: 'Token e senha são obrigatórios',
                }
            }

            // Validar força da senha
            const passwordValidation = PasswordUtils.validate(password)
            if (!passwordValidation.valid) {
                return {
                    success: false,
                    message: passwordValidation.message || 'Senha inválida',
                }
            }

            // Buscar token
            const resetToken = await prisma.passwordResetToken.findUnique({
                where: { token },
            })

            if (!resetToken) {
                return {
                    success: false,
                    message: 'Token inválido ou expirado',
                }
            }

            // Verificar se o token expirou
            if (TokenUtils.isExpired(resetToken.expires)) {
                await prisma.passwordResetToken.delete({
                    where: { token },
                })
                return {
                    success: false,
                    message: 'Token expirado',
                }
            }

            // Hash da nova senha
            const hashedPassword = await PasswordUtils.hash(password)

            // Atualizar senha do usuário
            await prisma.user.update({
                where: { email: resetToken.email },
                data: { password: hashedPassword },
            })

            // Deletar token usado
            await prisma.passwordResetToken.delete({
                where: { token },
            })

            return {
                success: true,
                message: 'Senha redefinida com sucesso',
            }
        } catch (error) {
            console.error('Erro ao confirmar reset de senha:', error)
            return {
                success: false,
                message: 'Erro ao redefinir senha',
                error: error instanceof Error ? error.message : 'Erro desconhecido',
            }
        }
    }

    /**
     * Busca usuário por email
     */
    static async getUserByEmail(email: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    image: true,
                    emailVerified: true,
                },
            })

            return user
        } catch (error) {
            console.error('Erro ao buscar usuário:', error)
            return null
        }
    }

    /**
     * Busca usuário por ID
     */
    static async getUserById(id: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    emailVerified: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })

            return user
        } catch (error) {
            console.error('Erro ao buscar usuário:', error)
            return null
        }
    }
}