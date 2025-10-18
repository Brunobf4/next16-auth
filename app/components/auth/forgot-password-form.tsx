
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { requestPasswordResetAction } from '@/app/actions/auth.actions'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setSuccess(false)

        try {
            const result = await requestPasswordResetAction({ email })

            if (!result.success) {
                setError(result.message)
                return
            }

            setSuccess(true)
        } catch (err) {
            setError('Ocorreu um erro ao processar sua solicitação')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <h3 className="text-sm font-medium text-green-800 mb-1">
                        Email enviado!
                    </h3>
                    <p className="text-sm text-green-700">
                        Se o email existir em nosso sistema, você receberá instruções para redefinir sua senha.
                    </p>
                </div>
                <Link href="/login">
                    <Button variant="outline" className="w-full">
                        Voltar para login
                    </Button>
                </Link>
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

            <div className="text-sm text-gray-600 mb-4">
                Digite seu email e enviaremos instruções para redefinir sua senha.
            </div>

            <Input
                type="email"
                label="Email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
                Enviar instruções
            </Button>

            <Link href="/login">
                <Button variant="ghost" className="w-full">
                    Voltar para login
                </Button>
            </Link>
        </form>
    )
}