
'use server'

import { AuthService } from '@/lib/services/auth.service'
import { signIn } from '@/lib/next-auth'
import { AuthError } from 'next-auth'
import type {
    RegisterInput,
    LoginInput,
    ResetPasswordInput,
    ConfirmResetPasswordInput,
} from '@/lib/types/auth.types'

export async function registerAction(data: RegisterInput) {
    return await AuthService.register(data)
}

export async function loginAction(data: LoginInput) {
    const result = await AuthService.login(data)

    if (result.success) {
        try {
            await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })
        } catch (error) {
            if (error instanceof AuthError) {
                return {
                    success: false,
                    message: 'Erro ao autenticar',
                }
            }
            throw error
        }
    }

    return result
}

export async function requestPasswordResetAction(data: ResetPasswordInput) {
    return await AuthService.requestPasswordReset(data)
}

export async function confirmPasswordResetAction(data: ConfirmResetPasswordInput) {
    return await AuthService.confirmPasswordReset(data)
}