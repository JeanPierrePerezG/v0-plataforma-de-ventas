"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, ArrowLeft, Lock, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasRecoverySession, setHasRecoverySession] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  useEffect(() => {
    const checkRecoverySession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setHasRecoverySession(!!session)
      } catch (error) {
        console.error("Error checking session:", error)
        setHasRecoverySession(false)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkRecoverySession()
  }, [])

  useEffect(() => {
    setPasswordStrength({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    })
  }, [password])

  const isPasswordValid = Object.values(passwordStrength).every((v) => v)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isPasswordValid) {
      toast({
        title: "Contraseña no válida",
        description: "La contraseña debe cumplir con todos los requisitos de seguridad",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Por favor verifica que ambas contraseñas sean iguales",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido restablecida exitosamente",
      })

      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Error al restablecer contraseña",
        description: error.message || "No se pudo actualizar la contraseña",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (!hasRecoverySession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.08),transparent_50%)]" />

        <div className="w-full max-w-md relative z-10">
          <Card className="border-2 border-red-200/50 bg-white/80 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-3 text-center pb-8">
              <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Enlace No Válido</CardTitle>
              <CardDescription className="text-base text-gray-600">
                No se detectó una sesión de recuperación válida
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
                <p className="text-sm text-amber-900">
                  <strong>¿Qué hacer?</strong>
                </p>
                <ol className="text-sm text-amber-800 space-y-2 list-decimal list-inside">
                  <li>Revisa tu correo y busca el enlace de recuperación</li>
                  <li>
                    Copia el enlace <strong>completo</strong> del correo (debe incluir un token largo)
                  </li>
                  <li>
                    Pégalo en la barra de direcciones de <strong>esta misma ventana</strong> del navegador
                  </li>
                  <li>Si el problema persiste, solicita un nuevo enlace de recuperación</li>
                </ol>
              </div>
              <div className="space-y-3">
                <Link href="/auth/forgot-password">
                  <Button className="w-full h-12 text-base rounded-full font-semibold">Solicitar nuevo enlace</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full h-12 text-base rounded-full font-semibold bg-transparent">
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-black">
            VentasPro
          </h1>
        </Link>

        <Card className="border-2 border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-gray-200/50 animate-fade-in-up [animation-delay:200ms]">
          <CardHeader className="space-y-3 text-center pb-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Nueva Contraseña
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2 animate-fade-in-up [animation-delay:400ms]">
                <Label htmlFor="password" className="text-base font-medium text-gray-700">
                  Nueva Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-gray-300 bg-white"
                />
              </div>

              <div className="space-y-2 animate-fade-in-up [animation-delay:500ms]">
                <Label htmlFor="confirmPassword" className="text-base font-medium text-gray-700">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 text-base border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-gray-300 bg-white"
                />
              </div>

              {password && (
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in-up [animation-delay:600ms]">
                  <p className="text-sm font-medium text-gray-700 mb-2">Requisitos de contraseña:</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      {passwordStrength.minLength ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={passwordStrength.minLength ? "text-green-700" : "text-gray-600"}>
                        Mínimo 8 caracteres
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {passwordStrength.hasUpperCase ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={passwordStrength.hasUpperCase ? "text-green-700" : "text-gray-600"}>
                        Al menos una mayúscula
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {passwordStrength.hasNumber ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={passwordStrength.hasNumber ? "text-green-700" : "text-gray-600"}>
                        Al menos un número
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {passwordStrength.hasSpecialChar ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={passwordStrength.hasSpecialChar ? "text-green-700" : "text-gray-600"}>
                        Al menos un símbolo especial
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base rounded-full font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up [animation-delay:700ms]"
                disabled={isLoading || !isPasswordValid}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Actualizando...
                  </span>
                ) : (
                  "Restablecer contraseña"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center animate-fade-in-up [animation-delay:800ms]">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium hover:underline transition-colors duration-300"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center animate-fade-in-up [animation-delay:900ms]">
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
