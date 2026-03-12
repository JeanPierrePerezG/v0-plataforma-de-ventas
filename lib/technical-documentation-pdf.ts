import jsPDF from "jspdf"

export function generateTechnicalDocumentation() {
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15
  let yPosition = margin

  // Función para agregar nueva página si es necesario
  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      pdf.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Función para agregar título principal
  const addMainTitle = (title: string) => {
    checkPageBreak(20)
    pdf.setFillColor(139, 92, 246)
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 12, "F")
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(16)
    pdf.setFont("helvetica", "bold")
    pdf.text(title, margin + 5, yPosition + 8)
    yPosition += 18
    pdf.setTextColor(0, 0, 0)
  }

  // Función para agregar subtítulo
  const addSubtitle = (title: string) => {
    checkPageBreak(12)
    pdf.setFillColor(248, 250, 252)
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, "F")
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(139, 92, 246)
    pdf.text(title, margin + 3, yPosition + 6)
    yPosition += 12
    pdf.setTextColor(0, 0, 0)
  }

  // Función para agregar texto normal
  const addText = (text: string, indent = 0) => {
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin - indent)

    lines.forEach((line: string) => {
      checkPageBreak(6)
      pdf.text(line, margin + indent, yPosition)
      yPosition += 5
    })
    yPosition += 2
  }

  // Función para agregar lista con viñetas
  const addBulletPoint = (text: string) => {
    checkPageBreak(6)
    pdf.setFontSize(10)
    pdf.circle(margin + 2, yPosition - 1.5, 0.8, "F")
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin - 8)
    lines.forEach((line: string, index: number) => {
      if (index > 0) checkPageBreak(5)
      pdf.text(line, margin + 6, yPosition)
      yPosition += 5
    })
  }

  // Función para agregar código
  const addCode = (code: string) => {
    checkPageBreak(10)
    pdf.setFillColor(250, 250, 250)
    const codeLines = code.split("\n")
    const codeHeight = codeLines.length * 4 + 4

    if (yPosition + codeHeight > pageHeight - margin) {
      pdf.addPage()
      yPosition = margin
    }

    pdf.rect(margin, yPosition, pageWidth - 2 * margin, codeHeight, "F")
    pdf.setFontSize(8)
    pdf.setFont("courier", "normal")
    pdf.setTextColor(60, 60, 60)

    codeLines.forEach((line: string) => {
      pdf.text(line, margin + 3, yPosition + 4)
      yPosition += 4
    })

    yPosition += 6
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(0, 0, 0)
  }

  // === PORTADA ===
  pdf.setFillColor(139, 92, 246)
  pdf.rect(0, 0, pageWidth, pageHeight, "F")

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(32)
  pdf.setFont("helvetica", "bold")
  pdf.text("DOCUMENTACIÓN", pageWidth / 2, 80, { align: "center" })
  pdf.text("TÉCNICA", pageWidth / 2, 95, { align: "center" })

  pdf.setFontSize(20)
  pdf.setFont("helvetica", "normal")
  pdf.text("Plataforma de Gestión de Ventas", pageWidth / 2, 120, { align: "center" })

  pdf.setFontSize(12)
  pdf.text("Sistema Full-Stack con Next.js y Supabase", pageWidth / 2, 140, { align: "center" })

  const today = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  pdf.setFontSize(10)
  pdf.text(today, pageWidth / 2, pageHeight - 30, { align: "center" })

  // === NUEVA PÁGINA: ÍNDICE ===
  pdf.addPage()
  yPosition = margin

  addMainTitle("ÍNDICE DE CONTENIDOS")

  const sections = [
    "1. Descripción General del Sistema",
    "2. Arquitectura y Tecnologías",
    "3. Sistema de Autenticación",
    "4. Base de Datos y Seguridad (RLS)",
    "5. Operaciones CRUD",
    "6. Dashboard y KPIs",
    "7. Generación de Reportes PDF",
    "8. Componentes y UI",
    "9. Flujo de Trabajo",
    "10. Ventajas y Características",
  ]

  sections.forEach((section) => {
    addText(section, 5)
  })

  // === SECCIÓN 1: DESCRIPCIÓN GENERAL ===
  pdf.addPage()
  yPosition = margin

  addMainTitle("1. DESCRIPCIÓN GENERAL DEL SISTEMA")

  addText(
    "La Plataforma de Gestión de Ventas es una aplicación web full-stack diseñada para pequeñas y medianas empresas que necesitan gestionar clientes, registrar ventas, categorizar productos y analizar su rendimiento comercial mediante dashboards interactivos con Business Intelligence.",
  )

  yPosition += 3
  addSubtitle("Objetivo Principal")
  addText(
    "Proporcionar una herramienta completa y segura que permita a los negocios tomar decisiones basadas en datos mediante KPIs, visualizaciones gráficas y reportes exportables, todo desde una interfaz moderna y fácil de usar.",
  )

  yPosition += 3
  addSubtitle("Usuarios Objetivo")
  addBulletPoint("Ferreterías y negocios de retail")
  addBulletPoint("Pequeñas empresas que necesitan control de ventas")
  addBulletPoint("Emprendedores que buscan análisis simple de su negocio")
  addBulletPoint("Negocios que requieren múltiples usuarios con datos aislados")

  // === SECCIÓN 2: ARQUITECTURA ===
  pdf.addPage()
  yPosition = margin

  addMainTitle("2. ARQUITECTURA Y TECNOLOGÍAS")

  addSubtitle("Stack Tecnológico")

  addText("Frontend:", 5)
  addBulletPoint("Next.js 16 con App Router - Framework React para renderizado del servidor")
  addBulletPoint("React 19.2 - Biblioteca de UI con hooks modernos")
  addBulletPoint("TypeScript - Tipado estático para mayor seguridad")
  addBulletPoint("Tailwind CSS v4 - Framework de estilos utility-first")
  addBulletPoint("Recharts - Gráficos interactivos para visualización de datos")
  addBulletPoint("shadcn/ui - Componentes de UI preconstruidos y personalizables")

  yPosition += 3
  addText("Backend:", 5)
  addBulletPoint("Supabase - Backend as a Service con PostgreSQL")
  addBulletPoint("Supabase Auth - Sistema de autenticación nativo")
  addBulletPoint("PostgreSQL - Base de datos relacional con Row Level Security")
  addBulletPoint("Next.js API Routes - Endpoints serverless")

  yPosition += 3
  addText("Infraestructura:", 5)
  addBulletPoint("Vercel - Plataforma de hosting y despliegue")
  addBulletPoint("Edge Functions - Ejecución en el edge para baja latencia")
  addBulletPoint("SSL automático - Certificados HTTPS automáticos")

  // === SECCIÓN 3: AUTENTICACIÓN ===
  pdf.addPage()
  yPosition = margin

  addMainTitle("3. SISTEMA DE AUTENTICACIÓN")

  addSubtitle("Flujo de Registro")
  addText("El sistema utiliza Supabase Auth para gestionar usuarios de manera segura:")

  yPosition += 2
  addText("1. El usuario completa el formulario con nombre, email y contraseña")
  addText("2. Se envía la solicitud a Supabase Auth que crea el usuario")
  addText("3. La contraseña se hashea automáticamente con algoritmos seguros")
  addText("4. Se envía un email de verificación al usuario")
  addText("5. Al verificar, el usuario puede iniciar sesión")

  yPosition += 3
  addSubtitle("Código de Registro")
  addCode(`const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: window.location.origin,
    data: { full_name: name }
  }
})`)

  yPosition += 3
  addSubtitle("Flujo de Inicio de Sesión")
  addText("1. Usuario ingresa credenciales (email y contraseña)")
  addText("2. Supabase valida contra la base de datos")
  addText("3. Si es correcto, genera un JWT (JSON Web Token)")
  addText("4. El token se almacena en cookies HTTP-only seguras")
  addText("5. El middleware valida este token en cada petición")

  yPosition += 3
  addSubtitle("Protección de Rutas")
  addText(
    "El sistema implementa middleware de Next.js que intercepta todas las peticiones a rutas protegidas (como /dashboard). Si no hay sesión válida, redirige automáticamente al login.",
  )

  // === SECCIÓN 4: BASE DE DATOS Y RLS ===
  pdf.addPage()
  yPosition = margin

  addMainTitle("4. BASE DE DATOS Y SEGURIDAD (RLS)")

  addSubtitle("Row Level Security (RLS)")
  addText(
    "La seguridad más importante de la plataforma es Row Level Security, que garantiza que cada usuario solo puede acceder a sus propios datos, implementado directamente en PostgreSQL.",
  )

  yPosition += 3
  addText("Tablas Principales:", 5)
  addBulletPoint("clientes - Información de clientes del negocio")
  addBulletPoint("ventas - Registro de todas las transacciones")
  addBulletPoint("categorias - Clasificación de productos/servicios")

  yPosition += 3
  addSubtitle("Ejemplo de Política RLS")
  addCode(`-- Habilitar RLS en la tabla
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

-- Solo ver sus propias ventas
CREATE POLICY "Users view own ventas"
  ON ventas FOR SELECT
  USING (auth.uid() = user_id);

-- Solo crear sus propias ventas
CREATE POLICY "Users insert own ventas"
  ON ventas FOR INSERT
  WITH CHECK (auth.uid() = user_id);`)

  yPosition += 3
  addText(
    "La función auth.uid() retorna el ID del usuario autenticado. PostgreSQL aplica automáticamente estas políticas, haciendo imposible que un usuario acceda a datos de otro, incluso si intenta manipular las consultas desde el frontend.",
  )

  // === SECCIÓN 5: OPERACIONES CRUD ===
  pdf.addPage()
  yPosition = margin

  addMainTitle("5. OPERACIONES CRUD")

  addSubtitle("Obtener Datos (READ)")
  addText(
    "Todas las operaciones de lectura filtran automáticamente por user_id para mostrar solo datos del usuario actual:",
  )

  addCode(`export async function getVentas() {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from("ventas")
    .select(\`
      *,
      cliente:clientes(nombre, email),
      categoria:categorias(nombre, color)
    \`)
    .eq("user_id", user.id)
    .order("fecha", { ascending: false })
  
  return data || []
}`)

  yPosition += 3
  addSubtitle("Crear Datos (CREATE)")
  addText("Al insertar nuevos registros, siempre se asocia con el user_id actual:")

  addCode(`export async function createVenta(ventaData) {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from("ventas")
    .insert([{
      ...ventaData,
      user_id: user.id
    }])
    .select()
    .single()
  
  return data
}`)

  yPosition += 3
  addSubtitle("Actualizar y Eliminar (UPDATE & DELETE)")
  addText(
    "Las políticas RLS garantizan que solo se puedan modificar o eliminar registros propios, incluso si se intenta manipular el user_id.",
  )

  // === SECCIÓN 6: DASHBOARD Y KPIS ===
  pdf.addPage()
  yPosition = margin

  addMainTitle("6. DASHBOARD Y KPIS")

  addSubtitle("Indicadores Clave de Rendimiento (KPIs)")
  addText("El dashboard calcula 4 KPIs principales en tiempo real:")

  yPosition += 2
  addText("1. VENTAS TOTALES")
  addCode(`const totalVentas = ventasCompletadas
  .reduce((sum, v) => sum + v.monto, 0)

// Suma todos los montos de ventas completadas`)

  yPosition += 2
  addText("2. VENTAS POR DÍA (PROMEDIO)")
  addCode(`const diasUnicos = new Set(
  ventas.map(v => format(new Date(v.fecha), 'yyyy-MM-dd'))
).size

const ventasPorDia = ventas.length / diasUnicos

// Total de ventas dividido entre días con actividad`)

  yPosition += 2
  addText("3. TASA DE CONVERSIÓN")
  addCode(`const tasaConversion = 
  (ventasCompletadas.length / ventas.length) * 100

// Porcentaje de ventas completadas exitosamente`)

  yPosition += 2
  addText("4. TASA DE NO CONCRETADAS")
  addCode(`const tasaNoConcretadas = 
  ((pendientes.length + canceladas.length) / ventas.length) * 100

// Porcentaje de oportunidades perdidas`)

  // === SECCIÓN 7: GRÁFICOS ===
  pdf.addPage()
  yPosition = margin

  addSubtitle("Visualizaciones Interactivas")
  addText("El dashboard incluye 3 gráficos principales usando Recharts:")

  yPosition += 2
  addText("1. Ingresos Diarios (Gráfico de Área)", 5)
  addBulletPoint("Muestra evolución temporal de ingresos")
  addBulletPoint("Solo considera ventas completadas")
  addBulletPoint("Gradiente violeta para mejor presentación")

  yPosition += 2
  addText("2. Ventas por Día (Gráfico de Barras Apiladas)", 5)
  addBulletPoint("Barras apiladas por estado: completadas (verde), pendientes (naranja), canceladas (rojo)")
  addBulletPoint("Permite identificar patrones de actividad")
  addBulletPoint("Tooltips con información detallada")

  yPosition += 2
  addText("3. Distribución por Estado (Gráfico Horizontal)", 5)
  addBulletPoint("Comparación visual entre estados")
  addBulletPoint("Muestra cantidad y porcentaje")
  addBulletPoint("Colores semánticos para fácil interpretación")

  yPosition += 3
  addSubtitle("Procesamiento de Datos para Gráficos")
  addCode(`// Agrupar ventas por fecha
const ventasPorFecha = ventas.reduce((acc, venta) => {
  const fecha = format(new Date(venta.fecha), 'yyyy-MM-dd')
  
  if (!acc[fecha]) {
    acc[fecha] = {
      completadas: 0,
      pendientes: 0,
      canceladas: 0,
      ingresos: 0
    }
  }
  
  acc[fecha][venta.estado + 's']++
  if (venta.estado === 'completada') {
    acc[fecha].ingresos += venta.monto
  }
  
  return acc
}, {})`)

  // === SECCIÓN 7: REPORTES PDF ===
  pdf.addPage()
  yPosition = margin

  addMainTitle("7. GENERACIÓN DE REPORTES PDF")

  addSubtitle("Funcionalidad de Exportación")
  addText(
    "El sistema permite exportar reportes profesionales en PDF con la biblioteca jsPDF, incluyendo KPIs, estadísticas y diseño corporativo.",
  )

  yPosition += 3
  addText("Características del Reporte:", 5)
  addBulletPoint("Encabezado con branding en color violeta")
  addBulletPoint("4 KPIs principales con diseño visual (círculos de colores)")
  addBulletPoint("Resumen estadístico detallado")
  addBulletPoint("Pie de página con fecha de generación")
  addBulletPoint("Múltiples páginas automáticas según contenido")

  yPosition += 3
  addSubtitle("Ejemplo de Código PDF")
  addCode(`// Crear documento
const pdf = new jsPDF("p", "mm", "a4")

// Encabezado con color
pdf.setFillColor(139, 92, 246)
pdf.rect(0, 0, pageWidth, 40, "F")

// Título en blanco
pdf.setTextColor(255, 255, 255)
pdf.setFontSize(24)
pdf.text("Reporte de Ventas", 15, 20)

// KPI con círculo decorativo
pdf.circle(23, yPos + 8, 6, "F")
pdf.text("VENTAS TOTALES", 33, yPos + 7)
pdf.text(\`S/ \${total.toFixed(2)}\`, 33, yPos + 16)`)

  // === SECCIÓN 8: COMPONENTES Y UI ===
  pdf.addPage()
  yPosition = margin

  addMainTitle("8. COMPONENTES Y UI")

  addSubtitle("Sistema de Diseño")
  addText("La interfaz utiliza shadcn/ui con Tailwind CSS v4 y un sistema de design tokens para consistencia visual.")

  yPosition += 2
  addText("Paleta de Colores:", 5)
  addBulletPoint("Primario: Violeta (#8b5cf6) - Marca y acciones principales")
  addBulletPoint("Verde: (#10b981) - Éxito y ventas completadas")
  addBulletPoint("Naranja: (#f59e0b) - Advertencia y ventas pendientes")
  addBulletPoint("Rojo: (#ef4444) - Error y ventas canceladas")

  yPosition += 3
  addSubtitle("Componentes Reutilizables")
  addText("La plataforma utiliza componentes de shadcn/ui personalizados:")

  addBulletPoint("Button - Botones con variantes (primary, secondary, destructive)")
  addBulletPoint("Card - Tarjetas para contenedores de información")
  addBulletPoint("Dialog - Modales para formularios y confirmaciones")
  addBulletPoint("Input - Campos de formulario con validación")
  addBulletPoint("Select - Selectores dropdown")
  addBulletPoint("Table - Tablas con ordenamiento y paginación")
  addBulletPoint("Toast - Notificaciones temporales")

  yPosition += 3
  addSubtitle("Responsive Design")
  addText(
    "La interfaz es completamente responsive con breakpoints de Tailwind, adaptándose perfectamente a móvil, tablet y desktop. Utiliza flexbox para layouts y grid solo para layouts complejos 2D.",
  )

  // === SECCIÓN 9: FLUJO DE TRABAJO ===
  pdf.addPage()
  yPosition = margin

  addMainTitle("9. FLUJO DE TRABAJO DEL SISTEMA")

  addSubtitle("Usuario Nuevo")
  addText("1. Registro con email y contraseña")
  addText("2. Verificación de email (link enviado automáticamente)")
  addText("3. Primer acceso al dashboard (vacío)")
  addText("4. Creación de categorías para clasificar productos")
  addText("5. Registro de clientes del negocio")
  addText("6. Creación de ventas asociadas a clientes")
  addText("7. Análisis de datos en el dashboard con filtros")

  yPosition += 3
  addSubtitle("Usuario Existente")
  addText("1. Inicio de sesión con credenciales")
  addText("2. Vista del dashboard con todas las métricas actualizadas")
  addText("3. Navegación entre secciones (Clientes, Ventas, Categorías)")
  addText("4. Gestión de datos (crear, editar, eliminar)")
  addText("5. Aplicación de filtros por fecha y categoría")
  addText("6. Exportación de reportes en PDF")
  addText("7. Cierre de sesión seguro")

  yPosition += 3
  addSubtitle("Sesión del Usuario")
  addText(
    "Las sesiones utilizan JWT (JSON Web Tokens) almacenados en cookies HTTP-only con configuración segura. Los tokens expiran después de un período y se refrescan automáticamente mientras el usuario está activo.",
  )

  // === SECCIÓN 10: VENTAJAS ===
  pdf.addPage()
  yPosition = margin

  addMainTitle("10. VENTAJAS Y CARACTERÍSTICAS DESTACADAS")

  addSubtitle("Seguridad")
  addBulletPoint("Row Level Security (RLS) implementado en PostgreSQL")
  addBulletPoint("Autenticación robusta con Supabase Auth")
  addBulletPoint("Tokens JWT con refresh automático")
  addBulletPoint("Cookies HTTP-only para prevenir XSS")
  addBulletPoint("Validación de datos en frontend y backend")
  addBulletPoint("Índices de base de datos para rendimiento")

  yPosition += 3
  addSubtitle("Análisis de Datos")
  addBulletPoint("4 KPIs calculados en tiempo real")
  addBulletPoint("3 visualizaciones interactivas con Recharts")
  addBulletPoint("Filtros dinámicos por fecha y categoría")
  addBulletPoint("Exportación de reportes profesionales en PDF")
  addBulletPoint("Tooltips informativos en todos los gráficos")

  yPosition += 3
  addSubtitle("Experiencia de Usuario")
  addBulletPoint("Interfaz moderna y responsive (móvil, tablet, desktop)")
  addBulletPoint("Modo claro y oscuro")
  addBulletPoint("Animaciones suaves con Tailwind")
  addBulletPoint("Feedback visual en todas las acciones (toasts)")
  addBulletPoint("Navegación intuitiva con sidebar")
  addBulletPoint("Carga optimizada con Server Components")

  yPosition += 3
  addSubtitle("Escalabilidad")
  addBulletPoint("Arquitectura serverless con Vercel")
  addBulletPoint("Base de datos PostgreSQL gestionada por Supabase")
  addBulletPoint("Edge Functions para baja latencia global")
  addBulletPoint("Multiusuario con aislamiento total de datos")
  addBulletPoint("Sin límite de clientes o ventas")

  yPosition += 3
  addSubtitle("Tecnología Moderna")
  addBulletPoint("Next.js 16 con las últimas características")
  addBulletPoint("React 19 con hooks modernos")
  addBulletPoint("TypeScript para código seguro y mantenible")
  addBulletPoint("Tailwind CSS v4 para estilos eficientes")
  addBulletPoint("Componentes reutilizables con shadcn/ui")

  // === PÁGINA FINAL ===
  pdf.addPage()
  yPosition = pageHeight / 2 - 40

  pdf.setFillColor(248, 250, 252)
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 80, "F")

  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  pdf.setTextColor(139, 92, 246)
  pdf.text("CONCLUSIÓN", pageWidth / 2, yPosition + 15, { align: "center" })

  pdf.setFontSize(11)
  pdf.setFont("helvetica", "normal")
  pdf.setTextColor(60, 60, 60)

  const conclusionText =
    "Esta plataforma demuestra una arquitectura full-stack completa con las mejores prácticas de desarrollo moderno. Implementa seguridad robusta con Row Level Security, autenticación nativa, análisis de datos con KPIs empresariales, visualizaciones interactivas y exportación de reportes profesionales. Es una solución completa y escalable para negocios que necesitan gestionar sus ventas de manera eficiente y segura."

  const conclusionLines = pdf.splitTextToSize(conclusionText, pageWidth - 2 * margin - 20)
  let conclusionY = yPosition + 30
  conclusionLines.forEach((line: string) => {
    pdf.text(line, pageWidth / 2, conclusionY, { align: "center" })
    conclusionY += 6
  })

  // Numeración de páginas
  const pageCount = pdf.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    if (i > 1) {
      // No numerar la portada
      pdf.setFontSize(9)
      pdf.setTextColor(150, 150, 150)
      pdf.text(`Página ${i - 1} de ${pageCount - 1}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      })
    }
  }

  // Guardar
  const fileName = `documentacion-tecnica-${new Date().getTime()}.pdf`
  pdf.save(fileName)
}
