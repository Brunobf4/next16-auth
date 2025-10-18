
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export class PasswordUtils {
    /**
     * Hash de uma senha
     */
    static async hash(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS)
    }

    /**
     * Verifica se a senha corresponde ao hash
     */
    static async verify(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword)
    }

    /**
     * Valida força da senha
     */
    static validate(password: string): { valid: boolean; message?: string } {
        if (password.length < 8) {
            return { valid: false, message: 'A senha deve ter no mínimo 8 caracteres' }
        }

        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumbers = /\d/.test(password)

        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            return {
                valid: false,
                message: 'A senha deve conter letras maiúsculas, minúsculas e números'
            }
        }

        return { valid: true }
    }
}