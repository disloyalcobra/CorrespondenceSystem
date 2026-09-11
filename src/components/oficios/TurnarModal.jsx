/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/oficios/TurnarModal.jsx
 * Propósito: Ventana modal para que la Directora General turne un oficio
 *            a un área operativa o administrativa con instrucciones precisas.
 * ============================================================================
 */

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Send, Building2, X, AlertCircle } from 'lucide-react';

export function TurnarModal({ oficio, onClose }) {
  const { data, turnarOficio, activeUser } = useStore();

  // Departamento seleccionado para el turno
  const [departamentoId, setDepartamentoId] = useState(
    oficio.departamento_destino_inicial_id || (data.departamentos[1]?.id || '')
  );

  // Instrucción institucional que acompañará al turno
  const [instrucciones, setInstrucciones] = useState(
    'Para su debida atención, trámite y resolución conforme a las atribuciones de su área.'
  );

  /**
   * Ejecuta el turno del oficio en la base de datos reactiva
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!departamentoId) return;

    turnarOficio(oficio.id, departamentoId, instrucciones);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        {/* Cabecera del Modal */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--color-guinda-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-guinda-primary)'
            }}>
              <Send size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: 'var(--color-guinda-dark)' }}>Turnar Oficio a Departamento</h3>
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
            {/* Resumen del Asunto */}
            <div style={{
              padding: '12px 14px',
              background: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              marginBottom: '18px',
              fontSize: '13px'
            }}>
              <div style={{ fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '4px' }}>
                Asunto del Oficio:
              </div>
              <div style={{ color: 'var(--color-text-muted)' }}>{oficio.asunto}</div>
            </div>

            {/* Selector de Departamento Destino */}
            <div className="form-group">
              <label className="form-label">
                <Building2 size={15} className="text-gold" />
                Departamento Destino <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={departamentoId}
                onChange={(e) => setDepartamentoId(e.target.value)}
                required
              >
                {data.departamentos.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.nombre} ({d.tipo})
                  </option>
                ))}
              </select>
              <span className="form-helper">El titular del departamento seleccionado recibirá la notificación y turno.</span>
            </div>

            {/* Instrucciones de Atención */}
            <div className="form-group">
              <label className="form-label">
                Instrucciones Específicas / Observaciones del Turno <span className="required">*</span>
              </label>
              <textarea
                className="form-textarea"
                rows={4}
                value={instrucciones}
                onChange={(e) => setInstrucciones(e.target.value)}
                placeholder="Indique las directrices para la atención del oficio..."
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
              Confirmar y Turnar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
