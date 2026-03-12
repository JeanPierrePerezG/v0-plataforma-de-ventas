"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, TrendingUp, Users, FileText, LogOut, Menu, Tag, UserCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Registrar Venta", href: "/dashboard/nueva-venta", icon: TrendingUp },
  { name: "Historial de Ventas", href: "/dashboard/ventas", icon: FileText },
  { name: "Clientes", href: "/dashboard/clientes", icon: Users },
  { name: "Categorías", href: "/dashboard/categorias", icon: Tag },
  { name: "Mi Perfil", href: "/dashboard/perfil", icon: UserCircle },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error signing out:", error)
    } else {
      router.push("/")
    }
  }

  const updateUserName = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const name = user?.user_metadata?.full_name || user?.email || null
    setUserName(name)
  }

  useEffect(() => {
    updateUserName()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const name = session?.user?.user_metadata?.full_name || session?.user?.email || null
      setUserName(name)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      updateUserName()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("userProfileUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userProfileUpdated", handleStorageChange)
    }
  }, [])

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-card/95 backdrop-blur">
                <div className="flex items-center gap-3 mb-10">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-bold">VentasPro</h2>
                </div>
                <nav className="flex flex-col gap-2">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold hidden sm:block">Plataforma para gestionar ventas</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 text-black bg-card border border-primary shadow-lg rounded-md">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">{userName?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium">{userName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-xl">
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-8 flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-28 flex flex-col gap-2 p-4 rounded-2xl bg-card/50 backdrop-blur border border-border/50">
            <NavLinks />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
