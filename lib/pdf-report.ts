import jsPDF from "jspdf"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ReportData {
  totalVentas: number
  ventasPorDia: number
  tasaConversion: number
  tasaNoConcretadas: number
  ventasCompletadas: number
  ventasPendientes: number
  ventasCanceladas: number
  totalRegistros: number
  dateRangeLabel: string
  categoriaLabel: string
}

export async function generatePDFReport(data: ReportData) {
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15
  let yPosition = margin

  // Encabezado del reporte
  pdf.setFillColor(139, 92, 246) // Color primario (violeta)
  pdf.rect(0, 0, pageWidth, 40, "F")

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont("helvetica", "bold")
  pdf.text("Reporte de Ventas", margin, 20)

  pdf.setFontSize(11)
  pdf.setFont("helvetica", "normal")
  pdf.text(`Generado el ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}`, margin, 30)

  yPosition = 50

  // Filtros aplicados
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  pdf.text(`Período: ${data.dateRangeLabel}`, margin, yPosition)
  yPosition += 6
  pdf.text(`Categoría: ${data.categoriaLabel}`, margin, yPosition)
  yPosition += 12

  // KPIs principales
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(14)
  pdf.setFont("helvetica", "bold")
  pdf.text("Indicadores Principales (KPIs)", margin, yPosition)
  yPosition += 8

  // Tarjetas de KPIs
  const kpiWidth = (pageWidth - 3 * margin) / 2
  const kpiHeight = 25

  // Ventas Totales
  pdf.setFillColor(248, 250, 252)
  pdf.roundedRect(margin, yPosition, kpiWidth, kpiHeight, 3, 3, "F")
  pdf.setFillColor(139, 92, 246)
  pdf.circle(margin + 8, yPosition + 8, 6, "F")
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(9)
  pdf.setFont("helvetica", "bold")
  pdf.text("VENTAS TOTALES", margin + 18, yPosition + 7)
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(16)
  pdf.text(`S/ ${data.totalVentas.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`, margin + 18, yPosition + 16)
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(8)
  pdf.text(`${data.ventasCompletadas} completadas`, margin + 18, yPosition + 21)

  // Ventas por Día
  pdf.setFillColor(248, 250, 252)
  pdf.roundedRect(margin + kpiWidth + margin / 2, yPosition, kpiWidth, kpiHeight, 3, 3, "F")
  pdf.setFillColor(59, 130, 246)
  pdf.circle(margin + kpiWidth + margin / 2 + 8, yPosition + 8, 6, "F")
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(9)
  pdf.setFont("helvetica", "bold")
  pdf.text("VENTAS POR DÍA", margin + kpiWidth + margin / 2 + 18, yPosition + 7)
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(16)
  pdf.text(data.ventasPorDia.toFixed(1), margin + kpiWidth + margin / 2 + 18, yPosition + 16)
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(8)
  pdf.text("Promedio diario", margin + kpiWidth + margin / 2 + 18, yPosition + 21)

  yPosition += kpiHeight + 8

  // Tasa de Conversión
  pdf.setFillColor(248, 250, 252)
  pdf.roundedRect(margin, yPosition, kpiWidth, kpiHeight, 3, 3, "F")
  pdf.setFillColor(16, 185, 129)
  pdf.circle(margin + 8, yPosition + 8, 6, "F")
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(9)
  pdf.setFont("helvetica", "bold")
  pdf.text("TASA DE CONVERSIÓN", margin + 18, yPosition + 7)
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(16)
  pdf.text(`${data.tasaConversion.toFixed(1)}%`, margin + 18, yPosition + 16)
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(8)
  pdf.text(`${data.ventasCompletadas}/${data.totalRegistros} completadas`, margin + 18, yPosition + 21)

  // No Concretadas
  pdf.setFillColor(248, 250, 252)
  pdf.roundedRect(margin + kpiWidth + margin / 2, yPosition, kpiWidth, kpiHeight, 3, 3, "F")
  pdf.setFillColor(239, 68, 68)
  pdf.circle(margin + kpiWidth + margin / 2 + 8, yPosition + 8, 6, "F")
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(9)
  pdf.setFont("helvetica", "bold")
  pdf.text("NO CONCRETADAS", margin + kpiWidth + margin / 2 + 18, yPosition + 7)
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(16)
  pdf.text(`${data.tasaNoConcretadas.toFixed(1)}%`, margin + kpiWidth + margin / 2 + 18, yPosition + 16)
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(8)
  pdf.text(
    `${data.ventasPendientes + data.ventasCanceladas} pendientes/canceladas`,
    margin + kpiWidth + margin / 2 + 18,
    yPosition + 21,
  )

  yPosition += kpiHeight + 15

  // Resumen estadístico
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text("Resumen Estadístico", margin, yPosition)
  yPosition += 8

  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")
  const stats = [
    `Total de ventas registradas: ${data.totalRegistros}`,
    `Ventas completadas: ${data.ventasCompletadas} (${data.tasaConversion.toFixed(1)}%)`,
    `Ventas pendientes: ${data.ventasPendientes} (${((data.ventasPendientes / data.totalRegistros) * 100).toFixed(1)}%)`,
    `Ventas canceladas: ${data.ventasCanceladas} (${((data.ventasCanceladas / data.totalRegistros) * 100).toFixed(1)}%)`,
    `Ingreso total: S/ ${data.totalVentas.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
    `Promedio de ventas por día: ${data.ventasPorDia.toFixed(2)}`,
  ]

  pdf.setTextColor(60, 60, 60)
  stats.forEach((stat) => {
    pdf.text(`• ${stat}`, margin + 5, yPosition)
    yPosition += 6
  })

  // Pie de página
  pdf.setTextColor(150, 150, 150)
  pdf.setFontSize(8)
  pdf.text("Plataforma de Gestión de Ventas - Página 1 de 1", pageWidth / 2, pageHeight - 10, {
    align: "center",
  })

  // Guardar PDF
  const fileName = `reporte-ventas-${format(new Date(), "yyyy-MM-dd-HHmmss")}.pdf`
  pdf.save(fileName)
}
