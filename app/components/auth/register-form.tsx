'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerAction } from '@/app/actions/auth.actions'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'

export function RegisterForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        // Validar senha
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem')
            setIsLoading(false)
            return
        }

        try {
            const result = await registerAction({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            })

            if (!result.success) {
                setError(result.message)
                return
            }

            // Redirecionar para login após registro bem-sucedido
            router.push('/login?registered=true')
        } catch (err) {
            setError('Ocorreu um erro ao criar sua conta')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            <Input
                type="text"
                label="Nome completo"
                placeholder="João Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />

            <Input
                type="email"
                label="Email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />

            <Input
                type="password"
                label="Senha"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
            />

            <Input
                type="password"
                label="Confirmar senha"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
            />

            <div className="text-xs text-gray-600">
                A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números.
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
                Criar conta
            </Button>

            <p className="text-center text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Faça login
                </Link>
            </p>
        </form>
    )
}