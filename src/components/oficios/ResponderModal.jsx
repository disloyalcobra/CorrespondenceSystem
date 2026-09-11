/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/oficios/ResponderModal.jsx
 * Propósito: Ventana modal para que los titulares de departamento emitan una
 *            respuesta formal con dictamen escrito, adjunten el oficio de respuesta
 *            en PDF y cierren o concluyan el trámite.
 * ============================================================================
 */

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { FileCheck, Upload, X, CheckCircle, FileText } from 'lucide-react';

export function ResponderModal({ oficio, onClose }) {
  const { emitirRespuestaFormal, activeUser } = useStore();

  // Texto del dictamen de respuesta
  const [respuestaTexto, setRespuestaTexto] = useState('');
  // Checkbox para marcar como concluido definitivamente
  const [concluirDirectamente, setConcluirDirectamente] = useState(false);
  // Simulación del archivo PDF de respuesta
  const [fileName, setFileName] = useState('Respuesta_Oficio_' + oficio.folio.replaceAll('/', '_') + '.pdf');
  const [fileAttached, setFileAttached] = useState(true);

  /**
   * Guarda la respuesta formal en la base de datos
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!respuestaTexto.trim()) return;

    const filePayload = fileAttached ? {
      name: fileName,
      url: `/docs/${fileName}`,
      size: '2.4 MB'
    } : null;

    emitirRespuestaFormal(oficio.id, respuestaTexto, filePayload, concluirDirectamente);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        {/* Cabecera del Modal */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--status-respondido-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--status-respondido-text)'
            }}>
              <FileCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: 'var(--color-guinda-dark)' }}>Emitir Respuesta Formal</h3>
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
            {/* Texto de la respuesta institucional */}
            <div className="form-group">
              <label className="form-label">
                Texto del Dictamen / Respuesta Institucional <span className="required">*</span>
              </label>
              <textarea
                className="form-textarea"
                rows={5}
                value={respuestaTexto}
                onChange={(e) => setRespuestaTexto(e.target.value)}
                placeholder="Describa la resolución, acciones efectuadas o respuesta remitida al interesado..."
                required
              />
            </div>

            {/* Simulación de Carga de Archivo PDF de Respuesta */}
            <div className="form-group">
              <label className="form-label">
                <Upload size={15} className="text-gold" />
                Oficio o Dictamen de Respuesta (PDF Adjunto)
              </label>
              <div style={{
                border: '1.5px dashed var(--color-dorado)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                backgroundColor: '#FAFBFD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={22} className="text-guinda" />
                  <div>
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '4px 8px', fontSize: '13px', width: '320px' }}
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                    />
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                      Simulación de archivo PDF (2.4 MB) • Listo para adjuntar
                    </div>
                  </div>
                </div>
                <label style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-guinda-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <input
                    type="checkbox"
                    checked={fileAttached}
                    onChange={(e) => setFileAttached(e.target.checked)}
                  />
                  Incluir PDF
                </label>
              </div>
            </div>

            {/* Opción para Concluir el Trámite */}
            <div style={{
              marginTop: '16px',
              padding: '12px 14px',
              background: '#F0FDF4',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <input
                type="checkbox"
                id="checkConcluir"
                checked={concluirDirectamente}
                onChange={(e) => setConcluirDirectamente(e.target.checked)}
                style={{ marginTop: '3px', cursor: 'pointer' }}
              />
              <label htmlFor="checkConcluir" style={{ fontSize: '13px', color: '#166534', cursor: 'pointer' }}>
                <strong>Marcar trámite como Concluido definitivamente</strong>
                <div style={{ fontSize: '11.5px', color: '#15803D' }}>
                  Si el asunto no requiere más turnos ni seguimiento posterior, se cerrará el folio.
                </div>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={16} />
              Registrar Respuesta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
