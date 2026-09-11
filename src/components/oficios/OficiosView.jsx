/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/oficios/OficiosView.jsx
 * Propósito: Bandeja general de correspondencia con filtrado multidimensional
 *            (por estado, departamento, tipo de documento y búsqueda de texto),
 *            ordenamiento cronológico y acceso a la ficha técnica de cada oficio.
 * ============================================================================
 */

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OficioDetailModal } from './OficioDetailModal';
import {
  Inbox,
  Filter,
  Search,
  FilePlus,
  Building,
  Calendar,
  Clock,
  Send,
  Eye,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Download
} from 'lucide-react';

export function OficiosView() {
  const {
    data,
    activeUser,
    selectedOficioId,
    setSelectedOficioId,
    setActiveView,
    searchQuery,
    setSearchQuery
  } = useStore();

  // Estados locales para los filtros y ordenamiento de la tabla
  const [estadoFilter, setEstadoFilter] = useState('ALL');
  const [deptoFilter, setDeptoFilter] = useState('ALL');
  const [tipoFilter, setTipoFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (más recientes) | 'asc' (más antiguos)

  /**
   * Lógica de Filtrado y Búsqueda en Tiempo Real:
   * Aplica filtros de texto libre (folio, asunto, destinatario u objeto)
   * y filtros categóricos (estado, departamento, tipo de documento).
   */
  const filteredOficios = data.oficios.filter(oficio => {
    // Búsqueda por coincidencia de texto
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchFolio = oficio.folio.toLowerCase().includes(q);
      const matchAsunto = oficio.asunto.toLowerCase().includes(q);
      const matchDestinatario = (oficio.destinatario || '').toLowerCase().includes(q);
      const matchObjeto = (oficio.objeto || '').toLowerCase().includes(q);
      if (!matchFolio && !matchAsunto && !matchDestinatario && !matchObjeto) {
        return false;
      }
    }

    // Filtro por Estado (Mapeo con la tabla 'estados' o condición especial 'VENCIDO')
    if (estadoFilter !== 'ALL') {
      if (estadoFilter === 'VENCIDO') {
        if (oficio.estado_id === 5) return false; // Si ya concluyó no se considera vencido
        if (!oficio.termino) return false;
        return new Date(oficio.termino) < new Date();
      } else {
        if (oficio.estado_id !== parseInt(estadoFilter)) return false;
      }
    }

    // Filtro por Departamento Destino Inicial
    if (deptoFilter !== 'ALL' && oficio.departamento_destino_inicial_id !== parseInt(deptoFilter)) {
      return false;
    }

    // Filtro por Tipo de Documento
    if (tipoFilter !== 'ALL' && oficio.tipo_documento_id !== parseInt(tipoFilter)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Ordenamiento por fecha de registro
    const dateA = new Date(a.creado_en || a.fecha_recepcion);
    const dateB = new Date(b.creado_en || b.fecha_recepcion);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Permisos según el rol activo
  const isGeneradorOrAdmin = activeUser.rol_id === 1 || activeUser.rol_id === 4;
  const isDirectora = activeUser.rol_id === 2;

  return (
    <div className="oficios-container">
      {/* ---------------------------------------------------------------------
          1. CABECERA DE LA BANDEJA Y ACCIÓN DE NUEVO OFICIO
          --------------------------------------------------------------------- */}
      <div className="page-header-row">
        <div>
          <div className="breadcrumb-tag">GESTIÓN INSTITUCIONAL</div>
          <h1 className="page-title">Bandeja General de Oficios</h1>
          <p className="page-desc">
            Consulta, seguimiento y control de expedientes de correspondencia oficial de SECTUR.
          </p>
        </div>

        <div className="page-header-actions">
          {(isGeneradorOrAdmin || isDirectora) && (
            <button
              className="btn btn-primary"
              onClick={() => setActiveView('nuevo')}
            >
              <FilePlus size={18} />
              Nuevo Oficio
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          2. BARRA Y BOTONES DE FILTRADO RÁPIDO (Chips de Estado)
          --------------------------------------------------------------------- */}
      <div className="card filter-card">
        <div className="filter-top-row">
          {/* Chips de filtro rápido por estado */}
          <div className="status-chips-wrap">
            <button
              className={`status-chip ${estadoFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setEstadoFilter('ALL')}
            >
              Todos ({data.oficios.length})
            </button>

            {data.estados.map(st => {
              const count = data.oficios.filter(o => o.estado_id === st.id).length;
              return (
                <button
                  key={st.id}
                  className={`status-chip chip-${st.color} ${estadoFilter === String(st.id) ? 'active' : ''}`}
                  onClick={() => setEstadoFilter(String(st.id))}
                >
                  {st.nombre} ({count})
                </button>
              );
            })}

            <button
              className={`status-chip chip-vencido ${estadoFilter === 'VENCIDO' ? 'active' : ''}`}
              onClick={() => setEstadoFilter('VENCIDO')}
            >
              <AlertTriangle size={13} />
              Vencidos
            </button>
          </div>

          {/* Botón para alternar orden ascendente / descendente */}
          <div className="sort-wrap">
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            >
              <ArrowUpDown size={14} />
              {sortOrder === 'desc' ? 'Más recientes primero' : 'Más antiguos primero'}
            </button>
          </div>
        </div>

        {/* Fila secundaria: Selectores desplegables y campo de búsqueda */}
        <div className="filter-bottom-row">
          {/* Selector de Departamento */}
          <div className="filter-select-group">
            <label>Departamento:</label>
            <select
              className="form-select"
              value={deptoFilter}
              onChange={(e) => setDeptoFilter(e.target.value)}
            >
              <option value="ALL">Todos los Departamentos</option>
              {data.departamentos.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>

          {/* Selector de Tipo de Documento */}
          <div className="filter-select-group">
            <label>Tipo Documento:</label>
            <select
              className="form-select"
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
            >
              <option value="ALL">Todos los Tipos</option>
              {data.tiposDocumento.map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>

          {/* Búsqueda rápida por texto libre */}
          <div className="filter-search-group">
            <label>Búsqueda rápida:</label>
            <div className="inline-search-box">
              <Search size={16} className="inline-search-icon" />
              <input
                type="text"
                placeholder="Filtrar por texto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '34px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          3. TABLA DE OFICIOS Y CORRESPONDENCIA
          --------------------------------------------------------------------- */}
      <div className="table-container card">
        <table className="custom-table oficios-table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Asunto & Objeto</th>
              <th>Tipo</th>
              <th>Área Destino</th>
              <th>Recepción</th>
              <th>Término</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOficios.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '48px 24px', color: '#94A3B8' }}>
                  <Inbox size={40} style={{ margin: '0 auto 12px', color: '#CBD5E1' }} />
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                    No se encontraron oficios con los filtros seleccionados
                  </div>
                  <div style={{ fontSize: '13px', marginTop: '4px' }}>
                    Prueba cambiando los criterios de búsqueda o restablece los filtros.
                  </div>
                </td>
              </tr>
            ) : (
              filteredOficios.map(oficio => {
                const depto = data.departamentos.find(d => d.id === oficio.departamento_destino_inicial_id);
                const tipo = data.tiposDocumento.find(t => t.id === oficio.tipo_documento_id);
                const estado = data.estados.find(e => e.id === oficio.estado_id);

                // Cálculo de días restantes de término
                let diasRestantes = null;
                let isVencido = false;
                if (oficio.termino && oficio.estado_id !== 5) {
                  diasRestantes = Math.ceil((new Date(oficio.termino) - new Date()) / (1000 * 60 * 60 * 24));
                  if (diasRestantes < 0) isVencido = true;
                }

                return (
                  <tr
                    key={oficio.id}
                    className="oficio-row"
                    onClick={() => setSelectedOficioId(oficio.id)}
                  >
                    {/* Folio y etiqueta de urgencia */}
                    <td>
                      <div className="table-folio">{oficio.folio}</div>
                      {oficio.prioridad === 'URGENTE' && (
                        <span className="priority-tag-urgent">URGENTE</span>
                      )}
                    </td>

                    {/* Asunto y Destinatario Externo */}
                    <td style={{ maxWidth: '340px' }}>
                      <div className="table-asunto">{oficio.asunto}</div>
                      <div className="table-destinatario">
                        Dest: {oficio.destinatario}
                      </div>
                    </td>

                    {/* Tipo de Documento */}
                    <td>
                      <span className="doc-type-tag">{tipo?.nombre}</span>
                    </td>

                    {/* Departamento Destino */}
                    <td>
                      <div className="table-depto-name">
                        <Building size={13} className="text-gold" />
                        {depto?.nombre}
                      </div>
                    </td>

                    {/* Fecha de Recepción */}
                    <td style={{ whiteSpace: 'nowrap', fontSize: '12.5px', color: '#64748B' }}>
                      {oficio.fecha_recepcion.split(' ')[0]}
                    </td>

                    {/* Fecha de Término y Días Restantes */}
                    <td>
                      <div className={`table-term ${isVencido ? 'term-vencido' : (diasRestantes !== null && diasRestantes <= 3 ? 'term-critico' : '')}`}>
                        {oficio.termino || '—'}
                        {diasRestantes !== null && (
                          <span className="days-left-chip">
                            {isVencido ? `Vencido (${Math.abs(diasRestantes)}d)` : `${diasRestantes}d`}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Insignia de Estado */}
                    <td>
                      <span className={`badge badge-${oficio.estado_id === 1 ? 'pendiente' : (oficio.estado_id === 2 ? 'turnado' : (oficio.estado_id === 3 ? 'proceso' : (oficio.estado_id === 4 ? 'respondido' : 'concluido')))}`}>
                        {estado?.nombre}
                      </span>
                    </td>

                    {/* Botón para ver Ficha Oficial */}
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setSelectedOficioId(oficio.id)}
                        title="Ver Ficha y Seguimiento"
                      >
                        <Eye size={14} />
                        Ficha
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalle (Ficha Oficial, Timeline y Adjuntos) */}
      {selectedOficioId && (
        <OficioDetailModal
          oficioId={selectedOficioId}
          onClose={() => setSelectedOficioId(null)}
        />
      )}

      <style>{`
        .oficios-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .page-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .breadcrumb-tag {
          font-size: 11px;
          font-weight: 800;
          color: var(--color-dorado-hover);
          letter-spacing: 0.1em;
        }

        .page-title {
          font-size: 24px;
          color: var(--color-guinda-dark);
          margin-top: 2px;
        }

        .page-desc {
          font-size: 13.5px;
          color: var(--color-text-muted);
        }

        .filter-card {
          padding: 18px 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .filter-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .status-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .status-chip {
          padding: 6px 14px;
          border-radius: 9999px;
          border: 1px solid var(--color-border);
          background: #FFFFFF;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-text-dark);
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .status-chip:hover {
          border-color: var(--color-dorado);
          background-color: #FAFBFD;
        }

        .status-chip.active {
          background-color: var(--color-guinda-dark);
          color: #FFFFFF;
          border-color: var(--color-guinda-dark);
          box-shadow: 0 2px 6px rgba(105, 28, 50, 0.25);
        }

        .status-chip.chip-vencido.active {
          background-color: #DC2626;
          border-color: #DC2626;
        }

        .filter-bottom-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1.5fr;
          gap: 16px;
          padding-top: 14px;
          border-top: 1px solid var(--color-border-light);
        }

        @media (max-width: 900px) {
          .filter-bottom-row {
            grid-template-columns: 1fr;
          }
        }

        .filter-select-group, .filter-search-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .filter-select-group label, .filter-search-group label {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--color-text-subtle);
        }

        .inline-search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .inline-search-icon {
          position: absolute;
          left: 12px;
          color: #9CA3AF;
        }

        .oficio-row {
          cursor: pointer;
        }

        .table-folio {
          font-weight: 700;
          color: var(--color-guinda-dark);
          font-size: 13.5px;
        }

        .priority-tag-urgent {
          display: inline-block;
          font-size: 9.5px;
          font-weight: 800;
          background-color: #FEE2E2;
          color: #991B1B;
          padding: 1px 5px;
          border-radius: 4px;
          margin-top: 2px;
        }

        .table-asunto {
          font-weight: 600;
          color: var(--color-text-dark);
          font-size: 13.5px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .table-destinatario {
          font-size: 11.5px;
          color: #64748B;
          margin-top: 2px;
        }

        .doc-type-tag {
          font-size: 12px;
          color: #4B5563;
          background-color: #F1F5F9;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .table-depto-name {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-text-dark);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .table-term {
          font-size: 12.5px;
          color: var(--color-text-muted);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .term-critico {
          color: #D97706;
          font-weight: 700;
        }

        .term-vencido {
          color: #DC2626;
          font-weight: 700;
        }

        .days-left-chip {
          font-size: 11px;
          color: inherit;
        }
      `}</style>
    </div>
  );
}
