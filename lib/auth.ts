// Utilidades de autenticación
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isAuthenticated") === "true"
}

export function getUserEmail(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("userEmail")
}

export function login(email: string, password: string): boolean {
  // Simulación de login - en producción esto debería validar contra una base de datos
  if (email && password.length >= 6) {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", email)
    // Crear cookie para el middleware
    document.cookie = "user-session=true; path=/; max-age=86400"
    return true
  }
  return false
}

export function register(email: string, password: string, name: string): boolean {
  // Simulación de registro - en producción esto debería guardar en una base de datos
  if (email && password.length >= 6 && name) {
    // Guardar usuario en localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    users.push({ email, name, createdAt: new Date().toISOString() })
    localStorage.setItem("users", JSON.stringify(users))

    // Auto-login después del registro
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", email)
    document.cookie = "user-session=true; path=/; max-age=86400"
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("userEmail")
  // Eliminar cookie
  document.cookie = "user-session=; path=/; max-age=0"
}
