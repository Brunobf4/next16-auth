export interface RegisterInput {
    name: string
    email: string
    password: string
}

export interface LoginInput {
    email: string
    password: string
}

export interface ResetPasswordInput {
    email: string
}

export interface ConfirmResetPasswordInput {
    token: string
    password: string
}

export interface AuthResponse {
    success: boolean
    message: string
    data?: any
    error?: string
}

