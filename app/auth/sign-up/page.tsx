"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, ArrowLeft, Check, X, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

const validatePassword = (password: string) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const isValid = Object.values(requirements).every(Boolean)
  return { isValid, requirements }
}

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordValidation = validatePassword(password)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordValidation.isValid) {
      toast({
        title: "Contraseña no válida",
        description: "La contraseña debe cumplir con todos los requisitos de seguridad",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            name: name,
          },
        },
      })

      if (error) throw error

      toast({
        title: "Cuenta creada exitosamente",
        description: "Por favor verifica tu correo electrónico para confirmar tu cuenta",
      })

      router.push("/auth/sign-up-success")
    } catch (error: any) {
      toast({
        title: "Error al crear cuenta",
        description: error.message || "Intenta nuevamente",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

        {/* Sign Up Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-3xl font-bold">Crear Cuenta</CardTitle>
            <CardDescription className="text-base">Regístrate para comenzar a gestionar tus ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setShowPasswordRequirements(true)}
                    required
                    className="h-12 text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {showPasswordRequirements && (
                  <div className="mt-3 p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                    <p className="font-medium text-foreground mb-2">La contraseña debe contener:</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {passwordValidation.requirements.minLength ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span
                          className={
                            passwordValidation.requirements.minLength ? "text-green-600" : "text-muted-foreground"
                          }
                        >
                          Mínimo 8 caracteres
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordValidation.requirements.hasUpperCase ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span
                          className={
                            passwordValidation.requirements.hasUpperCase ? "text-green-600" : "text-muted-foreground"
                          }
                        >
                          Al menos una mayúscula
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordValidation.requirements.hasNumber ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span
                          className={
                            passwordValidation.requirements.hasNumber ? "text-green-600" : "text-muted-foreground"
                          }
                        >
                          Al menos un número
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordValidation.requirements.hasSpecialChar ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span
                          className={
                            passwordValidation.requirements.hasSpecialChar ? "text-green-600" : "text-muted-foreground"
                          }
                        >
                          Al menos un símbolo (!@#$%^&*...)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base">
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-base rounded-full" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
