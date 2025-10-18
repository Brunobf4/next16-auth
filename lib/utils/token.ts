export class TokenUtils {
    /**
     * Gera um token aleatório usando Web Crypto API (compatível com Edge Runtime)
     */
    static generate(length: number = 32): string {
        const array = new Uint8Array(length)
        crypto.getRandomValues(array)

        // Converter para hex string
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    }

    /**
     * Cria uma data de expiração
     */
    static getExpirationDate(hours: number = 1): Date {
        const date = new Date()
        date.setHours(date.getHours() + hours)
        return date
    }

    /**
     * Verifica se o token expirou
     */
    static isExpired(expirationDate: Date): boolean {
        return new Date() > expirationDate
    }
}