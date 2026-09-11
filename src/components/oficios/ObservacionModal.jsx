/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/oficios/ObservacionModal.jsx
 * Propósito: Ventana modal para que los funcionarios registren notas técnicas,
 *            acuerdos o reportes de avance en la tabla 'oficio_seguimiento'.
 * ============================================================================
 */

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageSquarePlus, X, Send } from 'lucide-react';

export function ObservacionModal({ oficio, onClose }) {
  const { agregarSeguimiento } = useStore();

  // Tipo de entrada ('OBSERVACION' | 'AVANCE')
  const [tipo, setTipo] = useState('OBSERVACION');
  // Contenido de la nota
  const [contenido, setContenido] = useState('');

  /**
   * Guarda la observación en el historial de seguimiento del oficio
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contenido.trim()) return;

    agregarSeguimiento(oficio.id, contenido, tipo);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        {/* Cabecera del Modal */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--color-dorado-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-dorado-hover)'
            }}>
              <MessageSquarePlus size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: 'var(--color-guinda-dark)' }}>Agregar Nota de Seguimiento</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-subtle)' }}>Folio: {oficio.folio}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Tipo de Entrada */}
            <div className="form-group">
              <label className="form-label">Tipo de Entrada</label>
              <select
                className="form-select"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="OBSERVACION">Observación / Nota Interna</option>
                <option value="AVANCE">Reporte de Avance / Gestión</option>
              </select>
            </div>

            {/* Contenido / Comentarios */}
            <div className="form-group">
              <label className="form-label">
                Contenido / Comentarios <span className="required">*</span>
              </label>
              <textarea
                className="form-textarea"
                rows={4}
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Escriba los avances, llamadas o gestiones intermedias..."
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} />
              Guardar Nota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
