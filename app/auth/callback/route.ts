import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/auth/reset-password"

  console.log("[v0] Callback recibido:", { code: code ? "presente" : "ausente", next })

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch (error) {
              console.log("[v0] Error al establecer cookies:", error)
            }
          },
        },
      },
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log("[v0] Resultado de exchangeCodeForSession:", {
      success: !error,
      error: error?.message,
      hasSession: !!data?.session,
    })

    if (!error && data?.session) {
      const redirectUrl = new URL(next, requestUrl.origin)
      console.log("[v0] Redirigiendo a:", redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    // Si hay error, redirigir a login con mensaje
    console.log("[v0] Error en callback, redirigiendo a login")
    return NextResponse.redirect(new URL("/login?error=invalid_link", requestUrl.origin))
  }

  // Si no hay código, redirigir a login
  console.log("[v0] No hay código, redirigiendo a login")
  return NextResponse.redirect(new URL("/login", requestUrl.origin))
}
