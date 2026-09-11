/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/admin/AuditoriaView.jsx
 * Propósito: Módulo de Fiscalización y Bitácora Inmutable de Auditoría
 *            (Tabla 'auditoria' en schema.db).
 * ============================================================================
 */

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Search, Filter, Clock, User, Tag, FileText } from 'lucide-react';

export function AuditoriaView() {
  const { data } = useStore();

  // Estados locales para filtrado por tipo de acción y búsqueda de texto
  const [filterAccion, setFilterAccion] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Filtrado dinámico de eventos de auditoría
   */
  const filteredLogs = data.auditoria.filter(log => {
    if (filterAccion !== 'ALL' && log.accion !== filterAccion) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchDetalle = log.detalle.toLowerCase().includes(q);
      const matchAccion = log.accion.toLowerCase().includes(q);
      const usr = data.usuarios.find(u => u.id === log.usuario_id);
      const matchUser = usr ? usr.nombre.toLowerCase().includes(q) : false;
      if (!matchDetalle && !matchAccion && !matchUser) return false;
    }
    return true;
  });

  // Lista de acciones únicas presentes en el historial
  const uniqueAcciones = Array.from(new Set(data.auditoria.map(a => a.accion)));

  return (
    <div className="admin-container">
      {/* ---------------------------------------------------------------------
          1. CABECERA DE FISCALIZACIÓN
          --------------------------------------------------------------------- */}
      <div className="page-header-row">
        <div>
          <div className="breadcrumb-tag">TRAZABILIDAD Y FISCALIZACIÓN</div>
          <h1 className="page-title">Bitácora de Auditoría del Sistema</h1>
          <p className="page-desc">
            Registro inmutable de todas las acciones, turnos y respuestas conforme a la tabla `auditoria` de `schema.db`.
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          2. BARRA DE FILTRADO
          --------------------------------------------------------------------- */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-subtle)' }}>Filtrar Acción:</label>
          <select
            className="form-select"
            style={{ width: '220px' }}
            value={filterAccion}
            onChange={(e) => setFilterAccion(e.target.value)}
          >
            <option value="ALL">Todas las Acciones ({data.auditoria.length})</option>
            {uniqueAcciones.map(acc => (
              <option key={acc} value={acc}>{acc}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por usuario o detalle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          3. TABLA DE REGISTROS DE AUDITORÍA
          --------------------------------------------------------------------- */}
      <div className="table-container card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha y Hora</th>
              <th>Usuario Responsable</th>
              <th>Acción</th>
              <th>Entidad / Tabla</th>
              <th>Detalle del Registro</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => {
              const usr = data.usuarios.find(u => u.id === log.usuario_id);
              return (
                <tr key={log.id}>
                  <td style={{ fontWeight: 700, color: '#94A3B8' }}>#{log.id}</td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '12.5px', color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {log.creado_en}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-dark)', fontSize: '13px' }}>
                      {usr?.nombre || 'Sistema Automatizado'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      {usr?.cargo}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-dorado font-bold">
                      {log.accion}
                    </span>
                  </td>
                  <td>
                    <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '11.5px', color: 'var(--color-guinda-dark)' }}>
                      {log.entidad} (ID: {log.entidad_id})
                    </code>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--color-text-dark)' }}>
                    {log.detalle}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
      `}</style>
    </div>
  );
}
