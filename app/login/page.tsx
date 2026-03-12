"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, ArrowLeft, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 3 * 60 * 1000 // 3 minutos en milisegundos

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null)
  const [remainingTime, setRemainingTime] = useState<string>("")

  useEffect(() => {
    const storedAttempts = localStorage.getItem("loginAttempts")
    const storedLockoutEnd = localStorage.getItem("lockoutEndTime")

    if (storedAttempts) {
      setLoginAttempts(Number.parseInt(storedAttempts))
    }

    if (storedLockoutEnd) {
      const lockoutEnd = Number.parseInt(storedLockoutEnd)
      const now = Date.now()

      if (now < lockoutEnd) {
        setIsLocked(true)
        setLockoutEndTime(lockoutEnd)
      } else {
        // El bloqueo expiró, limpiar
        localStorage.removeItem("loginAttempts")
        localStorage.removeItem("lockoutEndTime")
      }
    }
  }, [])

  useEffect(() => {
    if (!isLocked || !lockoutEndTime) return

    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = lockoutEndTime - now

      if (remaining <= 0) {
        setIsLocked(false)
        setLockoutEndTime(null)
        setLoginAttempts(0)
        localStorage.removeItem("loginAttempts")
        localStorage.removeItem("lockoutEndTime")
        setRemainingTime("")
      } else {
        const minutes = Math.floor(remaining / 60000)
        const seconds = Math.floor((remaining % 60000) / 1000)
        setRemainingTime(`${minutes}:${seconds.toString().padStart(2, "0")}`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isLocked, lockoutEndTime])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLocked) {
      toast({
        title: "Cuenta temporalmente bloqueada",
        description: `Demasiados intentos fallidos. Intenta nuevamente en ${remainingTime}`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        localStorage.removeItem("loginAttempts")
        localStorage.removeItem("lockoutEndTime")
        setLoginAttempts(0)

        toast({
          title: "Inicio de sesión exitoso",
          description: "Redirigiendo al dashboard...",
        })

        window.location.href = "/dashboard"
      } else {
        throw new Error("No se pudo autenticar el usuario")
      }
    } catch (error: any) {
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      localStorage.setItem("loginAttempts", newAttempts.toString())

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_DURATION
        setIsLocked(true)
        setLockoutEndTime(lockoutEnd)
        localStorage.setItem("lockoutEndTime", lockoutEnd.toString())

        toast({
          title: "Cuenta bloqueada temporalmente",
          description: `Demasiados intentos fallidos. Intenta nuevamente en 3 minutos.`,
          variant: "destructive",
        })
      } else {
        const attemptsRemaining = MAX_LOGIN_ATTEMPTS - newAttempts
        toast({
          title: "Error al iniciar sesión",
          description: `Credenciales incorrectas. Te quedan ${attemptsRemaining} ${attemptsRemaining === 1 ? "intento" : "intentos"}.`,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
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

        {isLocked && (
          <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive/50 rounded-lg flex items-start gap-3 animate-fade-in">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-destructive">Cuenta temporalmente bloqueada</p>
              <p className="text-sm text-destructive/80 mt-1">
                Demasiados intentos fallidos. Podrás intentar nuevamente en {remainingTime}
              </p>
            </div>
          </div>
        )}

        <Card className="border-2 border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-gray-200/50 animate-fade-in-up [animation-delay:200ms] hover:shadow-3xl transition-shadow duration-500">
          <CardHeader className="space-y-3 text-center pb-8">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Bienvenido
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Ingresa tus credenciales para acceder a la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
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
                  disabled={isLocked}
                  className="h-12 text-base border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-gray-300 bg-white disabled:opacity-50"
                />
              </div>
              <div className="space-y-2 animate-fade-in-up [animation-delay:500ms]">
                <Label htmlFor="password" className="text-base font-medium text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLocked}
                    className="h-12 text-base border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-gray-300 bg-white disabled:opacity-50 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLocked}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {loginAttempts > 0 && loginAttempts < MAX_LOGIN_ATTEMPTS && !isLocked && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  <p className="font-medium">Intentos restantes: {MAX_LOGIN_ATTEMPTS - loginAttempts}</p>
                  <p className="text-xs mt-1">
                    Después de {MAX_LOGIN_ATTEMPTS} intentos fallidos, tu cuenta será bloqueada temporalmente.
                  </p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-12 text-base rounded-full font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up [animation-delay:600ms] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={isLoading || isLocked}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesión...
                  </span>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
            <div className="mt-4 text-center animate-fade-in-up [animation-delay:650ms]">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-accent font-medium hover:underline transition-colors duration-300"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="mt-6 text-center animate-fade-in-up [animation-delay:700ms]">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/auth/sign-up"
                  className="text-primary hover:text-accent font-semibold hover:underline transition-colors duration-300"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center animate-fade-in-up [animation-delay:800ms]">
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
