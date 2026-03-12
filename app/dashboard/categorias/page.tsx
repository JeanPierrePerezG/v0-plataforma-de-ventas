"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getCategorias, addCategoria, updateCategoria, deleteCategoria, type Categoria } from "@/lib/data-store"
import { Plus, Edit, Trash2, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const COLORES_PREDEFINIDOS = [
  { nombre: "Rojo", valor: "#ef4444" },
  { nombre: "Naranja", valor: "#f97316" },
  { nombre: "Amarillo", valor: "#eab308" },
  { nombre: "Verde", valor: "#22c55e" },
  { nombre: "Azul", valor: "#3b82f6" },
  { nombre: "Morado", valor: "#8b5cf6" },
  { nombre: "Rosa", valor: "#ec4899" },
  { nombre: "Gris", valor: "#6b7280" },
]

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [deletingCategoria, setDeletingCategoria] = useState<Categoria | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    color: "#3b82f6",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadCategorias()
  }, [])

  const loadCategorias = async () => {
    const data = await getCategorias()
    setCategorias(data)
  }

  const handleCreate = async () => {
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es obligatorio",
        variant: "destructive",
      })
      return
    }

    const result = await addCategoria(formData)
    if (result) {
      toast({
        title: "Categoría creada",
        description: "La categoría se ha creado correctamente",
      })
      setIsCreateOpen(false)
      setFormData({ nombre: "", descripcion: "", color: "#3b82f6" })
      loadCategorias()
    } else {
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async () => {
    if (!editingCategoria || !formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es obligatorio",
        variant: "destructive",
      })
      return
    }

    const success = await updateCategoria(editingCategoria.id, formData)
    if (success) {
      toast({
        title: "Categoría actualizada",
        description: "La categoría se ha actualizado correctamente",
      })
      setEditingCategoria(null)
      setFormData({ nombre: "", descripcion: "", color: "#3b82f6" })
      loadCategorias()
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingCategoria) return

    const success = await deleteCategoria(deletingCategoria.id)
    if (success) {
      toast({
        title: "Categoría eliminada",
        description: "La categoría se ha eliminado correctamente",
      })
      setDeletingCategoria(null)
      loadCategorias()
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      })
    }
  }

  const openEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria)
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || "",
      color: categoria.color,
    })
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Categorías</h2>
              <p className="text-muted-foreground">Gestiona las categorías de tus productos</p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Categoría
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Categoría</DialogTitle>
                  <DialogDescription>Agrega una nueva categoría para clasificar tus ventas</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      placeholder="Ej: Herramientas"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      placeholder="Descripción opcional de la categoría"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {COLORES_PREDEFINIDOS.map((color) => (
                        <button
                          key={color.valor}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: color.valor })}
                          className={`h-10 rounded-md border-2 transition-all ${
                            formData.color === color.valor ? "border-primary scale-110" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color.valor }}
                          title={color.nombre}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreate}>Crear Categoría</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Categorías Registradas</CardTitle>
              <CardDescription>{categorias.length} categorías disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              {categorias.length === 0 ? (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay categorías registradas</p>
                  <p className="text-sm text-muted-foreground">Crea tu primera categoría para comenzar</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categorias.map((categoria) => (
                    <Card key={categoria.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md" style={{ backgroundColor: categoria.color }} />
                            <div>
                              <h3 className="font-semibold">{categoria.nombre}</h3>
                              {categoria.descripcion && (
                                <p className="text-sm text-muted-foreground">{categoria.descripcion}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(categoria)} className="flex-1">
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingCategoria(categoria)}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingCategoria} onOpenChange={(open) => !open && setEditingCategoria(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoría</DialogTitle>
              <DialogDescription>Modifica los datos de la categoría</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre *</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Textarea
                  id="edit-descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-4 gap-2">
                  {COLORES_PREDEFINIDOS.map((color) => (
                    <button
                      key={color.valor}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.valor })}
                      className={`h-10 rounded-md border-2 transition-all ${
                        formData.color === color.valor ? "border-primary scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.valor }}
                      title={color.nombre}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCategoria(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingCategoria} onOpenChange={(open) => !open && setDeletingCategoria(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará la categoría "{deletingCategoria?.nombre}". Las ventas asociadas no se eliminarán,
                pero perderán su categoría.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardLayout>
    </AuthGuard>
  )
}
