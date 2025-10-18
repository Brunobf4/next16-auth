import { auth, signOut } from '@/lib/next-auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'

export default async function DashboardPage() {
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
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Card de boas-vindas */}
                    <Card className="md:col-span-2 lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Bem-vindo, {session.user.name}! 👋</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Email: {session.user.email}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Esta é sua área protegida. Apenas usuários autenticados podem acessar esta página.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Cards de exemplo */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Estatísticas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">0</div>
                            <p className="text-sm text-gray-600 mt-1">Total de itens</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Atividade</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">0</div>
                            <p className="text-sm text-gray-600 mt-1">Ações recentes</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notificações</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600">0</div>
                            <p className="text-sm text-gray-600 mt-1">Não lidas</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}