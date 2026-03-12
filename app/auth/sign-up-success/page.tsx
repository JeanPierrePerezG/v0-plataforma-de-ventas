import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_70%)]" />
      <div className="absolute top-20 left-20 h-72 w-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 h-72 w-72 bg-accent/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-12 group">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
            <BarChart3 className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">VentasPro</h1>
        </Link>

        <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-3xl font-bold">¡Gracias por registrarte!</CardTitle>
            <CardDescription className="text-base">
              Verifica tu correo electrónico para confirmar tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Te hemos enviado un correo electrónico con un enlace de confirmación. Por favor revisa tu bandeja de
              entrada y haz clic en el enlace para activar tu cuenta antes de iniciar sesión.
            </p>
            <div className="mt-6 text-center">
              <Link href="/login" className="text-primary hover:underline font-medium">
                Ir a iniciar sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
