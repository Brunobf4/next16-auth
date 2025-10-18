import { auth, signOut } from '@/lib/next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="ghost">← Voltar</Button>
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
                        </div>
                        <form
                            action={async () => {
                                'use server'
                                await signOut({ redirectTo: '/login' })
                            }}
                        >
                            <Button type="submit" variant="outline">
                                Sair
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Informações do Perfil */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Pessoais</CardTitle>
                            <CardDescription>
                                Seus dados cadastrados no sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || 'Avatar'}
                                        className="w-20 h-20 rounded-full"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-semibold">{session.user.name}</h3>
                                    <p className="text-gray-600">{session.user.email}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Nome</label>
                                    <p className="mt-1 text-gray-900">{session.user.name || 'Não informado'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <p className="mt-1 text-gray-900">{session.user.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">ID do Usuário</label>
                                    <p className="mt-1 text-gray-900 font-mono text-sm">{session.user.id}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ações */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações da Conta</CardTitle>
                            <CardDescription>
                                Gerencie sua conta e preferências
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                                Editar Perfil
                            </Button>
                            <Link href="/forgot-password" className="block">
                                <Button variant="outline" className="w-full justify-start">
                                    Alterar Senha
                                </Button>
                            </Link>
                            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                                Excluir Conta
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}