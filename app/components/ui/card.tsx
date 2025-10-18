import { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            {children}
        </div>
    )
}

export function CardHeader({ children, className = '' }: CardProps) {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    )
}

export function CardTitle({ children, className = '' }: CardProps) {
    return (
        <h2 className={`text-2xl font-bold text-gray-900 ${className}`}>
            {children}
        </h2>
    )
}

export function CardDescription({ children, className = '' }: CardProps) {
    return (
        <p className={`text-sm text-gray-600 mt-1 ${className}`}>
            {children}
        </p>
    )
}

export function CardContent({ children, className = '' }: CardProps) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}