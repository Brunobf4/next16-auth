
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { confirmPasswordResetAction } from '@/app/actions/auth.actions'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'

export function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    })

    if (!token) {
        return (
            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">Token inválido ou ausente</p>
                </div>
                <Link href="/forgot-password">
                    <Button variant="outline" className="w-full">
                        Solicitar novo link
                    </Button>
                </Link>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem')
            setIsLoading(false)
            return
        }

        try {
            const result = await confirmPasswordResetAction({
                token,
                password: formData.password,
            })

            if (!result.success) {
                setError(result.message)
                return
            }

            setSuccess(true)
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (err) {
            setError('Ocorreu um erro ao redefinir sua senha')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <h3 className="text-sm font-medium text-green-800 mb-1">
                        Senha redefinida!
                    </h3>
                    <p className="text-sm text-green-700">
                        Sua senha foi alterada com sucesso. Redirecionando para o login...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            <Input
                type="password"
                label="Nova senha"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
            />

            <Input
                type="password"
                label="Confirmar nova senha"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
            />

            <div className="text-xs text-gray-600">
                A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números.
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
                Redefinir senha
            </Button>
        </form>
    )
}