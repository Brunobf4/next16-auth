import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import "./globals.css"

export const metadata: Metadata = {
    title: "NextAuth App - Autenticação Completa",
    description: "Sistema de autenticação com NextAuth, Prisma e PostgreSQL",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="pt-BR">
        <body>
        <SessionProvider>
            {children}
        </SessionProvider>
        </body>
        </html>
    )
}