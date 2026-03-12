"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addCliente, addVenta, getClientes, getCategorias, type Cliente, type Categoria } from "@/lib/data-store"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, ShoppingCart, Upload, Download, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NuevaVentaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [fileData, setFileData] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: "", email: "", telefono: "", empresa: "" })
  const [nuevaVenta, setNuevaVenta] = useState({
    clienteId: "",
    producto: "",
    monto: "",
    estado: "completada",
    notas: "",
    categoriaId: "",
  })

  const handleDownloadTemplate = () => {
    const template = `fecha,cliente_email,producto,monto,estado,categoria_nombre,notas
2025-01-15,juan.perez@gmail.com,Martillo 16 Oz,18.50,completada,Herramientas y accesorios,Cliente frecuente
2025-01-15,maria.lopez@gmail.com,Cemento Portland 42.5kg,25.00,completada,Materiales estructurales,
2025-01-16,pedro.garcia@gmail.com,Pintura Latex Blanco 5L,45.00,pendiente,Acabados y pinturas,Entrega programada
2025-01-17,ana.torres@gmail.com,Tubo PVC 1/2 x 3m,12.00,completada,Tuberías y conexiones,Pago en efectivo`

    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "plantilla_ventas.csv"
    link.click()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim())

      const data = lines
        .slice(1)
        .filter((line) => line.trim())
        .map((line) => {
          const values = line.split(",").map((v) => v.trim())
          const fecha = values[0].replace(/^["']|["']$/g, "").trim()
          const cleanEmail = values[1].replace(/^["']|["']$/g, "").trim()
          const cleanEstado = values[4] ? values[4].replace(/^["']|["']$/g, "").trim() : "completada"
          const categoriaNombre = values[5] ? values[5].replace(/^["']|["']$/g, "").trim() : ""
          const notas = values[6] ? values[6].replace(/^["']|["']$/g, "").trim() : ""

          return {
            fecha: fecha,
            cliente_email: cleanEmail,
            producto: values[2],
            monto: Number.parseFloat(values[3]),
            estado: cleanEstado,
            categoria_nombre: categoriaNombre,
            notas: notas,
          }
        })

      setFileData(data)
    }
    reader.readAsText(file)
  }

  const handleProcessBulkSales = async () => {
    if (fileData.length === 0) {
      toast({
        title: "Error",
        description: "No hay datos para procesar",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    let successCount = 0
    let errorCount = 0
    let clientesCreados = 0
    const errors: string[] = []

    for (const item of fileData) {
      try {
        let cliente = clientes.find((c) => c.email.toLowerCase() === item.cliente_email.toLowerCase())

        if (!cliente) {
          console.log(`[v0] Creando cliente nuevo: ${item.cliente_email}`)

          const nuevoClienteData = {
            nombre: item.cliente_email.split("@")[0],
            email: item.cliente_email,
            telefono: "",
            empresa: "",
          }

          const clienteCreado = await addCliente(nuevoClienteData)

          if (clienteCreado) {
            cliente = clienteCreado
            setClientes((prev) => [...prev, clienteCreado])
            clientesCreados++
            console.log(`[v0] Cliente creado exitosamente: ${clienteCreado.email}`)
          } else {
            throw new Error("No se pudo crear el cliente")
          }
        }

        const estadoNormalizado = item.estado.toLowerCase().trim()
        const estadosPermitidos = ["completada", "pendiente", "cancelada"]
        const estadoFinal = estadosPermitidos.includes(estadoNormalizado) ? estadoNormalizado : "completada"

        let fechaVenta = new Date(item.fecha)

        if (isNaN(fechaVenta.getTime())) {
          console.log(`[v0] Fecha inválida: ${item.fecha}, usando fecha actual`)
          fechaVenta = new Date()
        }

        let categoriaId: string | null = null
        if (item.categoria_nombre) {
          const categoria = categorias.find((c) => c.nombre.toLowerCase() === item.categoria_nombre.toLowerCase())
          if (categoria) {
            categoriaId = categoria.id
            console.log(`[v0] Categoría encontrada: ${categoria.nombre}`)
          } else {
            console.log(`[v0] Categoría no encontrada: ${item.categoria_nombre}`)
          }
        }

        console.log(`[v0] Estado original: "${item.estado}", Estado normalizado: "${estadoFinal}"`)
        console.log(`[v0] Fecha de venta: ${fechaVenta.toISOString()}`)

        await addVenta({
          cliente_id: cliente.id,
          producto: item.producto,
          monto: item.monto,
          estado: estadoFinal as "completada" | "pendiente" | "cancelada",
          categoria_id: categoriaId,
          notas: item.notas,
          fecha: fechaVenta.toISOString(),
        })

        successCount++
        console.log(
          `[v0] Venta registrada: ${item.producto} - S/ ${item.monto} - Fecha: ${fechaVenta.toLocaleDateString()}`,
        )
      } catch (error) {
        console.error("[v0] Error procesando venta:", error)
        console.error("[v0] Error en addVenta:", error)
        const errorMsg = error instanceof Error ? error.message : String(error)
        errors.push(`Error con ${item.cliente_email}: ${errorMsg}`)
        errorCount++
      }
    }

    setIsProcessing(false)
    setFileData([])

    const descripcion =
      clientesCreados > 0
        ? `${successCount} ventas registradas. ${clientesCreados} cliente(s) nuevo(s) creado(s).`
        : `${successCount} ventas registradas exitosamente.`

    if (errorCount > 0) {
      toast({
        title: "Proceso completado con errores",
        description: `${descripcion} ${errorCount} error(es) encontrado(s).`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Proceso completado",
        description: descripcion,
      })
    }

    if (successCount > 0) {
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    }
  }

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const [clientesData, categoriasData] = await Promise.all([getClientes(), getCategorias()])
      setClientes(clientesData)
      setCategorias(categoriasData)
      setIsLoading(false)
    }
    loadData()
  }, [])

  const handleCrearCliente = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const cliente = await addCliente(nuevoCliente)

      if (!cliente) {
        throw new Error("No se pudo crear el cliente")
      }

      const data = await getClientes()
      setClientes(data)

      toast({
        title: "Cliente registrado",
        description: `${cliente.nombre} ha sido registrado exitosamente.`,
      })

      setNuevoCliente({
        nombre: "",
        email: "",
        telefono: "",
        empresa: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el cliente. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCrearVenta = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const cliente = clientes.find((c) => c.id === nuevaVenta.clienteId)
      if (!cliente) {
        throw new Error("Cliente no encontrado")
      }

      const venta = await addVenta({
        cliente_id: nuevaVenta.clienteId,
        producto: nuevaVenta.producto,
        monto: Number.parseFloat(nuevaVenta.monto),
        estado: nuevaVenta.estado,
        notas: nuevaVenta.notas,
        categoria_id: nuevaVenta.categoriaId || undefined,
      })

      if (!venta) {
        throw new Error("No se pudo crear la venta")
      }

      toast({
        title: "Venta registrada",
        description: `Venta de S/ ${venta.monto} registrada exitosamente.`,
      })

      setNuevaVenta({
        clienteId: "",
        producto: "",
        monto: "",
        estado: "completada",
        notas: "",
        categoriaId: "",
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar la venta. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold tracking-tight">Registrar Nueva Venta</h2>
          <p className="text-muted-foreground">Registra un nuevo cliente o una venta para un cliente existente</p>
        </div>

        <Tabs defaultValue="venta" className="w-full animate-fade-in-up animation-delay-100">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 transition-all duration-300 hover:shadow-md">
            <TabsTrigger value="venta" className="transition-all duration-300">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Nueva Venta
            </TabsTrigger>
            <TabsTrigger value="cliente" className="transition-all duration-300">
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </TabsTrigger>
            <TabsTrigger value="masiva" className="transition-all duration-300">
              <Upload className="h-4 w-4 mr-2" />
              Carga Masiva
            </TabsTrigger>
          </TabsList>

          <TabsContent value="venta" className="space-y-4">
            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <CardHeader>
                <CardTitle>Registrar Venta</CardTitle>
                <CardDescription>Completa los datos de la venta para un cliente existente</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCrearVenta} className="space-y-4">
                  <div className="space-y-2 animate-fade-in-up animation-delay-200">
                    <Label htmlFor="cliente">Cliente *</Label>
                    <Select
                      value={nuevaVenta.clienteId}
                      onValueChange={(value) => setNuevaVenta({ ...nuevaVenta, clienteId: value })}
                      required
                    >
                      <SelectTrigger
                        id="cliente"
                        className="transition-all duration-300 hover:border-primary focus:scale-[1.02]"
                      >
                        <SelectValue placeholder="Selecciona un cliente" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-950 z-[100] shadow-xl border-2">
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.nombre} - {cliente.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 animate-fade-in-up animation-delay-300">
                    <Label htmlFor="producto">Producto/Servicio *</Label>
                    <Input
                      id="producto"
                      placeholder="Ej: Martillo 18 Oz"
                      value={nuevaVenta.producto}
                      onChange={(e) => setNuevaVenta({ ...nuevaVenta, producto: e.target.value })}
                      className="transition-all duration-300 hover:border-primary focus:scale-[1.02]"
                      required
                    />
                  </div>

                  <div className="space-y-2 animate-fade-in-up animation-delay-350">
                    <Label htmlFor="categoria">Categoría (opcional)</Label>
                    <Select
                      value={nuevaVenta.categoriaId}
                      onValueChange={(value) => setNuevaVenta({ ...nuevaVenta, categoriaId: value })}
                    >
                      <SelectTrigger
                        id="categoria"
                        className="transition-all duration-300 hover:border-primary focus:scale-[1.02]"
                      >
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-950 z-[100] shadow-xl border-2">
                        <SelectItem value="none">Sin categoría</SelectItem>
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
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 animate-fade-in-up animation-delay-400">
                    <div className="space-y-2">
                      <Label htmlFor="monto">Monto (S/) *</Label>
                      <Input
                        id="monto"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={nuevaVenta.monto}
                        onChange={(e) => setNuevaVenta({ ...nuevaVenta, monto: e.target.value })}
                        className="transition-all duration-300 hover:border-primary focus:scale-[1.02]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado *</Label>
                      <Select
                        value={nuevaVenta.estado}
                        onValueChange={(value: "completada" | "pendiente" | "cancelada") =>
                          setNuevaVenta({ ...nuevaVenta, estado: value })
                        }
                      >
                        <SelectTrigger
                          id="estado"
                          className="transition-all duration-300 hover:border-primary focus:scale-[1.02]"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-950 z-[100] shadow-xl border-2">
                          <SelectItem value="completada">Completada</SelectItem>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 animate-fade-in-up animation-delay-500">
                    <Label htmlFor="notas">Notas (opcional)</Label>
                    <Textarea
                      id="notas"
                      placeholder="Agrega notas adicionales sobre la venta..."
                      value={nuevaVenta.notas}
                      onChange={(e) => setNuevaVenta({ ...nuevaVenta, notas: e.target.value })}
                      className="transition-all duration-300 hover:border-primary focus:scale-[1.01]"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4 animate-fade-in-up animation-delay-600">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      {isSubmitting ? "Registrando..." : "Registrar Venta"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard")}
                      className="transition-all duration-300 hover:scale-105 hover:shadow-md"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cliente" className="space-y-4">
            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <CardHeader>
                <CardTitle>Registrar Cliente</CardTitle>
                <CardDescription>Agrega un nuevo cliente a tu base de datos</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCrearCliente} className="space-y-4">
                  <div className="space-y-2 animate-fade-in-up animation-delay-200">
                    <Label htmlFor="nombre">Nombre Completo *</Label>
                    <Input
                      id="nombre"
                      placeholder="Ej: Juan Pérez"
                      value={nuevoCliente.nombre}
                      onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                      className="transition-all duration-300 hover:border-primary focus:scale-[1.02]"
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 animate-fade-in-up animation-delay-300">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="juan@example.com"
                        value={nuevoCliente.email}
                        onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                        className="transition-all duration-300 hover:border-primary focus:scale-[1.02]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="+51 600 123 456"
                        value={nuevoCliente.telefono}
                        onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                        className="transition-all duration-300 hover:border-primary focus:scale-[1.02]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 animate-fade-in-up animation-delay-400">
                    <Label htmlFor="empresa">Empresa (opcional)</Label>
                    <Input
                      id="empresa"
                      placeholder="Ej: Tech Solutions"
                      value={nuevoCliente.empresa}
                      onChange={(e) => setNuevoCliente({ ...nuevoCliente, empresa: e.target.value })}
                      className="transition-all duration-300 hover:border-primary focus:scale-[1.02]"
                    />
                  </div>

                  <div className="flex gap-4 animate-fade-in-up animation-delay-500">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      {isSubmitting ? "Registrando..." : "Registrar Cliente"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard")}
                      className="transition-all duration-300 hover:scale-105 hover:shadow-md"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="masiva" className="space-y-4">
            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <CardHeader>
                <CardTitle>Carga Masiva de Ventas</CardTitle>
                <CardDescription>Importa múltiples ventas desde un archivo CSV</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Instrucciones</AlertTitle>
                  <AlertDescription>
                    1. Descarga la plantilla CSV
                    <br />
                    2. Completa los datos: fecha (YYYY-MM-DD), email del cliente, producto, monto, estado
                    (completada/pendiente/cancelada)
                    <br />
                    3. Opcionalmente agrega categoría (nombre exacto) y notas
                    <br />
                    4. Si el cliente no existe, se creará automáticamente
                    <br />
                    5. Sube el archivo y procesa las ventas
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <Button
                    onClick={handleDownloadTemplate}
                    variant="outline"
                    className="w-full transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Plantilla CSV
                  </Button>

                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Subir Archivo CSV</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="transition-all duration-300 hover:border-primary"
                    />
                  </div>

                  {fileData.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {fileData.length} venta(s) detectada(s) en el archivo
                      </p>
                      <div className="max-h-48 overflow-y-auto border rounded-md p-4 space-y-2">
                        {fileData.map((item, index) => (
                          <div key={index} className="text-sm border-b pb-2 last:border-0">
                            <p>
                              <strong>Fecha:</strong> {item.fecha}
                            </p>
                            <p>
                              <strong>Email:</strong> {item.cliente_email}
                            </p>
                            <p>
                              <strong>Producto:</strong> {item.producto}
                            </p>
                            <p>
                              <strong>Monto:</strong> S/ {item.monto}
                            </p>
                            <p>
                              <strong>Estado:</strong> {item.estado}
                            </p>
                            {item.categoria_nombre && (
                              <p>
                                <strong>Categoría:</strong> {item.categoria_nombre}
                              </p>
                            )}
                            {item.notas && (
                              <p>
                                <strong>Notas:</strong> {item.notas}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleProcessBulkSales}
                    disabled={isProcessing || fileData.length === 0}
                    className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {isProcessing ? "Procesando..." : `Procesar ${fileData.length} Venta(s)`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
