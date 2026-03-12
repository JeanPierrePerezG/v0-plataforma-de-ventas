"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const redirectUrl = `${window.location.origin}/auth/callback?next=/auth/reset-password`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (error) throw error

      setEmailSent(true)
      toast({
        title: "Correo enviado",
        description: "Revisa tu bandeja de entrada para restablecer tu contraseña",
      })
    } catch (error: any) {
      toast({
        title: "Error al enviar correo",
        description: error.message || "No se pudo enviar el correo de recuperación",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.08),transparent_50%)]" />
        <div className="absolute top-20 left-20 h-96 w-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 h-96 w-96 bg-accent/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

        <div className="w-full max-w-md relative z-10">
          <Card className="border-2 border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-gray-200/50 animate-fade-in">
            <CardHeader className="space-y-3 text-center pb-8">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Correo Enviado</CardTitle>
              <CardDescription className="text-base text-gray-600">
                Hemos enviado un enlace de recuperación a tu correo electrónico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                <p className="text-sm text-blue-900">
                  <strong>Instrucciones importantes:</strong>
                </p>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Revisa tu bandeja de entrada (y carpeta de spam)</li>
                  <li>Haz clic en el enlace del correo</li>
                  <li>
                    <strong>Si ves un error de conexión:</strong> Copia el enlace completo del correo y pégalo en esta
                    misma ventana del navegador donde tienes abierta la aplicación
                  </li>
                </ol>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900 mb-3">
                  <strong>Alternativa rápida:</strong>
                </p>
                <p className="text-sm text-amber-800 mb-3">
                  Si ya recibiste el correo, puedes ir directamente a la página de restablecimiento:
                </p>
                <Link href="/auth/reset-password">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ir a restablecer contraseña
                  </Button>
                </Link>
                <p className="text-xs text-amber-700 mt-2">Nota: Necesitarás el enlace del correo para autenticarte</p>
              </div>
              {/* Fin del cambio */}
              <div className="text-center">
                <Link href="/login">
                  <Button className="w-full h-12 text-base rounded-full font-semibold">
                    Volver al inicio de sesión
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.08),transparent_50%)]" />
      <div className="absolute top-20 left-20 h-96 w-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 h-96 w-96 bg-accent/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-3 mb-12 group animate-fade-in text-black">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/20">
            <BarChart3 className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            VentasPro
          </h1>
        </Link>

        <Card className="border-2 border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-gray-200/50 animate-fade-in-up [animation-delay:200ms]">
          <CardHeader className="space-y-3 text-center pb-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Recuperar Contraseña
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2 animate-fade-in-up [animation-delay:400ms]">
                <Label htmlFor="email" className="text-base font-medium text-gray-700">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-gray-300 bg-white"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base rounded-full font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up [animation-delay:500ms]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  "Enviar enlace de recuperación"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center animate-fade-in-up [animation-delay:600ms]">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium hover:underline transition-colors duration-300"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center animate-fade-in-up [animation-delay:700ms]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-all duration-300 hover:gap-3 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
