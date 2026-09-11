/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/admin/DepartamentosView.jsx
 * Propósito: Mantenimiento del catálogo de Departamentos y Unidades Orgánicas
 *            (Tabla 'departamentos' en schema.db).
 * ============================================================================
 */

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Building, Plus, Layers, Search, Check, Tag } from 'lucide-react';

export function DepartamentosView() {
  const { data, agregarDepartamento, activeUser } = useStore();

  // Control del modal de alta de departamento
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'OPERATIVO',
    clave: ''
  });

  /**
   * Guarda el nuevo departamento en el catálogo institucional
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    agregarDepartamento(formData);
    setFormData({ nombre: '', tipo: 'OPERATIVO', clave: '' });
    setShowModal(false);
  };

  return (
    <div className="admin-container">
      {/* ---------------------------------------------------------------------
          1. CABECERA DEL CATÁLOGO
          --------------------------------------------------------------------- */}
      <div className="page-header-row">
        <div>
          <div className="breadcrumb-tag">CATÁLOGOS INSTITUCIONALES</div>
          <h1 className="page-title">Directorio de Departamentos</h1>
          <p className="page-desc">
            Estructura orgánica de la Secretaría de Turismo para asignación y despacho de correspondencia.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Nuevo Departamento
        </button>
      </div>

      {/* ---------------------------------------------------------------------
          2. TABLA DE DEPARTAMENTOS
          --------------------------------------------------------------------- */}
      <div className="table-container card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Área / Departamento</th>
              <th>Tipo de Unidad</th>
              <th>Clave</th>
              <th>Oficios Asignados</th>
            </tr>
          </thead>
          <tbody>
            {data.departamentos.map(d => {
              const oficiosCount = data.oficios.filter(o => o.departamento_destino_inicial_id === d.id).length;
              return (
                <tr key={d.id}>
                  <td style={{ fontWeight: 700, color: 'var(--color-guinda-dark)' }}>
                    #{d.id}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                      <Building size={16} className="text-gold" />
                      {d.nombre}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-dorado font-bold">
                      {d.tipo}
                    </span>
                  </td>
                  <td>
                    <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                      {d.clave || `DEP-${d.id}`}
                    </code>
                  </td>
                  <td>
                    <strong>{oficiosCount}</strong> en expediente
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ---------------------------------------------------------------------
          3. MODAL PARA REGISTRAR NUEVO DEPARTAMENTO
          --------------------------------------------------------------------- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', color: 'var(--color-guinda-dark)' }}>Registrar Nuevo Departamento</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nombre del Departamento <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej. Dirección de Fomento Gastronómico"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo de Unidad</label>
                  <select
                    className="form-select"
                    value={formData.tipo}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                  >
                    <option value="DIRECCION_GENERAL">Dirección General</option>
                    <option value="OPERATIVO">Área Operativa</option>
                    <option value="ADMINISTRATIVO">Área Administrativa</option>
                    <option value="PROMOCION">Promoción y Difusión</option>
                    <option value="JURIDICO">Asuntos Jurídicos</option>
                    <option value="PROGRAMAS">Programas Especiales</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Clave Institucional</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.clave}
                    onChange={(e) => setFormData(prev => ({ ...prev, clave: e.target.value }))}
                    placeholder="Ej. DFG"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Departamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
