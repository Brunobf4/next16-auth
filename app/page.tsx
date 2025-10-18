import Link from 'next/link'
import { auth } from '@/lib/next-auth'
import { Button } from '@/app/components/ui/button'

export default async function Home() {
    const session = await auth()

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <header className="container mx-auto px-4 py-6">
                <nav className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-blue-600">
                        NextAuth App
                    </div>
                    <div className="flex gap-4">
                        {session ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="outline">Dashboard</Button>
                                </Link>
                                <Link href="/profile">
                                    <Button>Perfil</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="outline">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button>Cadastrar</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Autenticação Completa com Next.js
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Sistema de autenticação completo com NextAuth, Prisma e PostgreSQL (Supabase).
                        Inclui login, registro, reset de senha e muito mais.
                    </p>

                    {session ? (
                        <div className="space-y-4">
                            <div className="p-6 bg-white rounded-lg shadow-md inline-block">
                                <p className="text-gray-700 mb-2">Bem-vindo de volta,</p>
                                <p className="text-2xl font-bold text-blue-600">{session.user.name}</p>
                            </div>
                            <div className="flex gap-4 justify-center">
                                <Link href="/dashboard">
                                    <Button size="lg">Ir para Dashboard</Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg">Começar Agora</Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" size="lg">
                                    Fazer Login
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Features */}
                <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Seguro</h3>
                        <p className="text-gray-600">
                            Autenticação segura com bcrypt, JWT e validações robustas
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Rápido</h3>
                        <p className="text-gray-600">
                            Performance otimizada com Next.js 16 e Server Actions
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Completo</h3>
                        <p className="text-gray-600">
                            Login, registro, OAuth (Google/GitHub) e reset de senha
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}