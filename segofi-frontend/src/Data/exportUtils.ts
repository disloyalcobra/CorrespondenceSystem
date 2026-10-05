import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  type EvaluacionOficio,
  ETIQUETA_CUMPLIMIENTO,
  etiquetaTipo,
  formatoFecha,
} from "./analisisOficios";

export async function exportarReporteExcel(
  filas: EvaluacionOficio[],
  desde: string,
  hasta: string
) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Sistema SegOfi";
  wb.created = new Date();

  const fechaGeneracion = new Date().toLocaleString("es-MX");
  const periodoFiltro =
    desde || hasta
      ? `${desde ? "Desde " + desde : ""} ${hasta ? "Hasta " + hasta : ""}`.trim()
      : "Histórico completo";

  const total = filas.length;
  const enTiempo = filas.filter((r) => r.cumplimiento === "EN_TIEMPO").length;
  const extemporaneos = filas.filter((r) => r.cumplimiento === "EXTEMPORANEO").length;
  const vencidos = filas.filter((r) => r.cumplimiento === "VENCIDO_PENDIENTE").length;

  // HOJA 1: RESUMEN
  const wsResumen = wb.addWorksheet("Resumen");
  wsResumen.getColumn("A").width = 30;
  wsResumen.getColumn("B").width = 40;

  wsResumen.getCell("A1").value = "Reporte de Oficios - SegOfi";
  wsResumen.getCell("A1").font = { bold: true, size: 16, color: { argb: "FF691C32" } }; // Color guinda
  
  wsResumen.getCell("A3").value = "Fecha de generación:";
  wsResumen.getCell("B3").value = fechaGeneracion;
  
  wsResumen.getCell("A4").value = "Período reportado:";
  wsResumen.getCell("B4").value = periodoFiltro;

  wsResumen.getCell("A6").value = "INDICADORES";
  wsResumen.getCell("A6").font = { bold: true, size: 12 };

  wsResumen.getCell("A7").value = "Total analizados:";
  wsResumen.getCell("B7").value = total;
  wsResumen.getCell("A8").value = "En tiempo:";
  wsResumen.getCell("B8").value = enTiempo;
  wsResumen.getCell("A9").value = "Extemporáneos:";
  wsResumen.getCell("B9").value = extemporaneos;
  wsResumen.getCell("A10").value = "Vencidos:";
  wsResumen.getCell("B10").value = vencidos;

  // HOJA 2: DETALLE
  const wsDetalle = wb.addWorksheet("Detalle");
  
  wsDetalle.columns = [
    { header: "Folio", key: "folio", width: 15 },
    { header: "Asunto", key: "asunto", width: 40 },
    { header: "Departamento", key: "departamento", width: 30 },
    { header: "Tipo", key: "tipo", width: 15 },
    { header: "Recepción", key: "recepcion", width: 15 },
    { header: "Término", key: "termino", width: 15 },
    { header: "Atención", key: "atencion", width: 15 },
    { header: "Días Respuesta", key: "dias", width: 15 },
    { header: "Cumplimiento", key: "cumplimiento", width: 20 },
  ];

  // Estilo encabezados
  const headerRow = wsDetalle.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF691C32" }, // Guinda
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };

  // Datos
  filas.forEach((r) => {
    wsDetalle.addRow({
      folio: r.oficio.numero, // Folio como texto explícito
      asunto: r.oficio.asunto,
      departamento: r.oficio.departamento,
      tipo: etiquetaTipo(r.tipo),
      recepcion: r.recepcion ? new Date(r.recepcion) : null,
      termino: r.termino ? new Date(r.termino) : null,
      atencion: r.fechaRespuesta ? new Date(r.fechaRespuesta) : null,
      dias: r.tiempoRespuestaDias ?? "",
      cumplimiento: ETIQUETA_CUMPLIMIENTO[r.cumplimiento],
    });
  });

  // Formatear filas y autofiltro
  wsDetalle.autoFilter = "A1:I1";
  wsDetalle.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];

  wsDetalle.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.getCell("folio").numFmt = "@"; // Texto
      row.getCell("recepcion").numFmt = "dd/mm/yyyy";
      row.getCell("termino").numFmt = "dd/mm/yyyy";
      row.getCell("atencion").numFmt = "dd/mm/yyyy";
      
      // Permitir varias líneas en asunto
      row.getCell("asunto").alignment = { wrapText: true, vertical: "top" };
      row.getCell("departamento").alignment = { wrapText: true, vertical: "top" };
      
      // Filas alternadas
      if (rowNumber % 2 === 0) {
        row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" } }; // gray-50
      }
    }
  });

  // Generar buffer y descargar
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const nombreArchivo = `Reporte_Oficios_${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportarReportePdf(
  filas: EvaluacionOficio[],
  desde: string,
  hasta: string
) {
  const doc = new jsPDF("landscape");
  
  const periodoFiltro =
    desde || hasta
      ? `${desde ? "Desde " + desde : ""} ${hasta ? "Hasta " + hasta : ""}`.trim()
      : "Histórico completo";
  
  const total = filas.length;
  const enTiempo = filas.filter((r) => r.cumplimiento === "EN_TIEMPO").length;
  const extemporaneos = filas.filter((r) => r.cumplimiento === "EXTEMPORANEO").length;
  const vencidos = filas.filter((r) => r.cumplimiento === "VENCIDO_PENDIENTE").length;

  // ENCABEZADO
  doc.setFontSize(18);
  doc.setTextColor(105, 28, 50); // Guinda RGB(105, 28, 50)
  doc.text("Sistema SegOfi - Reporte de Documentos", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Fecha de generación: ${new Date().toLocaleString("es-MX")}`, 14, 28);
  doc.text(`Período reportado: ${periodoFiltro}`, 14, 34);

  // INDICADORES
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text(`Total: ${total} | En tiempo: ${enTiempo} | Extemporáneos: ${extemporaneos} | Vencidos: ${vencidos}`, 14, 42);

  // TABLA
  const head = [[
    "Folio",
    "Asunto",
    "Departamento",
    "Tipo",
    "Recepción",
    "Término",
    "Atención",
    "Días",
    "Cumplimiento"
  ]];

  const body = filas.map((r) => [
    r.oficio.numero,
    r.oficio.asunto,
    r.oficio.departamento,
    etiquetaTipo(r.tipo),
    formatoFecha(r.recepcion),
    formatoFecha(r.termino),
    formatoFecha(r.fechaRespuesta),
    r.tiempoRespuestaDias?.toString() ?? "-",
    ETIQUETA_CUMPLIMIENTO[r.cumplimiento]
  ]);

  autoTable(doc, {
    startY: 50,
    head: head,
    body: body,
    headStyles: { fillColor: [105, 28, 50] }, // Guinda
    styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
    columnStyles: {
      1: { cellWidth: 60 }, // Asunto más ancho
      2: { cellWidth: 40 }, // Departamento
    },
    alternateRowStyles: { fillColor: [249, 250, 251] }, // Gris claro
    didDrawPage: (data) => {
      // Número de página en el pie
      const str = `Página ${doc.getCurrentPageInfo().pageNumber}`;
      doc.setFontSize(9);
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 10);
    }
  });

  const nombreArchivo = `Reporte_Oficios_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(nombreArchivo);
}

export function exportarFichaOficioPdf(oficio: EvaluacionOficio["oficio"]) {
  const doc = new jsPDF();

  // ENCABEZADO
  doc.setFontSize(18);
  doc.setTextColor(105, 28, 50); // Guinda
  doc.text("Sistema SegOfi - Ficha del oficio", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Fecha de generación: ${new Date().toLocaleString("es-MX")}`, 14, 28);

  // SECCIÓN: Identificación
  doc.setFontSize(12);
  doc.setTextColor(105, 28, 50);
  doc.text("Identificación", 14, 40);

  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(`Folio: ${oficio.numero}`, 14, 48);
  doc.text(`Tipo: ${etiquetaTipo(oficio.tipo ?? "oficio")}`, 14, 54);
  doc.text(`Fecha de registro: ${oficio.fecha}`, 14, 60);
  doc.text(`Estado: ${oficio.estado}`, 14, 66);
  if (oficio.folioSalida) {
    doc.text(`Folio de salida: ${oficio.folioSalida}`, 14, 72);
  }

  // SECCIÓN: Datos del oficio
  let y = oficio.folioSalida ? 84 : 78;
  doc.setFontSize(12);
  doc.setTextColor(105, 28, 50);
  doc.text("Datos del oficio", 14, y);

  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  
  y += 8;
  const asuntoLines = doc.splitTextToSize(`Asunto / Objeto: ${oficio.asunto}`, 180);
  doc.text(asuntoLines, 14, y);
  y += asuntoLines.length * 5 + 2;

  doc.text(`Remitente / Destinatario (Departamento): ${oficio.departamento}`, 14, y);
  y += 6;
  if (oficio.destinatariosPersonas?.length) {
    doc.text(`Atención a: ${oficio.destinatariosPersonas.join(", ")}`, 14, y);
    y += 6;
  }

  // SECCIÓN: Fechas y Adjuntos
  y += 6;
  doc.setFontSize(12);
  doc.setTextColor(105, 28, 50);
  doc.text("Fechas y Adjuntos", 14, y);

  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  y += 8;
  doc.text(`Fecha límite (Término): ${oficio.termino ? formatoFecha(new Date(oficio.termino + "T00:00:00")) : "No registrado"}`, 14, y);
  y += 6;
  doc.text(`Fecha de envío: ${oficio.fechaEnvio || "No registrado"}`, 14, y);
  y += 6;
  doc.text(`Documento principal: ${oficio.archivo || "No registrado"}`, 14, y);
  y += 6;

  if (oficio.adjuntos && oficio.adjuntos.length > 0) {
    doc.text(`Otros adjuntos:`, 14, y);
    y += 6;
    oficio.adjuntos.forEach((adj) => {
      doc.text(`- ${adj.nombre} (Agregado: ${adj.fecha})`, 18, y);
      y += 6;
    });
  }

  // Numeración de página
  doc.setFontSize(9);
  doc.text(`Página 1 de 1`, 14, doc.internal.pageSize.getHeight() - 10);

  const safeName = oficio.numero.replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`ficha_oficio_${safeName}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportarSeguimientoPdf(oficio: EvaluacionOficio["oficio"]) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(105, 28, 50);
  doc.text("Sistema SegOfi - Seguimiento del oficio", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(`Folio: ${oficio.numero}`, 14, 30);
  doc.text(`Estado actual: ${oficio.estado}`, 14, 36);
  doc.text(`Departamento: ${oficio.departamento}`, 14, 42);
  if (oficio.termino) {
    doc.text(`Límite: ${formatoFecha(new Date(oficio.termino + "T00:00:00"))}`, 14, 48);
  }

  const head = [["Fecha y hora", "Usuario / Depto", "Acción / Movimiento"]];
  const body = oficio.seguimiento.map(s => [s.fecha, s.autor, s.accion]);

  autoTable(doc, {
    startY: 56,
    head: head,
    body: body,
    headStyles: { fillColor: [105, 28, 50] },
    styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak' },
    columnStyles: { 
      0: { cellWidth: 35 }, 
      1: { cellWidth: 50 },
      2: { cellWidth: 'auto' }
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    didDrawPage: (data) => {
      doc.setFontSize(9);
      doc.text(`Página ${doc.getCurrentPageInfo().pageNumber}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
    }
  });

  const safeName = oficio.numero.replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`seguimiento_oficio_${safeName}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export async function exportarSeguimientoExcel(oficio: EvaluacionOficio["oficio"]) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Sistema SegOfi";

  // HOJA 1: RESUMEN
  const wsResumen = wb.addWorksheet("Resumen");
  wsResumen.columns = [{ width: 25 }, { width: 50 }];
  
  wsResumen.getCell("A1").value = "Seguimiento de Oficio - SegOfi";
  wsResumen.getCell("A1").font = { bold: true, size: 14, color: { argb: "FF691C32" } };
  
  wsResumen.getCell("A3").value = "Folio:";
  wsResumen.getCell("B3").value = oficio.numero;
  
  wsResumen.getCell("A4").value = "Asunto:";
  wsResumen.getCell("B4").value = oficio.asunto;
  
  wsResumen.getCell("A5").value = "Estado actual:";
  wsResumen.getCell("B5").value = oficio.estado;

  if (oficio.termino) {
    wsResumen.getCell("A6").value = "Fecha límite (Término):";
    wsResumen.getCell("B6").value = new Date(oficio.termino + "T00:00:00");
    wsResumen.getCell("B6").numFmt = "dd/mm/yyyy";
  }

  // HOJA 2: HISTORIAL
  const wsDetalle = wb.addWorksheet("Historial");
  wsDetalle.columns = [
    { header: "Fecha y hora", key: "fecha", width: 20 },
    { header: "Usuario / Depto", key: "autor", width: 35 },
    { header: "Acción / Movimiento", key: "accion", width: 80 }
  ];

  const headerRow = wsDetalle.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF691C32" } };

  oficio.seguimiento.forEach(s => {
    wsDetalle.addRow({
      fecha: s.fecha,
      autor: s.autor,
      accion: s.accion
    });
  });

  wsDetalle.autoFilter = "A1:C1";
  wsDetalle.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];

  wsDetalle.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.getCell("accion").alignment = { wrapText: true, vertical: "top" };
      row.getCell("autor").alignment = { wrapText: true, vertical: "top" };
      if (rowNumber % 2 === 0) {
        row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" } };
      }
    }
  });

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = oficio.numero.replace(/[^a-zA-Z0-9_-]/g, "_");
  a.download = `seguimiento_oficio_${safeName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
