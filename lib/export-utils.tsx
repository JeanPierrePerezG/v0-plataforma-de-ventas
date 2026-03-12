export const exportVentasToPDF = (ventas: any[], filtros?: string) => {
  const ventasCompletadas = ventas.filter((v) => v.estado === "completada")
  const totalVentas = ventasCompletadas.reduce((sum, v) => sum + v.monto, 0)
  const promedioVenta = ventasCompletadas.length > 0 ? totalVentas / ventasCompletadas.length : 0

  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reporte de Ventas</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
    .summary { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .summary-item { margin: 5px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #333; color: white; }
    tr:hover { background-color: #f5f5f5; }
    .completada { color: green; font-weight: bold; }
    .pendiente { color: orange; font-weight: bold; }
    .cancelada { color: red; font-weight: bold; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
    /* Añadiendo estilos para el botón de impresión */
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      background-color: #333;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
    }
    .print-button:hover {
      background-color: #555;
    }
    @media print {
      .print-button {
        display: none;
      }
    }
  </style>
</head>
<body>
  <!-- Agregando botón de impresión visible -->
  <button class="print-button" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
  
  <h1>📊 Reporte de Ventas</h1>
  
  ${filtros ? `<p><strong>Filtros aplicados:</strong> ${filtros}</p>` : ""}
  
  <div class="summary">
    <h2>Resumen</h2>
    <div class="summary-item"><strong>Total de ventas:</strong> ${ventas.length}</div>
    <div class="summary-item"><strong>Ventas completadas:</strong> ${ventasCompletadas.length}</div>
    <div class="summary-item"><strong>Ventas pendientes:</strong> ${ventas.filter((v) => v.estado === "pendiente").length}</div>
    <div class="summary-item"><strong>Ventas canceladas:</strong> ${ventas.filter((v) => v.estado === "cancelada").length}</div>
    <div class="summary-item"><strong>Monto total:</strong> S/ ${totalVentas.toLocaleString("es-ES", { minimumFractionDigits: 2 })}</div>
    <div class="summary-item"><strong>Promedio por venta:</strong> S/ ${promedioVenta.toLocaleString("es-ES", { minimumFractionDigits: 2 })}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Cliente</th>
        <th>Producto</th>
        <th>Monto</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      ${ventas
        .map(
          (venta) => `
        <tr>
          <td>${new Date(venta.fecha).toLocaleDateString("es-ES")}</td>
          <td>${venta.cliente_nombre || "N/A"}</td>
          <td>${venta.producto}</td>
          <td>S/ ${venta.monto.toLocaleString("es-ES", { minimumFractionDigits: 2 })}</td>
          <td class="${venta.estado}">${venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>

  <div class="footer">
    <p>Generado el ${new Date().toLocaleString("es-ES")}</p>
    <p>Plataforma para gestionar ventas</p>
  </div>
</body>
</html>
  `

  const blob = new Blob([content], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const newWindow = window.open(url, "_blank")
  if (newWindow) {
    newWindow.document.write(content)
    newWindow.document.close()
  } else {
    alert("Por favor, permite las ventanas emergentes para generar el PDF")
  }

  // Limpiar el URL después de un tiempo
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

export const exportClientesToPDF = (clientes: any[], clienteStats: Record<string, any>) => {
  const totalClientes = clientes.length
  const clientesActivos = clientes.filter((c) => clienteStats[c.id]?.totalVentas > 0).length
  const totalGastado = clientes.reduce((sum, c) => sum + (clienteStats[c.id]?.totalGastado || 0), 0)

  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reporte de Clientes</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
    .summary { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .summary-item { margin: 5px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #333; color: white; }
    tr:hover { background-color: #f5f5f5; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
    /* Añadiendo estilos para el botón de impresión */
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      background-color: #333;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
    }
    .print-button:hover {
      background-color: #555;
    }
    @media print {
      .print-button {
        display: none;
      }
    }
  </style>
</head>
<body>
  <!-- Agregando botón de impresión visible -->
  <button class="print-button" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
  
  <h1>👥 Reporte de Clientes</h1>
  
  <div class="summary">
    <h2>Resumen</h2>
    <div class="summary-item"><strong>Total de clientes:</strong> ${totalClientes}</div>
    <div class="summary-item"><strong>Clientes activos:</strong> ${clientesActivos}</div>
    <div class="summary-item"><strong>Total gastado:</strong> S/ ${totalGastado.toLocaleString("es-ES", { minimumFractionDigits: 2 })}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Email</th>
        <th>Teléfono</th>
        <th>Empresa</th>
        <th>Total Compras</th>
        <th>Total Gastado</th>
      </tr>
    </thead>
    <tbody>
      ${clientes
        .map(
          (cliente) => `
        <tr>
          <td>${cliente.nombre}</td>
          <td>${cliente.email}</td>
          <td>${cliente.telefono}</td>
          <td>${cliente.empresa || "-"}</td>
          <td>${clienteStats[cliente.id]?.totalVentas || 0}</td>
          <td>S/ ${(clienteStats[cliente.id]?.totalGastado || 0).toLocaleString("es-ES", { minimumFractionDigits: 2 })}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>

  <div class="footer">
    <p>Generado el ${new Date().toLocaleString("es-ES")}</p>
    <p>Plataforma para gestionar ventas</p>
  </div>
</body>
</html>
  `

  const blob = new Blob([content], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const newWindow = window.open(url, "_blank")
  if (newWindow) {
    newWindow.document.write(content)
    newWindow.document.close()
  } else {
    alert("Por favor, permite las ventanas emergentes para generar el PDF")
  }

  // Limpiar el URL después de un tiempo
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
