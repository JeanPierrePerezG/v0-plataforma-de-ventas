"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getVentas, updateVentaEstado, getCategorias, type Venta, type Categoria } from "@/lib/data-store"
import { Search, Filter, Calendar, DollarSign, CalendarIcon, FileDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { exportVentasToPDF } from "@/lib/export-utils"

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [filteredVentas, setFilteredVentas] = useState<Venta[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState<string>("todos")
  const [categoriaFilter, setCategoriaFilter] = useState<string>("todos")
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [sortBy, setSortBy] = useState<"fecha" | "monto">("fecha")
  const [editingVenta, setEditingVenta] = useState<Venta | null>(null)
  const [newFecha, setNewFecha] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadVentas()
    loadCategorias()
  }, [])

  useEffect(() => {
    filterAndSortVentas()
  }, [ventas, searchTerm, estadoFilter, categoriaFilter, sortBy, fechaDesde, fechaHasta])

  const loadVentas = async () => {
    try {
      const ventasData = await getVentas()
      setVentas(ventasData || [])
    } catch (error) {
      console.error("[v0] Error loading ventas:", error)
      setVentas([])
      toast({
        title: "Error",
        description: "No se pudieron cargar las ventas",
        variant: "destructive",
      })
    }
  }

  const loadCategorias = async () => {
    const data = await getCategorias()
    setCategorias(data)
  }

  const filterAndSortVentas = () => {
    if (!Array.isArray(ventas)) {
      setFilteredVentas([])
      return
    }

    let filtered = [...ventas]

    if (searchTerm) {
      filtered = filtered.filter(
        (venta) =>
          venta.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venta.producto.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (estadoFilter !== "todos") {
      filtered = filtered.filter((venta) => venta.estado === estadoFilter)
    }

    if (categoriaFilter !== "todos") {
      filtered = filtered.filter((venta) => venta.categoria_id === categoriaFilter)
    }

    filtered.sort((a, b) => {
      if (sortBy === "fecha") {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      }
      return b.monto - a.monto
    })

    setFilteredVentas(filtered)
  }

  const getEstadoBadge = (estado: Venta["estado"]) => {
    const variants = {
      completada: "default",
      pendiente: "secondary",
      cancelada: "destructive",
    } as const

    const labels = {
      completada: "Completada",
      pendiente: "Pendiente",
      cancelada: "Cancelada",
    }

    return (
      <Badge variant={variants[estado]} className="capitalize">
        {labels[estado]}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const totalMonto = filteredVentas.filter((v) => v.estado === "completada").reduce((sum, v) => sum + v.monto, 0)

  const handleEstadoChange = async (ventaId: string, nuevoEstado: Venta["estado"]) => {
    try {
      const success = await updateVentaEstado(ventaId, nuevoEstado)

      if (success) {
        await loadVentas()
        toast({
          title: "Estado actualizado",
          description: "El estado de la venta se ha actualizado correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado de la venta",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error updating estado:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el estado",
        variant: "destructive",
      })
    }
  }

  const handleEditFecha = (venta: Venta) => {
    setEditingVenta(venta)
    const fechaLocal = new Date(venta.fecha)
    const fechaFormatted = fechaLocal.toISOString().split("T")[0]
    setNewFecha(fechaFormatted)
  }

  const handleUpdateFecha = async () => {
    if (!editingVenta || !newFecha) return

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { error } = await supabase
        .from("ventas")
        .update({ fecha: new Date(newFecha).toISOString() })
        .eq("id", editingVenta.id)

      if (error) throw error

      await loadVentas()
      setEditingVenta(null)
      toast({
        title: "Fecha actualizada",
        description: "La fecha de la venta se ha actualizado correctamente",
      })
    } catch (error) {
      console.error("[v0] Error updating fecha:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la fecha de la venta",
        variant: "destructive",
      })
    }
  }

  const handleExportPDF = () => {
    const filtrosActivos = []
    if (searchTerm) filtrosActivos.push(`Búsqueda: "${searchTerm}"`)
    if (estadoFilter !== "todos") filtrosActivos.push(`Estado: ${estadoFilter}`)
    if (categoriaFilter !== "todos") {
      const categoria = categorias.find((c) => c.id === categoriaFilter)
      if (categoria) filtrosActivos.push(`Categoría: ${categoria.nombre}`)
    }
    if (fechaDesde) filtrosActivos.push(`Desde: ${new Date(fechaDesde).toLocaleDateString("es-ES")}`)
    if (fechaHasta) filtrosActivos.push(`Hasta: ${new Date(fechaHasta).toLocaleDateString("es-ES")}`)

    exportVentasToPDF(filteredVentas, filtrosActivos.join(", "))
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="animate-fade-in-up flex items-center justify-between" style={{ animationDelay: "0.1s" }}>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Historial de Ventas</h2>
              <p className="text-muted-foreground">Visualiza y filtra todas las ventas registradas</p>
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
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card
              className="animate-fade-in-up hover:scale-105 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Ventas</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredVentas.length}</div>
                <p className="text-xs text-muted-foreground">ventas encontradas</p>
              </CardContent>
            </Card>

            <Card
              className="animate-fade-in-up hover:scale-105 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: "0.3s" }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">S/ {totalMonto.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">ventas completadas</p>
              </CardContent>
            </Card>

            <Card
              className="animate-fade-in-up hover:scale-105 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: "0.4s" }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promedio</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  S/{" "}
                  {filteredVentas.filter((v) => v.estado === "completada").length > 0
                    ? Math.round(totalMonto / filteredVentas.filter((v) => v.estado === "completada").length)
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">por venta</p>
              </CardContent>
            </Card>
          </div>

          <Card className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <CardHeader>
              <CardTitle>Filtros y Búsqueda</CardTitle>
              <CardDescription>Encuentra ventas específicas usando los filtros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente o producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>

                <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                  <SelectTrigger className="transition-all duration-300 hover:border-primary">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-950 z-[100] shadow-xl border-2 animate-fade-in">
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="completada">Completadas</SelectItem>
                    <SelectItem value="pendiente">Pendientes</SelectItem>
                    <SelectItem value="cancelada">Canceladas</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                  <SelectTrigger className="transition-all duration-300 hover:border-primary">
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-950 z-[100] shadow-xl border-2 animate-fade-in">
                    <SelectItem value="todos">Todas las categorías</SelectItem>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoria.color }} />
                          {categoria.nombre}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: "fecha" | "monto") => setSortBy(value)}>
                  <SelectTrigger className="transition-all duration-300 hover:border-primary">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-950 z-[100] shadow-xl border-2 animate-fade-in">
                    <SelectItem value="fecha">Fecha (más reciente)</SelectItem>
                    <SelectItem value="monto">Monto (mayor a menor)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaDesde" className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Fecha desde
                  </Label>
                  <Input
                    id="fechaDesde"
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaHasta" className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Fecha hasta
                  </Label>
                  <Input
                    id="fechaHasta"
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>
              </div>

              {(searchTerm || estadoFilter !== "todos" || categoriaFilter !== "todos" || fechaDesde || fechaHasta) && (
                <div className="mt-4 animate-fade-in">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setEstadoFilter("todos")
                      setCategoriaFilter("todos")
                      setFechaDesde("")
                      setFechaHasta("")
                    }}
                    className="transition-all duration-300 hover:scale-105"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <CardHeader>
              <CardTitle>Ventas Registradas</CardTitle>
              <CardDescription>
                {filteredVentas.length} {filteredVentas.length === 1 ? "venta encontrada" : "ventas encontradas"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredVentas.length === 0 ? (
                <div className="text-center py-12 animate-fade-in">
                  <p className="text-muted-foreground">No se encontraron ventas con los filtros aplicados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVentas.map((venta, index) => (
                    <div
                      key={venta.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-all duration-300 hover:shadow-md hover:scale-[1.01] animate-fade-in-up"
                      style={{ animationDelay: `${0.7 + index * 0.05}s` }}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{venta.clienteNombre}</h3>
                          {getEstadoBadge(venta.estado)}
                          {venta.categoria && (
                            <Badge
                              variant="outline"
                              className="capitalize"
                              style={{
                                borderColor: venta.categoria.color,
                                color: venta.categoria.color,
                              }}
                            >
                              {venta.categoria.nombre}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{venta.producto}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">{formatDate(venta.fecha)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditFecha(venta)}
                            className="h-6 px-2 text-xs hover:bg-primary/10"
                          >
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                        {venta.notas && <p className="text-sm text-muted-foreground italic">"{venta.notas}"</p>}
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="text-right md:text-left">
                          <p className="text-2xl font-bold transition-all duration-300 hover:scale-110">
                            S/ {venta.monto.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-full md:w-auto">
                          <Select
                            value={venta.estado}
                            onValueChange={(value: Venta["estado"]) => handleEstadoChange(venta.id, value)}
                          >
                            <SelectTrigger className="w-full md:w-[160px] transition-all duration-300 hover:border-primary">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-950 z-[100] shadow-xl border-2 animate-fade-in">
                              <SelectItem value="completada">Completada</SelectItem>
                              <SelectItem value="pendiente">Pendiente</SelectItem>
                              <SelectItem value="cancelada">Cancelada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={!!editingVenta} onOpenChange={(open) => !open && setEditingVenta(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Fecha de Venta</DialogTitle>
              <DialogDescription>
                Modifica la fecha de registro de la venta de {editingVenta?.clienteNombre}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Nueva Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={newFecha}
                  onChange={(e) => setNewFecha(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Producto:</strong> {editingVenta?.producto}
                </p>
                <p>
                  <strong>Monto:</strong> S/ {editingVenta?.monto.toLocaleString()}
                </p>
                <p>
                  <strong>Fecha actual:</strong> {editingVenta && formatDate(editingVenta.fecha)}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingVenta(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateFecha}>Guardar Fecha</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </AuthGuard>
  )
}
