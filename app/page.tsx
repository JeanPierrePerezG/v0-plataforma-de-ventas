import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, TrendingUp, FileText, Clock, Shield, ArrowRight, CheckCircle2, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50 animate-fade-in">
        <div className="container mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">VentasApp</span>
          </div>
          <Link href="/login">
            <Button
              size="lg"
              className="rounded-full px-6 h-11 font-medium border hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2 animate-fade-in-up">
            <Zap className="h-4 w-4" />
            Gestión inteligente de ventas
          </div>
          <h1 className="text-6xl lg:text-8xl font-bold tracking-tight text-balance leading-[1.1] animate-fade-in-up animation-delay-100">
            Gestiona tus ventas de forma{" "}
            <span className="text-primary bg-gradient-to-r from-primary via-accent to-primary bg-clip-text animate-gradient">
              profesional
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed animate-fade-in-up animation-delay-200">
            Plataforma completa para registrar, analizar y optimizar tus procesos de venta con datos en tiempo real
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in-up animation-delay-300">
            <Link href="/login">
              <Button
                size="lg"
                className="text-lg px-10 py-7 rounded-full h-auto font-semibold ring-2 ring-offset-4 ring-primary/20 hover:ring-primary/40 hover:scale-105 transition-all duration-300 my-0 mx-0 border border-primary-foreground shadow-none"
              >
                Comenzar ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-8 py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Todo lo que necesitas en un solo lugar</h2>
            <p className="text-xl text-muted-foreground text-pretty">Herramientas poderosas para impulsar tu negocio</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card animate-fade-in-up animation-delay-100">
              <CardHeader className="space-y-4 pb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Dashboard en tiempo real</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Visualiza tus KPIs más importantes actualizados al instante con gráficos interactivos
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card animate-fade-in-up animation-delay-200">
              <CardHeader className="space-y-4 pb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Registro de ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Registra nuevas ventas de forma rápida con toda la información del cliente y transacción
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card animate-fade-in-up animation-delay-300">
              <CardHeader className="space-y-4 pb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Gestión de clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Base de datos completa de clientes con historial de compras y datos de contacto
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card animate-fade-in-up animation-delay-400">
              <CardHeader className="space-y-4 pb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Historial completo</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Accede al historial de todas las ventas con filtros avanzados y búsqueda rápida
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card animate-fade-in-up animation-delay-500">
              <CardHeader className="space-y-4 pb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Análisis de rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Identifica tendencias y oportunidades con métricas detalladas de rendimiento
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card animate-fade-in-up animation-delay-600">
              <CardHeader className="space-y-4 pb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Seguro y confiable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Tus datos protegidos con las mejores prácticas de seguridad y respaldos automáticos
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-8 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Por qué elegir VentasApp</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4 animate-slide-in-left animation-delay-100">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fácil de usar</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Interfaz intuitiva que no requiere capacitación. Comienza a usar la plataforma en minutos
                </p>
              </div>
            </div>
            <div className="flex gap-4 animate-slide-in-right animation-delay-200">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Datos en tiempo real</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Información actualizada al instante para tomar decisiones informadas rápidamente
                </p>
              </div>
            </div>
            <div className="flex gap-4 animate-slide-in-left animation-delay-300">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Acceso desde cualquier lugar</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Gestiona tu negocio desde cualquier dispositivo con conexión a internet
                </p>
              </div>
            </div>
            <div className="flex gap-4 animate-slide-in-right animation-delay-400">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Reportes detallados</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Genera reportes completos con métricas clave para analizar tu rendimiento
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-8 py-24">
        <div className="max-w-4xl mx-auto text-center bg-primary/5 rounded-3xl p-12 lg:p-16 border border-primary/10 animate-scale-in hover:scale-105 transition-transform duration-300">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">Comienza a optimizar tus ventas hoy</h2>
          <p className="text-xl text-muted-foreground mb-10 text-pretty leading-relaxed max-w-2xl mx-auto">
            Únete a la plataforma y lleva tu gestión de ventas al siguiente nivel
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="text-lg px-10 py-7 rounded-full h-auto font-semibold hover:scale-105 transition-transform duration-300"
            >
              Acceder a la plataforma
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/50 mt-12 animate-fade-in">
        <div className="container mx-auto px-6 lg:px-8 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">VentasApp</span>
          </div>
          <p className="text-sm text-muted-foreground">2025  </p>
        </div>
      </footer>
    </div>
  )
}
