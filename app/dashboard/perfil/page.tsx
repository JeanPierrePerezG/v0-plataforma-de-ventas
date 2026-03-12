"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { User, Mail, Lock, Loader2, Shield } from "lucide-react"

export default function PerfilPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userId, setUserId] = useState("")

  const [email, setEmail] = useState("")
  const [nombre, setNombre] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      setUserEmail(user.email || "")
      setUserId(user.id)
      setEmail(user.email || "")
      setNombre(user.user_metadata?.full_name || "")
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (email !== userEmail) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email,
        })

        if (emailError) throw emailError

        toast({
          title: "Correo actualizado",
          description: "Se ha enviado un correo de confirmación a tu nueva dirección.",
        })
      }

      const { error: metadataError } = await supabase.auth.updateUser({
        data: { full_name: nombre },
      })

      if (metadataError) throw metadataError

      toast({
        title: "Perfil actualizado",
        description: "Tus datos se han actualizado correctamente.",
      })

      window.dispatchEvent(new Event("userProfileUpdated"))

      loadUserData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el perfil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      })
      return
    }

    setLoadingPassword(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña se ha cambiado correctamente.",
      })

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar la contraseña",
        variant: "destructive",
      })
    } finally {
      setLoadingPassword(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">Mi Perfil</h2>
          <p className="text-lg text-muted-foreground mt-2">
            Gestiona tu información personal y preferencias de cuenta
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información del Perfil */}
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                Información del Perfil
              </CardTitle>
              <CardDescription className="text-base">Actualiza tu nombre y correo electrónico</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-sm font-medium">
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="rounded-xl border-border/50 focus:border-primary transition-colors h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border-border/50 focus:border-primary transition-colors h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Cambiar Contraseña */}
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur hover:shadow-lg hover:shadow-chart-3/5 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="h-10 w-10 rounded-xl bg-chart-3/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-chart-3" />
                </div>
                Cambiar Contraseña
              </CardTitle>
              <CardDescription className="text-base">
                Actualiza tu contraseña para mantener tu cuenta segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    Nueva Contraseña
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="rounded-xl border-border/50 focus:border-chart-3 transition-colors h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmar Contraseña
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl border-border/50 focus:border-chart-3 transition-colors h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl h-11 bg-chart-3 hover:bg-chart-3/90 shadow-lg shadow-chart-3/20"
                  disabled={loadingPassword}
                >
                  {loadingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cambiando...
                    </>
                  ) : (
                    "Cambiar Contraseña"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Información de la cuenta */}
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur hover:shadow-lg hover:shadow-chart-4/5 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="h-10 w-10 rounded-xl bg-chart-4/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-chart-4" />
              </div>
              Información de la Cuenta
            </CardTitle>
            <CardDescription className="text-base">Detalles de tu cuenta:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Nombre Actual</p>
                  <p className="text-sm text-muted-foreground">{nombre || "No configurado"}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Correo Actual</p>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
