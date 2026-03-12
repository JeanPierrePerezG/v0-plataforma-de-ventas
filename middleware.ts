import { NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acceso público a estas rutas
  if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/auth")) {
    return NextResponse.next()
  }

  // Las rutas del dashboard se protegerán en el cliente
  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
