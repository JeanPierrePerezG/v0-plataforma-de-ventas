"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getClientes, getVentas, updateCliente, type Cliente } from "@/lib/data-store"
import { Search, Mail, Phone, Building2, Calendar, TrendingUp, Edit, FileDown } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { exportClientesToPDF } from "@/lib/export-utils"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [clienteStats, setClienteStats] = useState<Record<string, any>>({})
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [editForm, setEditForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadClientes()
  }, [])

  useEffect(() => {
    filterClientes()
  }, [clientes, searchTerm])

  const loadClientes = async () => {
    try {
      const data = await getClientes()
      setClientes(Array.isArray(data) ? data : [])

      const stats: Record<string, any> = {}
      for (const cliente of Array.isArray(data) ? data : []) {
        stats[cliente.id] = await getClienteStats(cliente.id)
      }
      setClienteStats(stats)
    } catch (error) {
      console.error("[v0] Error loading clientes:", error)
      setClientes([])
    }
  }

  const filterClientes = () => {
    if (!searchTerm) {
      setFilteredClientes(clientes)
      return
    }

    const filtered = clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.empresa?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredClientes(filtered)
  }

  const getClienteStats = async (clienteId: string) => {
    try {
      const ventas = await getVentas()
      const ventasArray = Array.isArray(ventas) ? ventas : []
      const ventasCliente = ventasArray.filter((v) => v.cliente_id === clienteId)
      const ventasCompletadas = ventasCliente.filter((v) => v.estado === "completada")
      const totalGastado = ventasCompletadas.reduce((sum, v) => sum + v.monto, 0)

      return {
        totalVentas: ventasCliente.length,
        totalGastado,
        ultimaCompra: ventasCliente.length > 0 ? ventasCliente[ventasCliente.length - 1].fecha : null,
      }
    } catch (error) {
      console.error("[v0] Error getting cliente stats:", error)
      return {
        totalVentas: 0,
        totalGastado: 0,
        ultimaCompra: null,
      }
    }
  }

  const getInitials = (nombre: string) => {
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleEditClick = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setEditForm({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      empresa: cliente.empresa || "",
    })
  }

  const handleSaveChanges = async () => {
    if (!editingCliente) return

    setIsSaving(true)
    try {
      const success = await updateCliente(editingCliente.id, editForm)
      if (success) {
        await loadClientes()
        setEditingCliente(null)
      } else {
        alert("Error al actualizar el cliente")
      }
    } catch (error) {
      console.error("[v0] Error al guardar cambios:", error)
      alert("Error al actualizar el cliente")
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportPDF = () => {
    exportClientesToPDF(filteredClientes, clienteStats)
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Clientes Registrados</h2>
              <p className="text-muted-foreground">Gestiona tu base de datos de clientes</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                className="transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              <Link href="/dashboard/nueva-venta">
                <Button className="border hover:scale-105 transition-all duration-300">Agregar Cliente</Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="animate-fade-in-up [animation-delay:100ms] hover:scale-105 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientes.length}</div>
                <p className="text-xs text-muted-foreground">clientes registrados</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up [animation-delay:200ms] hover:scale-105 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {clientes.filter((c) => clienteStats[c.id]?.totalVentas > 0).length}
                </div>
                <p className="text-xs text-muted-foreground">con compras realizadas</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up [animation-delay:300ms] hover:scale-105 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Resultados</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredClientes.length}</div>
                <p className="text-xs text-muted-foreground">clientes encontrados</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="animate-fade-in-up [animation-delay:400ms]">
            <CardHeader>
              <CardTitle>Buscar Clientes</CardTitle>
              <CardDescription>Encuentra clientes por nombre, email o empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 transition-all duration-300 focus:scale-[1.02]"
                />
              </div>
              {searchTerm && (
                <div className="mt-4 animate-fade-in">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="hover:scale-105 transition-all duration-300"
                  >
                    Limpiar búsqueda
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clients List */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredClientes.length === 0 ? (
              <Card className="md:col-span-2 animate-fade-in-up [animation-delay:500ms]">
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No se encontraron clientes</p>
                </CardContent>
              </Card>
            ) : (
              filteredClientes.map((cliente, index) => {
                const stats = clienteStats[cliente.id] || { totalVentas: 0, totalGastado: 0, ultimaCompra: null }
                return (
                  <Card
                    key={cliente.id}
                    className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${500 + index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 transition-transform duration-300 hover:scale-110">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(cliente.nombre)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg">{cliente.nombre}</CardTitle>
                          {cliente.empresa && (
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <Building2 className="h-3 w-3" />
                              {cliente.empresa}
                            </CardDescription>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(cliente)}
                          className="hover:bg-accent hover:scale-110 transition-all duration-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`mailto:${cliente.email}`}
                            className="text-primary hover:underline transition-all duration-200"
                          >
                            {cliente.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${cliente.telefono}`} className="hover:underline transition-all duration-200">
                            {cliente.telefono}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Registrado: {cliente.created_at ? formatDate(cliente.created_at) : "Fecha no disponible"}
                        </div>
                      </div>

                      <div className="pt-4 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total de compras:</span>
                          <span className="font-semibold">{stats.totalVentas}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total gastado:</span>
                          <span className="font-semibold">S/ {stats.totalGastado.toLocaleString()}</span>
                        </div>
                        {stats.ultimaCompra && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Última compra:</span>
                            <span className="font-semibold">{formatDate(stats.ultimaCompra)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        <Dialog open={!!editingCliente} onOpenChange={(open) => !open && setEditingCliente(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>Actualiza la información del cliente</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre</Label>
                <Input
                  id="edit-nombre"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-telefono">Teléfono</Label>
                <Input
                  id="edit-telefono"
                  value={editForm.telefono}
                  onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                  placeholder="+51 999 999 999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-empresa">Empresa (opcional)</Label>
                <Input
                  id="edit-empresa"
                  value={editForm.empresa}
                  onChange={(e) => setEditForm({ ...editForm, empresa: e.target.value })}
                  placeholder="Nombre de la empresa"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCliente(null)} disabled={isSaving}>
                Cancelar
              </Button>
              <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </AuthGuard>
  )
}
