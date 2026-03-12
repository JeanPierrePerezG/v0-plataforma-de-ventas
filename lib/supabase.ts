import { createClient as createBrowserClient } from "@/lib/supabase/client"

export const supabase = createBrowserClient()

export type Cliente = {
  id: string
  nombre: string
  email: string
  telefono: string
  empresa: string
  created_at: string
  user_id: string
}

export type Venta = {
  id: string
  cliente_id: string
  producto: string
  monto: number
  fecha: string
  estado: "completada" | "pendiente" | "cancelada"
  notas: string
  user_id: string
}
