"use client"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  getVentas,
  deleteAllVentas,
  deleteAllClientes,
  getCategorias,
  type Venta,
  type Categoria,
} from "@/lib/data-store"
import { FileDown, TrendingUp, DollarSign, ShoppingCart, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { es } from "date-fns/locale"
import { generatePDFReport } from "@/lib/pdf-report"
import { AuthGuard } from "@/components/auth-guard"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

export default function DashboardPage() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [selectedCategoria, setSelectedCategoria] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("all")
  const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>(undefined)
  const [customDateTo, setCustomDateTo] = useState<Date | undefined>(undefined)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadDataInitial()

    const interval = setInterval(loadDataSilent, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadDataInitial = async () => {
    setIsInitialLoading(true)
    const [ventasData, categoriasData] = await Promise.all([getVentas(), getCategorias()])
    setVentas(ventasData)
    setCategorias(categoriasData)
    setIsInitialLoading(false)
  }

  const loadDataSilent = async () => {
    const data = await getVentas()
    setVentas(data)
  }

  const handleDeleteAllData = async () => {
    setIsDeleting(true)
    try {
      const ventasDeleted = await deleteAllVentas()
      const clientesDeleted = await deleteAllClientes()

      if (ventasDeleted && clientesDeleted) {
        toast({
          title: "Datos eliminados",
          description: "Todas las ventas y clientes han sido eliminados exitosamente",
        })
        await loadDataInitial()
      } else {
        throw new Error("No se pudieron eliminar todos los datos")
      }
    } catch (error) {
      console.error("Error al eliminar datos:", error)
      toast({
        title: "Error",
        description: "No se pudieron eliminar los datos. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCategoriaChange = (value: string) => {
    setSelectedCategoria(value)
  }

  const handleDateRangeChange = (value: string) => {
    setDateRange(value)
    if (value !== "custom") {
      setCustomDateFrom(undefined)
      setCustomDateTo(undefined)
    }
  }

  const getDateFilteredVentas = () => {
    const now = new Date()

    switch (dateRange) {
      case "7days":
        const last7Days = subDays(now, 7)
        return ventas.filter((v) => new Date(v.fecha) >= last7Days)
      case "30days":
        const last30Days = subDays(now, 30)
        return ventas.filter((v) => new Date(v.fecha) >= last30Days)
      case "thisMonth":
        const monthStart = startOfMonth(now)
        const monthEnd = endOfMonth(now)
        return ventas.filter((v) => {
          const fecha = new Date(v.fecha)
          return isWithinInterval(fecha, { start: monthStart, end: monthEnd })
        })
      case "custom":
        if (customDateFrom && customDateTo) {
          return ventas.filter((v) => {
            const fecha = new Date(v.fecha)
            return isWithinInterval(fecha, { start: customDateFrom, end: customDateTo })
          })
        }
        return ventas
      default:
        return ventas
    }
  }

  const ventasFiltradas =
    selectedCategoria === "all"
      ? getDateFilteredVentas()
      : getDateFilteredVentas().filter((v) => v.categoria_id === selectedCategoria)

  const ventasCompletadas = ventasFiltradas.filter((v) => v.estado === "completada")
  const ventasCanceladas = ventasFiltradas.filter((v) => v.estado === "cancelada")
  const ventasPendientes = ventasFiltradas.filter((v) => v.estado === "pendiente")

  const totalVentas = ventasCompletadas.reduce((sum, v) => sum + v.monto, 0)

  const diasUnicos = new Set(ventasFiltradas.map((v) => new Date(v.fecha).toISOString().split("T")[0])).size
  const ventasPorDiaPromedio = diasUnicos > 0 ? ventasFiltradas.length / diasUnicos : 0

  const ventasNoConcretadas = ventasCanceladas.length + ventasPendientes.length
  const tasaNoConcretadas = ventasFiltradas.length > 0 ? (ventasNoConcretadas / ventasFiltradas.length) * 100 : 0
  const tasaConversion = ventasFiltradas.length > 0 ? (ventasCompletadas.length / ventasFiltradas.length) * 100 : 0

  const ventasPorDia = ventasFiltradas
    .reduce(
      (acc, venta) => {
        const fecha = new Date(venta.fecha)
        const fechaKey = fecha.toISOString().split("T")[0]
        const fechaDisplay = fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })

        const existing = acc.find((item) => item.fechaKey === fechaKey)
        if (existing) {
          if (venta.estado === "completada") {
            existing.completadas += 1
            existing.monto += venta.monto
          } else if (venta.estado === "pendiente") {
            existing.pendientes += 1
          } else if (venta.estado === "cancelada") {
            existing.canceladas += 1
          }
          existing.total += 1
        } else {
          acc.push({
            fechaKey,
            fecha: fechaDisplay,
            monto: venta.estado === "completada" ? venta.monto : 0,
            completadas: venta.estado === "completada" ? 1 : 0,
            pendientes: venta.estado === "pendiente" ? 1 : 0,
            canceladas: venta.estado === "cancelada" ? 1 : 0,
            total: 1,
          })
        }
        return acc
      },
      [] as {
        fechaKey: string
        fecha: string
        monto: number
        completadas: number
        pendientes: number
        canceladas: number
        total: number
      }[],
    )
    .sort((a, b) => a.fechaKey.localeCompare(b.fechaKey))

  console.log("[v0] Datos del gráfico de ingresos diarios:", ventasPorDia)
  console.log("[v0] Total de días con ventas:", ventasPorDia.length)
  console.log("[v0] Primer día:", ventasPorDia[0])
  console.log("[v0] Último día:", ventasPorDia[ventasPorDia.length - 1])

  const ventasPorEstado = [
    { estado: "Completadas", cantidad: ventasCompletadas.length, fill: "#10b981" },
    { estado: "Pendientes", cantidad: ventasPendientes.length, fill: "#f59e0b" },
    { estado: "Canceladas", cantidad: ventasCanceladas.length, fill: "#ef4444" },
  ]

  const selectedCategoriaName =
    selectedCategoria === "all"
      ? "Todas las Categorías"
      : categorias.find((c) => c.id === selectedCategoria)?.nombre || "Categoría"

  const dateRangeOptions = [
    { value: "all", label: "Todo el tiempo" },
    { value: "7days", label: "Últimos 7 días" },
    { value: "30days", label: "Últimos 30 días" },
    { value: "thisMonth", label: "Este mes" },
    { value: "custom", label: "Personalizado..." },
  ]

  const categoriaOptions = [
    { value: "all", label: "Todas las Categorías" },
    ...categorias.map((categoria) => ({
      value: categoria.id,
      label: categoria.nombre,
    })),
  ]

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case "7days":
        return "Últimos 7 días"
      case "30days":
        return "Últimos 30 días"
      case "thisMonth":
        return "Este mes"
      case "custom":
        if (customDateFrom && customDateTo) {
          return `${format(customDateFrom, "dd/MM/yy", { locale: es })} - ${format(customDateTo, "dd/MM/yy", { locale: es })}`
        }
        return "Rango personalizado"
      default:
        return "Todo el tiempo"
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await generatePDFReport({
        totalVentas,
        ventasPorDia: ventasPorDiaPromedio,
        tasaConversion,
        tasaNoConcretadas,
        ventasCompletadas: ventasCompletadas.length,
        ventasPendientes: ventasPendientes.length,
        ventasCanceladas: ventasCanceladas.length,
        totalRegistros: ventasFiltradas.length,
        dateRangeLabel: dateRangeOptions.find((opt) => opt.value === dateRange)?.label || "Todos",
        categoriaLabel: categoriaOptions.find((opt) => opt.value === selectedCategoria)?.label || "Todas",
      })
      toast({
        title: "Reporte generado",
        description: "El reporte PDF se ha descargado correctamente.",
      })
    } catch (error) {
      console.error("Error generando PDF:", error)
      toast({
        title: "Error",
        description: "No se pudo generar el reporte PDF.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  if (isInitialLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            <p className="text-muted-foreground font-medium">Cargando dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">Vista general de tus ventas y métricas de rendimiento</p>
            </div>
            <Button onClick={handleExportPDF} disabled={isExporting} size="lg" className="gap-2">
              <FileDown className="h-5 w-5" />
              {isExporting ? "Generando..." : "Exportar Reporte PDF"}
            </Button>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Personaliza la vista de tus datos</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Período de Tiempo</label>
                <Select value={dateRange} onValueChange={handleDateRangeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {dateRange === "custom" && (
                  <div className="mt-4 space-y-3 p-4 border rounded-lg bg-muted/30">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fecha Desde</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !customDateFrom && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {customDateFrom ? format(customDateFrom, "dd/MM/yyyy", { locale: es }) : "Selecciona fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={customDateFrom}
                            onSelect={setCustomDateFrom}
                            disabled={(date) => date > new Date() || (customDateTo ? date > customDateTo : false)}
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fecha Hasta</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !customDateTo && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {customDateTo ? format(customDateTo, "dd/MM/yyyy", { locale: es }) : "Selecciona fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={customDateTo}
                            onSelect={setCustomDateTo}
                            disabled={(date) => date > new Date() || (customDateFrom ? date < customDateFrom : false)}
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Categoría</label>
                <Select value={selectedCategoria} onValueChange={handleCategoriaChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriaOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">S/ {totalVentas.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-2">{ventasCompletadas.length} ventas completadas</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas por Día</CardTitle>
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{ventasPorDiaPromedio.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground mt-2">Promedio diario de ventas</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{tasaConversion.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-2">Ventas completadas exitosamente</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de No Concretadas</CardTitle>
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{tasaNoConcretadas.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {ventasNoConcretadas} ventas pendientes o canceladas
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Ventas por Día</CardTitle>
                <CardDescription>Evolución diaria de ventas por estado</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 overflow-hidden">
                <ChartContainer
                  config={{
                    completadas: { label: "Completadas", color: "#10b981" },
                    pendientes: { label: "Pendientes", color: "#f59e0b" },
                    canceladas: { label: "Canceladas", color: "#ef4444" },
                  }}
                  className="h-[350px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ventasPorDia} margin={{ top: 10, right: 20, left: -10, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="fecha"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 11 }}
                        stroke="#6b7280"
                        interval={Math.floor(ventasPorDia.length / 12)}
                      />
                      <YAxis stroke="#6b7280" />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                                <p className="font-semibold text-sm mb-2">{data.fecha}</p>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                                    <span className="text-xs">Completadas: {data.completadas}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                                    <span className="text-xs">Pendientes: {data.pendientes}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                                    <span className="text-xs">Canceladas: {data.canceladas}</span>
                                  </div>
                                  <div className="pt-1 mt-1 border-t border-border">
                                    <span className="text-xs font-semibold">Total: {data.total}</span>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend />
                      <Bar dataKey="completadas" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="pendientes" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="canceladas" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-2 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Ingresos Diarios</CardTitle>
                <CardDescription>Evolución de ingresos por ventas completadas</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 overflow-hidden">
                <ChartContainer
                  config={{
                    monto: { label: "Ingresos", color: "#8b5cf6" },
                  }}
                  className="h-[350px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ventasPorDia} margin={{ top: 10, right: 20, left: -10, bottom: 60 }}>
                      <defs>
                        <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="fecha"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 11 }}
                        stroke="#6b7280"
                        interval={Math.floor(ventasPorDia.length / 12)}
                      />
                      <YAxis stroke="#6b7280" />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                                <p className="font-semibold text-sm mb-2">{data.fecha}</p>
                                <div className="space-y-1">
                                  <p className="text-sm">
                                    Ingresos: <span className="font-bold text-primary">S/ {data.monto.toFixed(2)}</span>
                                  </p>
                                  <p className="text-xs text-muted-foreground">{data.completadas} ventas completadas</p>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="monto"
                        stroke="#8b5cf6"
                        strokeWidth={2.5}
                        fill="url(#colorMonto)"
                        fillOpacity={1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="col-span-3 border-2">
              <CardHeader>
                <CardTitle className="text-lg">Distribución de Ventas por Estado</CardTitle>
                <CardDescription>Análisis del estado actual de todas las ventas</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer
                  config={{
                    cantidad: { label: "Cantidad", color: "#8b5cf6" },
                  }}
                  className="h-[400px] w-full flex items-center justify-center"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ventasPorEstado}
                      layout="vertical"
                      margin={{ top: 20, right: 40, left: 120, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" style={{ fontSize: "13px" }} />
                      <YAxis
                        dataKey="estado"
                        type="category"
                        width={110}
                        stroke="#6b7280"
                        style={{ fontSize: "14px" }}
                      />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                                <p className="font-semibold text-sm">{data.estado}</p>
                                <p className="text-sm mt-1">Cantidad: {data.cantidad}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="cantidad" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={60}>
                        {ventasPorEstado.map((entry, index) => (
                          <Bar key={`cell-${index}`} dataKey="cantidad" fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  {ventasPorEstado.map((estado) => (
                    <div key={estado.estado} className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: estado.fill }} />
                        <span className="text-sm font-medium">{estado.estado}</span>
                      </div>
                      <div className="text-2xl font-bold">{estado.cantidad}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {ventasFiltradas.length > 0 ? ((estado.cantidad / ventasFiltradas.length) * 100).toFixed(1) : 0}
                        %
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
