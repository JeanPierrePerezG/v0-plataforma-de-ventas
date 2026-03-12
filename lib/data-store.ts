import { supabase } from "./supabase"

export interface Cliente {
  id: string
  nombre: string
  email: string
  telefono: string
  empresa?: string
  created_at?: string
  user_id?: string
}

export interface Categoria {
  id: string
  nombre: string
  descripcion?: string
  color: string
  user_id?: string
  created_at?: string
}

export interface Venta {
  id: string
  cliente_id: string
  clienteNombre?: string
  producto: string
  monto: number
  estado: "completada" | "pendiente" | "cancelada"
  fecha: string
  notas?: string
  user_id?: string
  categoria_id?: string
  categoria?: Categoria
}

export async function getClientes(): Promise<Cliente[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    console.log("[v0] Usuario autenticado:", user?.id)
    if (!user) return []

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    console.log("[v0] Clientes obtenidos:", data?.length || 0)
    console.log("[v0] Error al obtener clientes:", error)

    if (error) {
      console.error("[v0] Error al obtener clientes:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Error en getClientes:", error)
    return []
  }
}

export async function getVentas(): Promise<Venta[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    console.log("[v0] Usuario autenticado para ventas:", user?.id)
    if (!user) return []

    const { data, error } = await supabase
      .from("ventas")
      .select(`
        *,
        clientes (
          nombre
        ),
        categorias (
          id,
          nombre,
          color
        )
      `)
      .eq("user_id", user.id)
      .order("fecha", { ascending: false })

    console.log("[v0] Ventas obtenidas:", data?.length || 0)
    console.log("[v0] Error al obtener ventas:", error)

    if (error) {
      console.error("[v0] Error al obtener ventas:", error)
      return []
    }

    const ventasConNombre = (data || []).map((venta: any) => ({
      ...venta,
      clienteNombre: venta.clientes?.nombre || "Cliente desconocido",
      categoria: venta.categorias || undefined,
    }))

    return ventasConNombre
  } catch (error) {
    console.error("[v0] Error en getVentas:", error)
    return []
  }
}

export async function addCliente(cliente: Omit<Cliente, "id" | "created_at" | "user_id">): Promise<Cliente | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Usuario no autenticado")

    const { data, error } = await supabase
      .from("clientes")
      .insert([
        {
          nombre: cliente.nombre,
          email: cliente.email,
          telefono: cliente.telefono,
          empresa: cliente.empresa,
          user_id: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error al agregar cliente:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("[v0] Error en addCliente:", error)
    return null
  }
}

export async function addVenta(venta: Omit<Venta, "id" | "fecha" | "user_id">): Promise<Venta | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Usuario no autenticado")

    const { data, error } = await supabase
      .from("ventas")
      .insert([
        {
          cliente_id: venta.cliente_id,
          producto: venta.producto,
          monto: venta.monto,
          estado: venta.estado,
          notas: venta.notas,
          categoria_id: venta.categoria_id || null,
          user_id: user.id,
          fecha: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error al agregar venta:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("[v0] Error en addVenta:", error)
    return null
  }
}

export async function getClienteById(id: string): Promise<Cliente | null> {
  try {
    const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single()

    if (error) {
      console.error("[v0] Error al obtener cliente:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("[v0] Error en getClienteById:", error)
    return null
  }
}

export async function updateVentaEstado(ventaId: string, nuevoEstado: Venta["estado"]): Promise<boolean> {
  try {
    const notasPorEstado = {
      completada: "Venta completada exitosamente",
      cancelada: "Cancelada - stock insuficiente",
      pendiente: "Pendiente de confirmación del pedido",
    }

    const { error } = await supabase
      .from("ventas")
      .update({
        estado: nuevoEstado,
        notas: notasPorEstado[nuevoEstado],
      })
      .eq("id", ventaId)

    if (error) {
      console.error("[v0] Error al actualizar estado de venta:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Error en updateVentaEstado:", error)
    return false
  }
}

export async function updateCliente(
  clienteId: string,
  cliente: Omit<Cliente, "id" | "created_at" | "user_id">,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("clientes")
      .update({
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        empresa: cliente.empresa,
      })
      .eq("id", clienteId)

    if (error) {
      console.error("[v0] Error al actualizar cliente:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Error en updateCliente:", error)
    return false
  }
}

export async function deleteAllVentas(): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Usuario no autenticado")

    const { error } = await supabase.from("ventas").delete().eq("user_id", user.id)

    if (error) {
      console.error("[v0] Error al borrar ventas:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Error en deleteAllVentas:", error)
    return false
  }
}

export async function deleteAllClientes(): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Usuario no autenticado")

    // Primero borrar todas las ventas asociadas (por si acaso)
    await deleteAllVentas()

    // Luego borrar los clientes
    const { error } = await supabase.from("clientes").delete().eq("user_id", user.id)

    if (error) {
      console.error("[v0] Error al borrar clientes:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Error en deleteAllClientes:", error)
    return false
  }
}

export async function getCategorias(): Promise<Categoria[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .eq("user_id", user.id)
      .order("nombre", { ascending: true })

    if (error) {
      console.error("[v0] Error al obtener categorías:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Error en getCategorias:", error)
    return []
  }
}

export async function addCategoria(
  categoria: Omit<Categoria, "id" | "created_at" | "user_id">,
): Promise<Categoria | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Usuario no autenticado")

    const { data, error } = await supabase
      .from("categorias")
      .insert([
        {
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
          color: categoria.color,
          user_id: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error al agregar categoría:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("[v0] Error en addCategoria:", error)
    return null
  }
}

export async function updateCategoria(
  categoriaId: string,
  categoria: Omit<Categoria, "id" | "created_at" | "user_id">,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("categorias")
      .update({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        color: categoria.color,
      })
      .eq("id", categoriaId)

    if (error) {
      console.error("[v0] Error al actualizar categoría:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Error en updateCategoria:", error)
    return false
  }
}

export async function deleteCategoria(categoriaId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("categorias").delete().eq("id", categoriaId)

    if (error) {
      console.error("[v0] Error al eliminar categoría:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Error en deleteCategoria:", error)
    return false
  }
}
