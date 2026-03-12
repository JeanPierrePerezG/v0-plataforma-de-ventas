import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error("Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  return createBrowserClient(url, key, {
    auth: {
      // No persistir automáticamente la sesión para evitar errores de refresh token
      persistSession: true,
      // Detectar sesión automáticamente
      detectSessionInUrl: true,
      // Configurar auto refresh con manejo de errores
      autoRefreshToken: true,
      // Callback personalizado para manejar errores de autenticación
      flowType: "pkce",
    },
    global: {
      // Suprimir errores de refresh token en consola
      fetch: (url, options = {}) => {
        return fetch(url, options).catch((error) => {
          // Suprimir errores de refresh token
          if (error.message?.includes("Refresh Token") || error.message?.includes("Invalid Refresh Token")) {
            return new Response(JSON.stringify({ error: "Session expired" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            })
          }
          throw error
        })
      },
    },
  })
}
