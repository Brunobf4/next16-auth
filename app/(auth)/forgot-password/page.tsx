import { ForgotPasswordForm } from '@/app/components/auth/forgot-password-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Esqueceu sua senha?</CardTitle>
                        <CardDescription>
                            Não se preocupe, vamos ajudá-lo a recuperá-la
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ForgotPasswordForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}