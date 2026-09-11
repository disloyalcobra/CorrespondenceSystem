/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/reports/ReportesView.jsx
 * Propósito: Módulo de Fiscalización, Control de Gestión y Exportación Ejecutiva.
 *            Genera reportes en formato Excel (CSV) y formato PDF oficial imprimible,
 *            con análisis de tiempos de respuesta y tasas de cumplimiento de términos.
 * ============================================================================
 */

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  TrendingUp,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function ReportesView() {
  const { data, descargarCSV, setSelectedOficioId, setActiveView, addToast } = useStore();

  // Estados locales para los filtros del informe
  const [periodoMes, setPeriodoMes] = useState('2026-09'); // Por defecto: Septiembre 2026
  const [deptoFilter, setDeptoFilter] = useState('ALL');
  const [showPrintModal, setShowPrintModal] = useState(false);

  /**
   * Filtrado de oficios por mes de radicación y departamento asignado
   */
  const filteredOficios = data.oficios.filter(o => {
    // Filtro por mes sobre fecha_recepcion o creado_en
    if (periodoMes !== 'ALL') {
      const oficioDate = o.fecha_recepcion || o.creado_en || '';
      if (!oficioDate.startsWith(periodoMes)) return false;
    }

    // Filtro por departamento
    if (deptoFilter !== 'ALL' && o.departamento_destino_inicial_id !== parseInt(deptoFilter)) {
      return false;
    }

    return true;
  });

  /**
   * Cálculo de Tiempos de Respuesta y Cumplimiento Normativo de Plazos:
   * Evalúa la diferencia en días entre la radicación y la emisión de respuesta formal.
   */
  const reportData = filteredOficios.map(o => {
    const depto = data.departamentos.find(d => d.id === o.departamento_destino_inicial_id);
    const tipo = data.tiposDocumento.find(t => t.id === o.tipo_documento_id);
    const estado = data.estados.find(e => e.id === o.estado_id);
    const remitente = data.usuarios.find(u => u.id === o.remitente_usuario_id);

    // Buscar si existe una respuesta formal emitida en la tabla oficio_seguimiento
    const respuestaSeg = data.seguimientos.find(s => s.oficio_id === o.id && s.tipo === 'RESPUESTA_FORMAL');
    const fechaRespuesta = respuestaSeg ? respuestaSeg.creado_en : (o.estado_id === 5 ? o.creado_en : null);

    // Cálculo del tiempo transcurrido en días
    let tiempoRespuestaDias = null;
    let cumplimiento = 'EN_PROCESO';

    const fechaInicio = new Date(o.fecha_recepcion || o.creado_en);
    if (fechaRespuesta) {
      const fechaFin = new Date(fechaRespuesta);
      const diffMs = fechaFin - fechaInicio;
      tiempoRespuestaDias = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));

      if (o.termino) {
        const fechaTermino = new Date(o.termino);
        cumplimiento = fechaFin <= fechaTermino ? 'EN_TIEMPO' : 'EXTEMPORANEO';
      } else {
        cumplimiento = 'ATENDIDO';
      }
    } else {
      if (o.termino && new Date(o.termino) < new Date()) {
        cumplimiento = 'VENCIDO_PENDIENTE';
      } else {
        cumplimiento = 'EN_PLAZO';
      }
    }

    return {
      ...o,
      deptoNombre: depto ? depto.nombre : 'Sin Asignar',
      tipoNombre: tipo ? tipo.nombre : 'Oficio',
      estadoNombre: estado ? estado.nombre : 'Pendiente',
      remitenteNombre: remitente ? remitente.nombre : 'Oficialía de Partes',
      fechaRespuesta: fechaRespuesta ? fechaRespuesta.split(' ')[0] : 'Pendiente',
      tiempoRespuestaDias,
      cumplimiento
    };
  });

  // Métricas agregadas del periodo evaluado
  const totalPeriodo = reportData.length;
  const concluidosPeriodo = reportData.filter(r => r.estado_id === 4 || r.estado_id === 5).length;
  const vencidosPeriodo = reportData.filter(r => r.cumplimiento === 'VENCIDO_PENDIENTE' || r.cumplimiento === 'EXTEMPORANEO').length;

  const tiemposValidos = reportData.map(r => r.tiempoRespuestaDias).filter(t => t !== null);
  const promedioDiasRespuesta = tiemposValidos.length > 0
    ? (tiemposValidos.reduce((a, b) => a + b, 0) / tiemposValidos.length).toFixed(1)
    : '—';

  const tasaCumplimiento = totalPeriodo > 0
    ? Math.round((concluidosPeriodo / totalPeriodo) * 100)
    : 0;

  /**
   * 1. Exportación de la correspondencia a archivo Excel / CSV
   */
  const exportarCSVCorrespondencia = () => {
    const encabezados = [
      'Folio',
      'Tipo Documento',
      'Asunto',
      'Destinatario',
      'Departamento Asignado',
      'Fecha Recepción',
      'Fecha Término',
      'Fecha Respuesta',
      'Tiempo de Respuesta (Días)',
      'Estado Cumplimiento',
      'Estatus Actual',
      'Remitente Captura'
    ];

    const filas = reportData.map(r => [
      r.folio,
      r.tipoNombre,
      r.asunto,
      r.destinatario,
      r.deptoNombre,
      r.fecha_recepcion,
      r.termino || 'Sin término',
      r.fechaRespuesta,
      r.tiempoRespuestaDias !== null ? `${r.tiempoRespuestaDias} días` : 'En trámite',
      r.cumplimiento,
      r.estadoNombre,
      r.remitenteNombre
    ]);

    const nombre = `Reporte_Correspondencia_SECTUR_${periodoMes}_${Date.now()}.csv`;
    descargarCSV(nombre, encabezados, filas);
  };

  /**
   * 2. Exportación de la bitácora inmutable de auditoría a CSV
   */
  const exportarCSVAuditoria = () => {
    const encabezados = ['ID', 'Fecha y Hora', 'Usuario', 'Acción', 'Entidad', 'Detalle'];
    const filas = data.auditoria.map(a => {
      const u = data.usuarios.find(user => user.id === a.usuario_id);
      return [
        a.id,
        a.creado_en,
        u ? u.nombre : 'Sistema',
        a.accion,
        `${a.entidad} (ID ${a.entidad_id})`,
        a.detalle
      ];
    });

    const nombre = `Bitacora_Auditoria_SECTUR_${Date.now()}.csv`;
    descargarCSV(nombre, encabezados, filas);
  };

  /**
   * 3. Descarga empaquetada de los archivos adjuntos oficiales
   */
  const descargarAdjuntosLote = () => {
    addToast(
      'Descarga Iniciada',
      `Se empaquetaron ${data.adjuntos.length} documentos adjuntos oficiales.`,
      'success'
    );
  };

  return (
    <div className="reportes-container">
      {/* ---------------------------------------------------------------------
          1. ENCABEZADO DE PÁGINA Y ACCIONES PRINCIPALES
          --------------------------------------------------------------------- */}
      <div className="page-header-row">
        <div>
          <div className="breadcrumb-tag">CONTROL DE GESTIÓN Y FISCALIZACIÓN</div>
          <h1 className="page-title">Módulo de Exportación y Reportes Ejecutivos</h1>
          <p className="page-desc">
            Consolidación mensual de correspondencia, análisis de tiempos de respuesta y descarga de expedientes.
          </p>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={exportarCSVCorrespondencia}>
            <FileSpreadsheet size={16} />
            Exportar Excel (CSV)
          </button>
          <button className="btn btn-secondary" onClick={() => setShowPrintModal(true)}>
            <Printer size={16} />
            Reporte Oficial Imprimible
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          2. FILTROS DE PERIODO Y DEPARTAMENTO
          --------------------------------------------------------------------- */}
      <div className="card report-filter-card">
        <div className="filter-controls-row">
          <div className="form-group-inline">
            <label>
              <Calendar size={15} className="text-gold" />
              Periodo de Evaluación:
            </label>
            <select
              className="form-select"
              value={periodoMes}
              onChange={(e) => setPeriodoMes(e.target.value)}
              style={{ width: '220px' }}
            >
              <option value="2026-09">Septiembre 2026 (Actual)</option>
              <option value="2026-08">Agosto 2026</option>
              <option value="2026-07">Julio 2026</option>
              <option value="ALL">Todo el Ejercicio 2026</option>
            </select>
          </div>

          <div className="form-group-inline">
            <label>
              <Building size={15} className="text-gold" />
              Filtrar por Departamento:
            </label>
            <select
              className="form-select"
              value={deptoFilter}
              onChange={(e) => setDeptoFilter(e.target.value)}
              style={{ width: '260px' }}
            >
              <option value="ALL">Todos los Departamentos</option>
              {data.departamentos.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          3. TARJETAS DE INDICADORES (KPIs) DEL PERIODO
          --------------------------------------------------------------------- */}
      <div className="metrics-grid">
        {/* Total oficios del periodo */}
        <div className="metric-card card">
          <div className="metric-header">
            <span className="metric-label">OFICIOS EN PERIODO</span>
            <div className="metric-icon-box bg-gold-subtle">
              <FileText size={20} className="text-gold" />
            </div>
          </div>
          <div className="metric-value">{totalPeriodo}</div>
          <div className="metric-footer">Registrados en {periodoMes === 'ALL' ? '2026' : periodoMes}</div>
        </div>

        {/* Tiempo promedio de respuesta en días */}
        <div className="metric-card card">
          <div className="metric-header">
            <span className="metric-label">TIEMPO PROMEDIO DE RESPUESTA</span>
            <div className="metric-icon-box bg-amber-subtle">
              <Clock size={20} className="text-amber" />
            </div>
          </div>
          <div className="metric-value text-amber">
            {promedioDiasRespuesta} <span className="metric-unit">días</span>
          </div>
          <div className="metric-footer">Desde recepción hasta dictamen</div>
        </div>

        {/* Tasa de cumplimiento de plazos */}
        <div className="metric-card card">
          <div className="metric-header">
            <span className="metric-label">TASA DE CUMPLIMIENTO</span>
            <div className="metric-icon-box bg-green-subtle">
              <CheckCircle2 size={20} className="text-green" />
            </div>
          </div>
          <div className="metric-value text-green">
            {tasaCumplimiento}<span className="metric-unit">%</span>
          </div>
          <div className="metric-footer">{concluidosPeriodo} de {totalPeriodo} concluidos/respondidos</div>
        </div>

        {/* Oficios fuera de término */}
        <div className="metric-card card">
          <div className="metric-header">
            <span className="metric-label">CUMPLIMIENTO FUERA DE TÉRMINO</span>
            <div className="metric-icon-box bg-red-subtle">
              <AlertTriangle size={20} className="text-red" />
            </div>
          </div>
          <div className="metric-value text-red">{vencidosPeriodo}</div>
          <div className="metric-footer">Oficios con retraso en plazo</div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          4. CENTRO DE DESCARGA MASIVA DE EXPEDIENTES
          --------------------------------------------------------------------- */}
      <div className="card download-center-card">
        <div className="download-center-header">
          <Download size={18} className="text-guinda" />
          <h3>Centro de Descarga Masiva de Expedientes</h3>
        </div>
        <div className="download-options-grid">
          {/* Opción 1: CSV de Correspondencia */}
          <div className="download-box-item" onClick={exportarCSVCorrespondencia}>
            <div className="download-box-icon bg-gold-subtle">
              <FileSpreadsheet size={22} className="text-gold" />
            </div>
            <div className="download-box-info">
              <div className="download-box-title">Listado de Correspondencia (Excel)</div>
              <div className="download-box-desc">Descarga el reporte detallado con tiempos de respuesta en .CSV</div>
            </div>
          </div>

          {/* Opción 2: Bitácora de Auditoría */}
          <div className="download-box-item" onClick={exportarCSVAuditoria}>
            <div className="download-box-icon bg-purple-subtle">
              <ShieldCheck size={22} className="text-purple" />
            </div>
            <div className="download-box-info">
              <div className="download-box-title">Bitácora de Auditoría Completa</div>
              <div className="download-box-desc">Exporta el registro inmutable de todos los movimientos del sistema</div>
            </div>
          </div>

          {/* Opción 3: Adjuntos Oficiales */}
          <div className="download-box-item" onClick={descargarAdjuntosLote}>
            <div className="download-box-icon bg-green-subtle">
              <Download size={22} className="text-green" />
            </div>
            <div className="download-box-info">
              <div className="download-box-title">Paquete de Documentos y Adjuntos</div>
              <div className="download-box-desc">Descarga los {data.adjuntos.length} archivos PDF originales y respuestas</div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          5. TABLA CONSOLIDADA CON INDICADORES INDIVIDUALES
          --------------------------------------------------------------------- */}
      <div className="table-container card">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--color-guinda-dark)' }}>
            Detalle Consolidado de Correspondencia ({reportData.length} registros)
          </h3>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-subtle)' }}>
            Mostrando periodo: <strong>{periodoMes === 'ALL' ? 'Todo 2026' : periodoMes}</strong>
          </span>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Asunto</th>
              <th>Área Asignada</th>
              <th>Recepción</th>
              <th>Término</th>
              <th>Respuesta</th>
              <th>Tiempo Respuesta</th>
              <th>Cumplimiento</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 700, color: 'var(--color-guinda-dark)' }}>
                  {r.folio}
                </td>
                <td style={{ maxWidth: '280px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-dark)', fontSize: '13px' }}>
                    {r.asunto}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    Dest: {r.destinatario}
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{r.deptoNombre}</span>
                </td>
                <td style={{ fontSize: '12.5px', color: '#64748B' }}>
                  {r.fecha_recepcion.split(' ')[0]}
                </td>
                <td style={{ fontSize: '12.5px', color: '#64748B' }}>
                  {r.termino || '—'}
                </td>
                <td style={{ fontSize: '12.5px' }}>
                  {r.fechaRespuesta !== 'Pendiente' ? (
                    <span style={{ color: '#059669', fontWeight: 600 }}>{r.fechaRespuesta}</span>
                  ) : (
                    <span style={{ color: '#94A3B8' }}>En trámite</span>
                  )}
                </td>
                <td>
                  {r.tiempoRespuestaDias !== null ? (
                    <strong style={{ color: 'var(--color-guinda-primary)' }}>
                      {r.tiempoRespuestaDias} días
                    </strong>
                  ) : (
                    <span style={{ color: '#94A3B8' }}>—</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${
                    r.cumplimiento === 'EN_TIEMPO' ? 'badge-concluido' :
                    (r.cumplimiento === 'EXTEMPORANEO' || r.cumplimiento === 'VENCIDO_PENDIENTE' ? 'badge-vencido' : 'badge-proceso')
                  }`}>
                    {r.cumplimiento === 'EN_TIEMPO' ? 'En Tiempo' :
                     (r.cumplimiento === 'EXTEMPORANEO' ? 'Extemporáneo' :
                      (r.cumplimiento === 'VENCIDO_PENDIENTE' ? 'Vencido' : 'En Plazo'))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------------------------------------------------------------
          6. MODAL DE VISTA PREVIA IMPRIMIBLE (PDF INSTITUCIONAL)
          --------------------------------------------------------------------- */}
      {showPrintModal && (
        <div className="modal-overlay" onClick={() => setShowPrintModal(false)}>
          <div
            className="modal-content printable-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '900px' }}
          >
            <div className="modal-header no-print">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={18} className="text-guinda" />
                <h3 style={{ fontSize: '16px', color: 'var(--color-guinda-dark)' }}>
                  Vista Previa del Reporte Oficial para Imprimir / PDF
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => window.print()}
                >
                  <Printer size={14} /> Imprimir / Guardar PDF
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowPrintModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div className="modal-body printable-sheet">
              {/* Membrete Oficial */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #691C32', paddingBottom: '14px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#691C32' }}>SECRETARÍA DE TURISMO</h2>
                  <div style={{ fontSize: '12px', color: '#BC955C', fontWeight: 700 }}>DIRECCIÓN GENERAL • CONTROL DE CORRESPONDENCIA</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    INFORME CONSOLIDADO DE GESTIÓN Y ATENCIÓN DE OFICIOS
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11.5px', color: '#334155' }}>
                  <div><strong>Periodo:</strong> {periodoMes === 'ALL' ? 'Ejercicio 2026' : periodoMes}</div>
                  <div><strong>Fecha de Emisión:</strong> {new Date().toLocaleDateString('es-MX')}</div>
                  <div><strong>Folio de Reporte:</strong> INF-SECTUR-2026-09</div>
                </div>
              </div>

              {/* Tarjetas de Resumen en Formato Impreso */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ padding: '10px', background: '#FAF6F0', border: '1px solid #E2E8F0', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>TOTAL OFICIOS</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#691C32' }}>{totalPeriodo}</div>
                </div>
                <div style={{ padding: '10px', background: '#FAF6F0', border: '1px solid #E2E8F0', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>PROMEDIO ATENCIÓN</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#BC955C' }}>{promedioDiasRespuesta} días</div>
                </div>
                <div style={{ padding: '10px', background: '#FAF6F0', border: '1px solid #E2E8F0', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>TASA CUMPLIMIENTO</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#059669' }}>{tasaCumplimiento}%</div>
                </div>
                <div style={{ padding: '10px', background: '#FAF6F0', border: '1px solid #E2E8F0', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>RESUELTOS / CERRADOS</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#691C32' }}>{concluidosPeriodo}</div>
                </div>
              </div>

              {/* Tabla Impresa */}
              <table className="custom-table" style={{ fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th>Folio</th>
                    <th>Asunto</th>
                    <th>Área Destino</th>
                    <th>Recepción</th>
                    <th>Término</th>
                    <th>Días</th>
                    <th>Cumplimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 700 }}>{r.folio}</td>
                      <td>{r.asunto}</td>
                      <td>{r.deptoNombre}</td>
                      <td>{r.fecha_recepcion.split(' ')[0]}</td>
                      <td>{r.termino || '—'}</td>
                      <td>{r.tiempoRespuestaDias !== null ? `${r.tiempoRespuestaDias}d` : '—'}</td>
                      <td>{r.cumplimiento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Líneas de Firma Institucionales */}
              <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div>
                  <div style={{ width: '220px', height: '1px', background: '#94A3B8', margin: '0 auto 6px' }}></div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700 }}>Lic. Claudia Hernández Mora</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Responsable de Oficialía de Partes</div>
                </div>
                <div>
                  <div style={{ width: '220px', height: '1px', background: '#94A3B8', margin: '0 auto 6px' }}></div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700 }}>Mtra. Josefina Morales Ramírez</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Secretaria de Turismo / Directora General</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .reportes-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .report-filter-card {
          padding: 16px 24px;
        }

        .filter-controls-row {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .form-group-inline {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-group-inline label {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text-dark);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .download-center-card {
          padding: 24px;
          background: linear-gradient(135deg, #FAF6F0 0%, #FFFFFF 100%);
          border: 1.5px solid var(--color-dorado-border);
        }

        .download-center-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .download-center-header h3 {
          font-size: 16px;
          color: var(--color-guinda-dark);
        }

        .download-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
        }

        .download-box-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .download-box-item:hover {
          border-color: var(--color-dorado);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .download-box-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .download-box-title {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--color-text-dark);
        }

        .download-box-desc {
          font-size: 11.5px;
          color: var(--color-text-subtle);
          margin-top: 2px;
        }

        .printable-sheet {
          padding: 32px 40px;
          background: #FFFFFF;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          .printable-modal {
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
