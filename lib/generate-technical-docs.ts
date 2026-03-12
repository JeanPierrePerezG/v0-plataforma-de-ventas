import jsPDF from "jspdf"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export async function generateTechnicalDocumentation() {
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let yPosition = margin

  // Función auxiliar para agregar nueva página
  const addNewPage = () => {
    pdf.addPage()
    yPosition = margin
  }

  // Función para verificar si necesitamos nueva página
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      addNewPage()
      return true
    }
    return false
  }

  // ============================================
  // PORTADA
  // ============================================
  pdf.setFillColor(139, 92, 246)
  pdf.rect(0, 0, pageWidth, pageHeight, "F")

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(42)
  pdf.setFont("helvetica", "bold")
  pdf.text("DOCUMENTACIÓN", pageWidth / 2, 80, { align: "center" })
  pdf.text("TÉCNICA", pageWidth / 2, 100, { align: "center" })

  pdf.setFontSize(24)
  pdf.setFont("helvetica", "normal")
  pdf.text("Plataforma de Gestión de Ventas", pageWidth / 2, 130, { align: "center" })

  pdf.setFontSize(12)
  pdf.text(`Generado el ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}`, pageWidth / 2, 250, {
    align: "center",
  })

  // ============================================
  // PÁGINA 2: ÍNDICE
  // ============================================
  addNewPage()
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(24)
  pdf.setFont("helvetica", "bold")
  pdf.text("ÍNDICE", margin, yPosition)
  yPosition += 15

  const indice = [
    "1. Lenguajes y Tecnologías",
    "2. Arquitectura de la Plataforma",
    "3. Flujo de Autenticación",
    "4. Base de Datos y RLS",
    "5. Cálculo de KPIs",
    "6. Componentes del Dashboard",
    "7. Generación de Gráficos",
    "8. Exportación de Reportes",
  ]

  pdf.setFontSize(12)
  pdf.setFont("helvetica", "normal")
  indice.forEach((item) => {
    pdf.text(item, margin + 5, yPosition)
    yPosition += 8
  })

  // ============================================
  // SECCIÓN 1: LENGUAJES Y TECNOLOGÍAS
  // ============================================
  addNewPage()
  pdf.setFillColor(139, 92, 246)
  pdf.rect(margin, yPosition, contentWidth, 12, "F")
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  pdf.text("1. LENGUAJES Y TECNOLOGÍAS", margin + 5, yPosition + 8)
  yPosition += 20

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(11)
  pdf.setFont("helvetica", "normal")

  const tecnologias = [
    {
      titulo: "TypeScript",
      descripcion: "Lenguaje principal (95% del código). JavaScript con tipos estáticos para detectar errores.",
    },
    {
      titulo: "Next.js 16",
      descripcion: "Framework React con App Router, Server Components y renderizado híbrido.",
    },
    {
      titulo: "React 19",
      descripcion: "Biblioteca de UI con hooks para gestión de estado y efectos.",
    },
    {
      titulo: "PostgreSQL",
      descripcion: "Base de datos relacional con Row Level Security (RLS).",
    },
    {
      titulo: "Supabase",
      descripcion: "Backend as a Service (BaaS) que proporciona autenticación y base de datos.",
    },
    {
      titulo: "Tailwind CSS v4",
      descripcion: "Framework de estilos utility-first con design tokens.",
    },
    {
      titulo: "Recharts",
      descripcion: "Biblioteca de gráficos interactivos basada en D3.js.",
    },
    {
      titulo: "jsPDF",
      descripcion: "Generación de documentos PDF en el navegador.",
    },
  ]

  tecnologias.forEach((tech) => {
    checkPageBreak(20)
    pdf.setFont("helvetica", "bold")
    pdf.text(`• ${tech.titulo}`, margin + 5, yPosition)
    yPosition += 6
    pdf.setFont("helvetica", "normal")
    const lines = pdf.splitTextToSize(tech.descripcion, contentWidth - 15)
    pdf.text(lines, margin + 10, yPosition)
    yPosition += lines.length * 5 + 3
  })

  // ============================================
  // SECCIÓN 2: ARQUITECTURA
  // ============================================
  checkPageBreak(40)
  yPosition += 10
  pdf.setFillColor(139, 92, 246)
  pdf.rect(margin, yPosition, contentWidth, 12, "F")
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  pdf.text("2. ARQUITECTURA DE LA PLATAFORMA", margin + 5, yPosition + 8)
  yPosition += 20

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(11)
  pdf.setFont("helvetica", "normal")

  const arquitecturaTexto = [
    "La plataforma sigue una arquitectura de 3 capas:",
    "",
    "CAPA 1 - FRONTEND (React/Next.js):",
    "• Páginas y componentes que el usuario ve e interactúa",
    "• Formularios, botones, gráficos y navegación",
    "• Validación de datos en el cliente",
    "",
    "CAPA 2 - BACKEND (Next.js Server):",
    "• API Routes para operaciones del servidor",
    "• Middleware de autenticación",
    "• Lógica de negocio y validaciones",
    "• Conexión con Supabase",
    "",
    "CAPA 3 - BASE DE DATOS (PostgreSQL):",
    "• Tablas: clientes, ventas, categorias",
    "• Row Level Security (RLS) para seguridad",
    "• Índices para optimización de consultas",
    "• Políticas de acceso por usuario",
  ]

  arquitecturaTexto.forEach((linea) => {
    checkPageBreak(10)
    if (linea.includes(":")) {
      pdf.setFont("helvetica", "bold")
    } else {
      pdf.setFont("helvetica", "normal")
    }
    const lines = pdf.splitTextToSize(linea, contentWidth - 10)
    pdf.text(lines, margin + 5, yPosition)
    yPosition += lines.length * 5 + 2
  })

  // ============================================
  // SECCIÓN 3: FLUJO DE AUTENTICACIÓN
  // ============================================
  addNewPage()
  pdf.setFillColor(139, 92, 246)
  pdf.rect(margin, yPosition, contentWidth, 12, "F")
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  pdf.text("3. FLUJO DE AUTENTICACIÓN", margin + 5, yPosition + 8)
  yPosition += 20

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(11)

  const autenticacionPasos = [
    {
      titulo: "PASO 1: Registro de Usuario",
      contenido: [
        "• El usuario completa el formulario con nombre, email y contraseña",
        "• supabase.auth.signUp() crea el usuario en auth.users",
        "• Se envía un email de verificación automáticamente",
        "• Los metadatos (nombre) se guardan en user_metadata",
        "• Redirige a página de confirmación",
      ],
    },
    {
      titulo: "PASO 2: Inicio de Sesión",
      contenido: [
        "• Usuario ingresa email y contraseña",
        "• supabase.auth.signInWithPassword() valida credenciales",
        "• Si es correcto, genera un token JWT (JSON Web Token)",
        "• El token se guarda en cookies HTTP-only (seguras)",
        "• Redirige al dashboard",
      ],
    },
    {
      titulo: "PASO 3: Middleware de Protección",
      contenido: [
        "• Cada request pasa primero por middleware.ts",
        "• Lee las cookies de autenticación",
        "• Valida el token JWT con Supabase",
        "• Si el token expiró, intenta refrescarlo",
        "• Si no hay sesión válida, redirige a /login",
      ],
    },
    {
      titulo: "PASO 4: Row Level Security (RLS)",
      contenido: [
        "• PostgreSQL filtra automáticamente los datos por user_id",
        "• Los usuarios solo pueden ver sus propios registros",
        "• Políticas RLS se aplican en todas las operaciones CRUD",
        "• Seguridad implementada a nivel de base de datos",
      ],
    },
  ]

  autenticacionPasos.forEach((paso) => {
    checkPageBreak(40)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.text(paso.titulo, margin + 5, yPosition)
    yPosition += 8

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(11)
    paso.contenido.forEach((linea) => {
      checkPageBreak(10)
      const lines = pdf.splitTextToSize(linea, contentWidth - 10)
      pdf.text(lines, margin + 5, yPosition)
      yPosition += lines.length * 5 + 1
    })
    yPosition += 5
  })

  // ============================================
  // SECCIÓN 4: BASE DE DATOS Y RLS
  // ============================================
  addNewPage()
  pdf.setFillColor(139, 92, 246)
  pdf.rect(margin, yPosition, contentWidth, 12, "F")
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  pdf.text("4. BASE DE DATOS Y ROW LEVEL SECURITY", margin + 5, yPosition + 8)
  yPosition += 20

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(11)

  const tablas = [
    {
      nombre: "Tabla: clientes",
      campos: [
        "• id: UUID (Primary Key, generado automáticamente)",
        "• nombre: TEXT (nombre del cliente)",
        "• email: TEXT (email del cliente)",
        "• telefono: TEXT (teléfono de contacto)",
        "• empresa: TEXT (opcional, nombre de la empresa)",
        "• user_id: UUID (referencia al usuario autenticado)",
        "• created_at: TIMESTAMP (fecha de creación)",
      ],
    },
    {
      nombre: "Tabla: ventas",
      campos: [
        "• id: UUID (Primary Key)",
        "• cliente_id: UUID (Foreign Key → clientes)",
        "• producto: TEXT (nombre del producto)",
        "• monto: DECIMAL(10,2) (precio de la venta)",
        "• estado: TEXT (completada | pendiente | cancelada)",
        "• categoria_id: UUID (Foreign Key → categorias)",
        "• notas: TEXT (opcional, notas adicionales)",
        "• fecha: TIMESTAMP (fecha de la venta)",
        "• user_id: UUID (referencia al usuario)",
      ],
    },
    {
      nombre: "Tabla: categorias",
      campos: [
        "• id: UUID (Primary Key)",
        "• nombre: TEXT (nombre de la categoría)",
        "• descripcion: TEXT (descripción)",
        "• color: TEXT (código hexadecimal para el color)",
        "• user_id: UUID (referencia al usuario)",
        "• created_at: TIMESTAMP (fecha de creación)",
      ],
    },
  ]

  tablas.forEach((tabla) => {
    checkPageBreak(40)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.text(tabla.nombre, margin + 5, yPosition)
    yPosition += 8

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)
    tabla.campos.forEach((campo) => {
      checkPageBreak(8)
      pdf.text(campo, margin + 8, yPosition)
      yPosition += 5
    })
    yPosition += 5
  })

  // Políticas RLS
  checkPageBreak(50)
  yPosition += 5
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(12)
  pdf.text("POLÍTICAS DE ROW LEVEL SECURITY (RLS)", margin + 5, yPosition)
  yPosition += 10

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(11)

  const politicasRLS = [
    "Todas las tablas tienen RLS habilitado con las siguientes políticas:",
    "",
    "• SELECT: Los usuarios solo pueden ver sus propios registros",
    "  WHERE auth.uid() = user_id",
    "",
    "• INSERT: Los usuarios solo pueden crear registros con su user_id",
    "  WITH CHECK (auth.uid() = user_id)",
    "",
    "• UPDATE: Los usuarios solo pueden actualizar sus registros",
    "  USING (auth.uid() = user_id)",
    "",
    "• DELETE: Los usuarios solo pueden eliminar sus registros",
    "  USING (auth.uid() = user_id)",
    "",
    "Beneficio: Seguridad a nivel de base de datos que impide acceso",
    "no autorizado incluso si hay vulnerabilidades en el código frontend.",
  ]

  politicasRLS.forEach((linea) => {
    checkPageBreak(8)
    if (linea.startsWith("•")) {
      pdf.setFont("helvetica", "bold")
    } else if (linea.includes("WHERE") || linea.includes("WITH") || linea.includes("USING")) {
      pdf.setFont("courier", "normal")
      pdf.setFontSize(9)
    } else {
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(11)
    }
    const lines = pdf.splitTextToSize(linea, contentWidth - 10)
    pdf.text(lines, margin + 8, yPosition)
    yPosition += lines.length * 5 + 1
    pdf.setFontSize(11)
  })

  // ============================================
  // SECCIÓN 5: CÁLCULO DE KPIS
  // ============================================
  addNewPage()
  pdf.setFillColor(139, 92, 246)
  pdf.rect(margin, yPosition, contentWidth, 12, "F")
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  pdf.text("5. CÁLCULO DE KPIS", margin + 5, yPosition + 8)
  yPosition += 20

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(11)

  const kpis = [
    {
      nombre: "KPI 1: Ventas Totales",
      formula: "Σ (monto de ventas completadas)",
      explicacion:
        "Suma de todos los montos de las ventas con estado 'completada'. Se filtran las ventas completadas y se suman sus montos usando reduce().",
      codigo: "ventasCompletadas.reduce((sum, v) => sum + v.monto, 0)",
    },
    {
      nombre: "KPI 2: Ventas por Día (Promedio)",
      formula: "Total de ventas / Días únicos con ventas",
      explicacion:
        "Cuenta los días únicos donde hubo ventas usando Set para eliminar duplicados, luego divide el total de ventas entre ese número.",
      codigo: "ventas.length / new Set(ventas.map(v => fecha)).size",
    },
    {
      nombre: "KPI 3: Tasa de Conversión",
      formula: "(Ventas Completadas / Total de Ventas) × 100",
      explicacion: "Porcentaje de ventas que se completaron exitosamente. Indica la efectividad del proceso de ventas.",
      codigo: "(ventasCompletadas.length / ventas.length) * 100",
    },
    {
      nombre: "KPI 4: Tasa de No Concretadas",
      formula: "((Pendientes + Canceladas) / Total) × 100",
      explicacion:
        "Porcentaje de ventas que no se completaron. Útil para identificar áreas de mejora en el proceso comercial.",
      codigo: "((pendientes.length + canceladas.length) / ventas.length) * 100",
    },
  ]

  kpis.forEach((kpi) => {
    checkPageBreak(50)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.text(kpi.nombre, margin + 5, yPosition)
    yPosition += 8

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(11)
    pdf.text(`Fórmula: ${kpi.formula}`, margin + 8, yPosition)
    yPosition += 7

    const explicacionLines = pdf.splitTextToSize(kpi.explicacion, contentWidth - 15)
    pdf.text(explicacionLines, margin + 8, yPosition)
    yPosition += explicacionLines.length * 5 + 5

    pdf.setFillColor(248, 250, 252)
    pdf.roundedRect(margin + 8, yPosition - 3, contentWidth - 16, 10, 2, 2, "F")
    pdf.setFont("courier", "normal")
    pdf.setFontSize(9)
    pdf.text(kpi.codigo, margin + 12, yPosition + 3)
    yPosition += 15
  })

  // ============================================
  // SECCIÓN 6: COMPONENTES DEL DASHBOARD
  // ============================================
  addNewPage()
  pdf.setFillColor(139, 92, 246)
  pdf.rect(margin, yPosition, contentWidth, 12, "F")
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  pdf.text("6. COMPONENTES DEL DASHBOARD", margin + 5, yPosition + 8)
  yPosition += 20

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(11)

  const componentesDescripcion = [
    {
      titulo: "DashboardLayout",
      descripcion:
        "Componente contenedor que envuelve todas las páginas del dashboard. Incluye el header con nombre de usuario, sidebar con navegación y área de contenido principal.",
    },
    {
      titulo: "AuthGuard",
      descripcion:
        "Componente de seguridad que verifica la autenticación del usuario antes de renderizar el contenido protegido. Redirige a /login si no hay sesión válida.",
    },
    {
      titulo: "useEffect Hook",
      descripcion:
        "Se ejecuta cuando el componente se monta y cuando cambian los filtros (fecha, categoría). Carga los datos del dashboard desde Supabase.",
    },
    {
      titulo: "useState Hook",
      descripcion:
        "Gestiona el estado local del componente: ventas, filtros, fechas personalizadas, y datos de categorías. React re-renderiza cuando el estado cambia.",
    },
    {
      titulo: "ChartContainer (Recharts)",
      descripcion:
        "Contenedor para gráficos interactivos. Incluye BarChart para ventas por día, AreaChart para ingresos diarios, y configuración de tooltips.",
    },
  ]

  componentesDescripcion.forEach((comp) => {
    checkPageBreak(30)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.text(`• ${comp.titulo}`, margin + 5, yPosition)
    yPosition += 7

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(11)
    const lines = pdf.splitTextToSize(comp.descripcion, contentWidth - 15)
    pdf.text(lines, margin + 10, yPosition)
    yPosition += lines.length * 5 + 5
  })

  // ============================================
  // SECCIÓN 7: GENERACIÓN DE GRÁFICOS
  // ============================================
  checkPageBreak(60)
  yPosition += 10
  pdf.setFillColor(139, 92, 246)
  pdf.rect(margin, yPosition, contentWidth, 12, "F")
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  pdf.text("7. GENERACIÓN DE GRÁFICOS", margin + 5, yPosition + 8)
  yPosition += 20

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(11)
  pdf.setFont("helvetica", "normal")

  const graficosTexto = [
    "PROCESO DE AGRUPACIÓN DE DATOS:",
    "",
    "1. Las ventas se agrupan por fecha usando reduce()",
    "2. Para cada fecha se inicializan contadores por estado",
    "3. Se incrementan los contadores según el estado de cada venta",
    "4. Solo las ventas completadas suman al campo de ingresos",
    "5. El objeto resultante se convierte a array",
    "6. Se ordena cronológicamente (fecha más antigua primero)",
    "7. Las fechas se formatean para mostrar (ej: '25 Nov')",
    "",
    "GRÁFICO DE BARRAS APILADAS:",
    "",
    "• Muestra ventas completadas, pendientes y canceladas",
    "• stackId='a' apila las barras verticalmente",
    "• Colores: Verde (#10b981), Naranja (#f59e0b), Rojo (#ef4444)",
    "• Tooltip interactivo muestra detalles al pasar el mouse",
    "• XAxis muestra fechas rotadas 45° para legibilidad",
    "",
    "GRÁFICO DE ÁREA:",
    "",
    "• Visualiza la evolución temporal de ingresos diarios",
    "• Gradiente de violeta con opacidad para mejor estética",
    "• Línea de 2.5px de grosor para visibilidad",
    "• ChartTooltip muestra fecha, ingresos y cantidad de ventas",
  ]

  graficosTexto.forEach((linea) => {
    checkPageBreak(8)
    if (linea.endsWith(":")) {
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(12)
    } else if (linea.startsWith("•") || linea.match(/^\d\./)) {
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(11)
    } else {
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(11)
    }
    const lines = pdf.splitTextToSize(linea, contentWidth - 10)
    pdf.text(lines, margin + 5, yPosition)
    yPosition += lines.length * 5 + 2
  })

  // ============================================
  // SECCIÓN 8: EXPORTACIÓN DE REPORTES
  // ============================================
  addNewPage()
  pdf.setFillColor(139, 92, 246)
  pdf.rect(margin, yPosition, contentWidth, 12, "F")
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  pdf.text("8. EXPORTACIÓN DE REPORTES PDF", margin + 5, yPosition + 8)
  yPosition += 20

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(11)

  const exportacionInfo = [
    {
      titulo: "Librería jsPDF",
      contenido: [
        "• new jsPDF('p', 'mm', 'a4') crea documento A4 vertical",
        "• setFillColor(r, g, b) define colores RGB para rellenos",
        "• rect(x, y, width, height, 'F') dibuja rectángulos",
        "• circle(x, y, radius, 'F') dibuja círculos",
        "• text(texto, x, y) escribe texto en coordenadas",
        "• setFontSize(tamaño) cambia el tamaño de la fuente",
        "• save(nombre) descarga el PDF generado",
      ],
    },
    {
      titulo: "Estructura del Reporte",
      contenido: [
        "• Portada con branding y fecha de generación",
        "• 4 KPIs principales con diseño de tarjetas",
        "• Círculos de colores como iconos visuales",
        "• Resumen estadístico detallado con métricas",
        "• Distribución porcentual por estados",
        "• Pie de página con número de página",
        "• Diseño profesional con colores corporativos",
      ],
    },
    {
      titulo: "Datos Incluidos en el Reporte",
      contenido: [
        "• Ventas Totales: Suma de ingresos completados",
        "• Ventas por Día: Promedio de actividad diaria",
        "• Tasa de Conversión: Porcentaje de éxito",
        "• Tasa No Concretadas: Oportunidades perdidas",
        "• Cantidad total de ventas por estado",
        "• Porcentaje de distribución por estado",
        "• Rango de fechas aplicado en los filtros",
      ],
    },
  ]

  exportacionInfo.forEach((seccion) => {
    checkPageBreak(50)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.text(seccion.titulo, margin + 5, yPosition)
    yPosition += 8

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(11)
    seccion.contenido.forEach((item) => {
      checkPageBreak(8)
      const lines = pdf.splitTextToSize(item, contentWidth - 15)
      pdf.text(lines, margin + 8, yPosition)
      yPosition += lines.length * 5 + 2
    })
    yPosition += 5
  })

  // ============================================
  // PIE DE PÁGINA EN TODAS LAS PÁGINAS
  // ============================================
  const totalPages = pdf.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    if (i > 1) {
      // No agregar pie en la portada
      pdf.setFontSize(9)
      pdf.setTextColor(150, 150, 150)
      pdf.setFont("helvetica", "normal")
      pdf.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" })
      pdf.text("Plataforma de Gestión de Ventas - Documentación Técnica", pageWidth / 2, pageHeight - 5, {
        align: "center",
      })
    }
  }

  // Guardar el PDF
  const fileName = `documentacion-tecnica-${format(new Date(), "yyyy-MM-dd-HHmm")}.pdf`
  pdf.save(fileName)
}
