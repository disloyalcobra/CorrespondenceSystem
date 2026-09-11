/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/dashboard/DashboardView.jsx
 * Propósito: Panel de control ejecutivo y resumen de indicadores (KPIs).
 *            Permite a los directivos y personal ver el estado general de los
 *            oficios, alertas de vencimiento, carga por área y auditoría reciente.
 * ============================================================================
 */

import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Inbox,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  FilePlus,
  ArrowRight,
  TrendingUp,
  Building,
  FileText,
  Calendar,
  User,
  ShieldCheck,
  Eye
} from 'lucide-react';

export function DashboardView() {
  // Consumo del estado global reactivo desde StoreContext
  const {
    data,
    metrics,
    setActiveView,
    setSelectedOficioId,
    activeUser,
    activeRole
  } = useStore();

  /**
   * Cálculo de oficios con atención prioritaria:
   * Filtra aquellos que no estén concluidos y calcula los días restantes para su vencimiento.
   */
  const urgentOficios = data.oficios
    .filter(o => o.estado_id !== 5) // Excluir concluidos (ID 5)
    .map(o => {
      const depto = data.departamentos.find(d => d.id === o.departamento_destino_inicial_id);
      const estado = data.estados.find(e => e.id === o.estado_id);
      const tipo = data.tiposDocumento.find(t => t.id === o.tipo_documento_id);
      
      let diasRestantes = null;
      let urgenciaNivel = 'normal';
      
      if (o.termino) {
        const diff = Math.ceil((new Date(o.termino) - new Date()) / (1000 * 60 * 60 * 24));
        diasRestantes = diff;
        if (diff < 0) urgenciaNivel = 'vencido';
        else if (diff <= 3) urgenciaNivel = 'critico';
        else if (diff <= 7) urgenciaNivel = 'preventivo';
      }

      return {
        ...o,
        deptoNombre: depto ? depto.nombre : 'Sin asignar',
        estadoNombre: estado ? estado.nombre : 'Desconocido',
        tipoNombre: tipo ? tipo.nombre : 'Documento',
        diasRestantes,
        urgenciaNivel
      };
    })
    .sort((a, b) => (a.diasRestantes ?? 999) - (b.diasRestantes ?? 999));

  /**
   * Distribución y porcentaje de carga de trabajo por departamento
   */
  const deptoStats = data.departamentos.map(d => {
    const oficiosCount = data.oficios.filter(o => o.departamento_destino_inicial_id === d.id).length;
    const pendientesCount = data.oficios.filter(o => o.departamento_destino_inicial_id === d.id && o.estado_id === 1).length;
    return {
      ...d,
      total: oficiosCount,
      pendientes: pendientesCount
    };
  }).sort((a, b) => b.total - a.total);

  /**
   * Obtiene los últimos 5 eventos registrados en la bitácora de auditoría
   */
  const recentAudit = data.auditoria.slice(0, 5).map(a => {
    const usr = data.usuarios.find(u => u.id === a.usuario_id);
    return {
      ...a,
      usuarioNombre: usr ? usr.nombre : 'Sistema',
      cargo: usr ? usr.cargo : ''
    };
  });

  // Permisos condicionales según el rol del usuario autenticado
  const isGeneradorOrAdmin = activeUser.rol_id === 1 || activeUser.rol_id === 4;
  const isDirectora = activeUser.rol_id === 2;

  return (
    <div className="dashboard-container">
      {/* ---------------------------------------------------------------------
          1. BANNER DE BIENVENIDA INSTITUCIONAL
          --------------------------------------------------------------------- */}
      <div className="welcome-banner card card-gold-accent">
        <div className="welcome-content">
          <div className="welcome-subtitle">
            <span className="inst-tag">SECRETARÍA DE TURISMO</span>
            <span className="date-tag">
              <Calendar size={14} />
              {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="welcome-title">
            Bienvenido(a), {activeUser.nombre}
          </h1>
          <p className="welcome-desc">
            Panel ejecutivo para el seguimiento, turno y control de la correspondencia oficial de SECTUR.
          </p>
        </div>

        <div className="welcome-actions">
          {(isGeneradorOrAdmin || isDirectora) && (
            <button
              className="btn btn-primary"
              onClick={() => setActiveView('nuevo')}
            >
              <FilePlus size={18} />
              Nuevo Oficio
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={() => setActiveView('oficios')}
          >
            <Inbox size={18} />
            Ver Todos los Oficios
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          2. CUADRÍCULA DE MÉTRICAS (KPIs) CON DISEÑO UNIFICADO
          --------------------------------------------------------------------- */}
      <div className="metrics-grid">
        {/* Total de Oficios */}
        <div className="metric-card card">
          <div className="metric-header">
            <span className="metric-label">TOTAL OFICIOS</span>
            <div className="metric-icon-box bg-gold-subtle">
              <FileText size={20} className="text-gold" />
            </div>
          </div>
          <div className="metric-value">{metrics.total}</div>
          <div className="metric-footer">Registrados en la plataforma</div>
        </div>

        {/* Pendientes de Turno */}
        <div
          className="metric-card card clickable"
          onClick={() => setActiveView('oficios')}
        >
          <div className="metric-header">
            <span className="metric-label">PENDIENTES DE TURNO</span>
            <div className="metric-icon-box bg-amber-subtle">
              <Clock size={20} className="text-amber" />
            </div>
          </div>
          <div className="metric-value text-amber">{metrics.pendientes}</div>
          <div className="metric-footer">Requieren revisión de Directora</div>
        </div>

        {/* Turnados y en Proceso */}
        <div
          className="metric-card card clickable"
          onClick={() => setActiveView('oficios')}
        >
          <div className="metric-header">
            <span className="metric-label">TURNADOS / EN PROCESO</span>
            <div className="metric-icon-box bg-purple-subtle">
              <Send size={20} className="text-purple" />
            </div>
          </div>
          <div className="metric-value text-purple">{metrics.turnados + metrics.enProceso}</div>
          <div className="metric-footer">En atención en departamentos</div>
        </div>

        {/* Por Vencer / Vencidos */}
        <div
          className="metric-card card clickable"
          onClick={() => setActiveView('oficios')}
        >
          <div className="metric-header">
            <span className="metric-label">POR VENCER / VENCIDOS</span>
            <div className="metric-icon-box bg-red-subtle">
              <AlertTriangle size={20} className="text-red" />
            </div>
          </div>
          <div className="metric-value text-red">{metrics.vencidos}</div>
          <div className="metric-footer">Atención urgente requerida</div>
        </div>

        {/* Concluidos */}
        <div className="metric-card card">
          <div className="metric-header">
            <span className="metric-label">CONCLUIDOS</span>
            <div className="metric-icon-box bg-green-subtle">
              <CheckCircle2 size={20} className="text-green" />
            </div>
          </div>
          <div className="metric-value text-green">{metrics.concluidos}</div>
          <div className="metric-footer">Atendidos con respuesta formal</div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          3. SECCIÓN DOBLE: ATENCIÓN PRIORITARIA Y CARGA POR DEPARTAMENTO
          --------------------------------------------------------------------- */}
      <div className="dashboard-grid-two">
        {/* Lista de oficios urgentes con semáforo de vencimiento */}
        <div className="card dashboard-section">
          <div className="section-header">
            <div className="section-title-wrap">
              <AlertTriangle size={18} className="text-red" />
              <h2>Atención Prioritaria (Término y Vencimiento)</h2>
            </div>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setActiveView('oficios')}
            >
              Ver bandeja <ArrowRight size={14} />
            </button>
          </div>

          <div className="urgent-list">
            {urgentOficios.slice(0, 4).map(oficio => (
              <div
                key={oficio.id}
                className={`urgent-card-item urgency-${oficio.urgenciaNivel}`}
                onClick={() => {
                  setSelectedOficioId(oficio.id);
                  setActiveView('oficios');
                }}
              >
                <div className="urgent-top">
                  <span className="urgent-folio">{oficio.folio}</span>
                  <span className={`badge badge-${oficio.estado_id === 1 ? 'pendiente' : (oficio.estado_id === 2 ? 'turnado' : 'proceso')}`}>
                    {oficio.estadoNombre}
                  </span>
                </div>

                <div className="urgent-asunto">{oficio.asunto}</div>

                <div className="urgent-bottom">
                  <span className="urgent-depto">
                    <Building size={13} />
                    {oficio.deptoNombre}
                  </span>

                  <span className="urgent-days-badge">
                    <Clock size={13} />
                    {oficio.diasRestantes === null ? 'Sin fecha límite' : (
                      oficio.diasRestantes < 0
                        ? `Vencido hace ${Math.abs(oficio.diasRestantes)} días`
                        : `${oficio.diasRestantes} días restantes`
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfica de barras con la carga de trabajo de cada departamento */}
        <div className="card dashboard-section">
          <div className="section-header">
            <div className="section-title-wrap">
              <Building size={18} className="text-gold" />
              <h2>Carga por Departamento</h2>
            </div>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setActiveView('departamentos')}
            >
              Ver áreas <ArrowRight size={14} />
            </button>
          </div>

          <div className="depto-stats-list">
            {deptoStats.map(d => {
              const percentage = metrics.total > 0 ? Math.round((d.total / metrics.total) * 100) : 0;
              return (
                <div key={d.id} className="depto-stat-row">
                  <div className="depto-stat-info">
                    <span className="depto-stat-name">{d.nombre}</span>
                    <span className="depto-stat-count">
                      <strong>{d.total}</strong> oficios ({percentage}%)
                    </span>
                  </div>
                  <div className="stat-progress-bg">
                    <div
                      className="stat-progress-fill"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          4. BITÁCORA DE AUDITORÍA RECIENTE
          --------------------------------------------------------------------- */}
      <div className="card dashboard-section mt-6">
        <div className="section-header">
          <div className="section-title-wrap">
            <ShieldCheck size={18} className="text-guinda" />
            <h2>Bitácora de Trazabilidad Reciente</h2>
          </div>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setActiveView('auditoria')}
          >
            Ver toda la bitácora <ArrowRight size={14} />
          </button>
        </div>

        <div className="recent-audit-table">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Usuario</th>
                <th>Acción Realizada</th>
                <th>Detalle del Evento</th>
              </tr>
            </thead>
            <tbody>
              {recentAudit.map(log => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '13px', color: '#64748B' }}>
                    {log.creado_en}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-dark)' }}>
                      {log.usuarioNombre}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                      {log.cargo}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-dorado font-bold">
                      {log.accion}
                    </span>
                  </td>
                  <td style={{ fontSize: '13.5px' }}>{log.detalle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .welcome-banner {
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #FFFFFF 0%, #FAF6F0 100%);
          border-left: 5px solid var(--color-guinda-dark);
        }

        .welcome-content {
          max-width: 700px;
        }

        .welcome-subtitle {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .inst-tag {
          font-size: 11px;
          font-weight: 800;
          color: var(--color-guinda-primary);
          letter-spacing: 0.08em;
        }

        .date-tag {
          font-size: 12px;
          color: #64748B;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .welcome-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--color-guinda-dark);
          margin-bottom: 6px;
        }

        .welcome-desc {
          font-size: 14px;
          color: var(--color-text-muted);
        }

        .welcome-actions {
          display: flex;
          gap: 12px;
        }

        .dashboard-grid-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .dashboard-grid-two {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-section {
          padding: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1.5px solid var(--color-border-light);
        }

        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-title-wrap h2 {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-guinda-dark);
        }

        .urgent-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .urgent-card-item {
          padding: 14px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .urgent-card-item:hover {
          border-color: var(--color-dorado);
          transform: translateX(4px);
          box-shadow: var(--shadow-sm);
        }

        .urgent-card-item.urgency-critico {
          border-left: 4px solid #EF4444;
          background-color: #FFFDFD;
        }

        .urgent-card-item.urgency-vencido {
          border-left: 4px solid #991B1B;
          background-color: #FEF2F2;
        }

        .urgent-card-item.urgency-preventivo {
          border-left: 4px solid #F59E0B;
        }

        .urgent-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .urgent-folio {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-guinda-dark);
        }

        .urgent-asunto {
          font-size: 13.5px;
          color: var(--color-text-dark);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .urgent-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #64748B;
        }

        .urgent-depto {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .urgent-days-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          color: #DC2626;
        }

        .depto-stats-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .depto-stat-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .depto-stat-info {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .depto-stat-name {
          font-weight: 600;
          color: var(--color-text-dark);
        }

        .depto-stat-count {
          color: #64748B;
        }

        .stat-progress-bg {
          width: 100%;
          height: 8px;
          background-color: #F1F5F9;
          border-radius: 9999px;
          overflow: hidden;
        }

        .stat-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-guinda-primary) 0%, var(--color-dorado) 100%);
          border-radius: 9999px;
        }

        .mt-6 {
          margin-top: 24px;
        }

        .recent-audit-table {
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}
