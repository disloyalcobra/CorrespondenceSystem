/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/oficios/OficioDetailModal.jsx
 * Propósito: Ficha técnica del oficio institucional, visor de expediente y
 *            línea de tiempo cronológica (Timeline) con registro de turnos,
 *            lecturas, notas y respuestas oficiales según schema.db.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { TurnarModal } from './TurnarModal';
import { ResponderModal } from './ResponderModal';
import { ObservacionModal } from './ObservacionModal';
import {
  X,
  FileText,
  Clock,
  Building,
  User,
  Calendar,
  Send,
  CheckCircle2,
  Paperclip,
  Download,
  Eye,
  MessageSquarePlus,
  ArrowRight,
  Shield,
  FileCheck,
  Check
} from 'lucide-react';

export function OficioDetailModal({ oficioId, onClose }) {
  const { data, activeUser, activeRole, marcarComoLeido } = useStore();

  // Pestaña activa: 'ficha' (Ficha Técnica) | 'timeline' (Línea de Tiempo) | 'adjuntos' (Archivos)
  const [activeTab, setActiveTab] = useState('ficha');

  // Control de apertura de modales de acción según rol
  const [showTurnarModal, setShowTurnarModal] = useState(false);
  const [showResponderModal, setShowResponderModal] = useState(false);
  const [showObservacionModal, setShowObservacionModal] = useState(false);
  const [selectedPdfPreview, setSelectedPdfPreview] = useState(null);

  // Obtención del oficio seleccionado
  const oficio = data.oficios.find(o => o.id === oficioId);

  /**
   * Registro de Lectura Automática (Tabla 'oficio_lecturas'):
   * Cuando un usuario abre la ficha del oficio, se registra la marca de tiempo de visualización.
   */
  useEffect(() => {
    if (oficioId) {
      marcarComoLeido(oficioId);
    }
  }, [oficioId]);

  if (!oficio) return null;

  // Resolución de entidades foráneas según schema.db
  const deptoDestino = data.departamentos.find(d => d.id === oficio.departamento_destino_inicial_id);
  const tipoDoc = data.tiposDocumento.find(t => t.id === oficio.tipo_documento_id);
  const estadoDoc = data.estados.find(e => e.id === oficio.estado_id);
  const remitente = data.usuarios.find(u => u.id === oficio.remitente_usuario_id);

  // Archivos adjuntos pertenecientes al oficio o a sus seguimientos
  const oficioAdjuntos = data.adjuntos.filter(
    a => (a.entidad_tipo === 'OFICIO' && a.entidad_id === oficio.id) ||
         (a.entidad_tipo === 'SEGUIMIENTO' && data.seguimientos.some(s => s.oficio_id === oficio.id && s.id === a.entidad_id))
  );

  // Historial de turnos asignados por la Dirección General (Tabla 'oficio_turnos')
  const oficioTurnos = data.turnos.filter(t => t.oficio_id === oficio.id);

  // Historial de observaciones y respuestas formales (Tabla 'oficio_seguimiento')
  const oficioSeguimientos = data.seguimientos.filter(s => s.oficio_id === oficio.id);

  // Historial de lecturas (Tabla 'oficio_lecturas')
  const oficioLecturas = data.lecturas.filter(l => l.oficio_id === oficio.id);

  /**
   * Construcción de la Línea de Tiempo Unificada:
   * Combina cronológicamente la creación inicial, turnos, lecturas, notas y respuestas.
   */
  const timelineEvents = [
    {
      type: 'CREACION',
      date: oficio.creado_en || oficio.fecha_recepcion,
      title: 'Ingreso a Oficialía de Partes',
      description: `El documento fue registrado en la plataforma por ${remitente?.nombre || 'Oficialía de Partes'}.`,
      icon: FileText,
      color: 'gold'
    },
    ...oficioLecturas.map(l => {
      const u = data.usuarios.find(user => user.id === l.usuario_id);
      return {
        type: 'LECTURA',
        date: l.leido_en,
        title: 'Documento Consultado',
        description: `${u?.nombre || 'Usuario'} visualizó los detalles de este oficio.`,
        icon: Eye,
        color: 'gray'
      };
    }),
    ...oficioTurnos.map(t => {
      const uTurna = data.usuarios.find(user => user.id === t.turnado_por_usuario_id);
      const d = data.departamentos.find(dept => dept.id === t.departamento_id);
      return {
        type: 'TURNO',
        date: t.turnado_en,
        title: `Turnado a: ${d?.nombre || 'Departamento'}`,
        description: `Instrucción: "${t.instrucciones}" (Turnado por ${uTurna?.nombre || 'Directora'}).`,
        icon: Send,
        color: 'purple'
      };
    }),
    ...oficioSeguimientos.map(s => {
      const u = data.usuarios.find(user => user.id === s.usuario_id);
      const isFormal = s.tipo === 'RESPUESTA_FORMAL';
      return {
        type: s.tipo,
        date: s.creado_en,
        title: isFormal ? 'Respuesta Formal Emitida' : (s.tipo === 'AVANCE' ? 'Avance de Gestión' : 'Observación / Nota'),
        description: s.contenido,
        author: u?.nombre,
        cargo: u?.cargo,
        icon: isFormal ? FileCheck : MessageSquarePlus,
        color: isFormal ? 'green' : 'amber'
      };
    })
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Días restantes antes del vencimiento del término
  let diasRestantes = null;
  if (oficio.termino) {
    diasRestantes = Math.ceil((new Date(oficio.termino) - new Date()) / (1000 * 60 * 60 * 24));
  }

  // Comprobación de roles para mostrar acciones contextuales
  const isDirectora = activeUser.rol_id === 2 || activeUser.rol_id === 4;
  const isDepto = activeUser.rol_id === 3 || activeUser.rol_id === 4;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content oficio-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* -------------------------------------------------------------------
            1. CABECERA DEL MODAL DE DETALLE
            ------------------------------------------------------------------- */}
        <div className="modal-header detail-header">
          <div className="detail-header-left">
            <span className="inst-badge-gold">SECTUR • OFICIO OFICIAL</span>
            <h2 className="detail-folio">{oficio.folio}</h2>
          </div>

          <div className="detail-header-right">
            <span className={`badge badge-${oficio.estado_id === 1 ? 'pendiente' : (oficio.estado_id === 2 ? 'turnado' : (oficio.estado_id === 3 ? 'proceso' : (oficio.estado_id === 4 ? 'respondido' : 'concluido')))}`}>
              {estadoDoc?.nombre}
            </span>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => window.print()}
              title="Imprimir o Guardar Ficha en PDF"
            >
              <Download size={14} />
              Imprimir / PDF
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            2. NAVEGACIÓN POR PESTAÑAS (Ficha, Timeline, Adjuntos)
            ------------------------------------------------------------------- */}
        <div className="detail-tabs">
          <button
            className={`tab-btn ${activeTab === 'ficha' ? 'active' : ''}`}
            onClick={() => setActiveTab('ficha')}
          >
            <FileText size={16} />
            Ficha del Oficio
          </button>
          <button
            className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <Clock size={16} />
            Línea de Tiempo ({timelineEvents.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'adjuntos' ? 'active' : ''}`}
            onClick={() => setActiveTab('adjuntos')}
          >
            <Paperclip size={16} />
            Adjuntos ({oficioAdjuntos.length})
          </button>
        </div>

        {/* -------------------------------------------------------------------
            3. CUERPO DEL MODAL (Contenido dinámico por pestaña)
            ------------------------------------------------------------------- */}
        <div className="modal-body detail-body">
          {/* PESTAÑA 1: FICHA TÉCNICA OFICIAL */}
          {activeTab === 'ficha' && (
            <div className="official-sheet">
              {/* Membrete y Sello Oficial */}
              <div className="sheet-top-banner">
                <div className="sheet-gov-text">
                  <strong>SECRETARÍA DE TURISMO</strong>
                  <span>DIRECCIÓN GENERAL Y OFICIALÍA DE PARTES</span>
                </div>
                <div className="sheet-seal-icon">SECTUR</div>
              </div>

              <div className="sheet-divider-gold"></div>

              {/* Asunto */}
              <div className="sheet-section">
                <div className="sheet-field-title">ASUNTO:</div>
                <div className="sheet-asunto-text">{oficio.asunto}</div>
              </div>

              {/* Objeto / Antecedentes */}
              {oficio.objeto && (
                <div className="sheet-section">
                  <div className="sheet-field-title">OBJETO / DESCRIPCIÓN:</div>
                  <div className="sheet-objeto-text">{oficio.objeto}</div>
                </div>
              )}

              {/* Cuadrícula de Metadatos del Oficio */}
              <div className="sheet-grid-meta">
                <div className="meta-item">
                  <span className="meta-label">TIPO DE DOCUMENTO</span>
                  <span className="meta-value">{tipoDoc?.nombre}</span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">DESTINATARIO EXTERNO / MEMBRETE</span>
                  <span className="meta-value">{oficio.destinatario}</span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">DEPARTAMENTO DESTINO ASIGNADO</span>
                  <span className="meta-value" style={{ color: 'var(--color-guinda-primary)', fontWeight: 700 }}>
                    {deptoDestino?.nombre}
                  </span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">FECHA DE RECEPCIÓN</span>
                  <span className="meta-value">{oficio.fecha_recepcion}</span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">FECHA DE VENCIMIENTO (TÉRMINO)</span>
                  <span className="meta-value" style={{
                    color: diasRestantes !== null && diasRestantes <= 3 ? '#DC2626' : 'inherit',
                    fontWeight: 700
                  }}>
                    {oficio.termino || 'Sin fecha de término fija'}
                    {diasRestantes !== null && (
                      <span style={{ fontSize: '12px', marginLeft: '6px', fontWeight: 500 }}>
                        ({diasRestantes < 0 ? `Vencido hace ${Math.abs(diasRestantes)}d` : `${diasRestantes} días restantes`})
                      </span>
                    )}
                  </span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">REMITENTE / CAPTURA</span>
                  <span className="meta-value">{remitente?.nombre} ({remitente?.cargo})</span>
                </div>
              </div>

              {/* Instrucción del último turno asignado */}
              {oficioTurnos.length > 0 && (
                <div className="sheet-turn-box">
                  <div className="turn-box-header">
                    <Send size={15} />
                    <span>ÚLTIMA INSTRUCCIÓN DE TURNO</span>
                  </div>
                  <p className="turn-box-text">
                    "{oficioTurnos[oficioTurnos.length - 1].instrucciones}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* PESTAÑA 2: LÍNEA DE TIEMPO (TIMELINE) */}
          {activeTab === 'timeline' && (
            <div className="timeline-container">
              {timelineEvents.map((evt, idx) => {
                const Icon = evt.icon;
                return (
                  <div key={idx} className={`timeline-row timeline-${evt.color}`}>
                    <div className="timeline-node">
                      <Icon size={16} />
                    </div>
                    <div className="timeline-card">
                      <div className="timeline-card-header">
                        <span className="timeline-card-title">{evt.title}</span>
                        <span className="timeline-card-date">{evt.date}</span>
                      </div>
                      <p className="timeline-card-desc">{evt.description}</p>
                      {evt.author && (
                        <div className="timeline-card-author">
                          Por: <strong>{evt.author}</strong> ({evt.cargo})
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PESTAÑA 3: ARCHIVOS ADJUNTOS */}
          {activeTab === 'adjuntos' && (
            <div className="adjuntos-container">
              {oficioAdjuntos.length === 0 ? (
                <div className="empty-adjuntos">
                  <Paperclip size={32} style={{ color: '#CBD5E1', marginBottom: '8px' }} />
                  <p>No se han registrado archivos adjuntos en este oficio.</p>
                </div>
              ) : (
                <div className="adjuntos-grid">
                  {oficioAdjuntos.map(adj => (
                    <div key={adj.id} className="adjunto-card">
                      <div className="adjunto-icon">
                        <FileText size={24} className="text-guinda" />
                      </div>
                      <div className="adjunto-info">
                        <div className="adjunto-name">{adj.nombre_archivo}</div>
                        <div className="adjunto-meta">
                          {adj.tamano} • Subido el {adj.creado_en}
                        </div>
                      </div>
                      <div className="adjunto-actions">
                        <button
                          className="btn-adjunto-action"
                          onClick={() => setSelectedPdfPreview(adj.nombre_archivo)}
                          title="Previsualizar documento"
                        >
                          <Eye size={16} />
                        </button>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Descargando archivo simulado: ${adj.nombre_archivo}`);
                          }}
                          className="btn-adjunto-action"
                          title="Descargar"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Visor Simulado de Archivos PDF */}
              {selectedPdfPreview && (
                <div className="pdf-preview-box">
                  <div className="pdf-preview-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} className="text-guinda" />
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{selectedPdfPreview}</span>
                    </div>
                    <button
                      className="close-preview-btn"
                      onClick={() => setSelectedPdfPreview(null)}
                    >
                      Cerrar Visor ×
                    </button>
                  </div>
                  <div className="pdf-canvas-simulation">
                    <div className="simulated-pdf-sheet">
                      <div className="pdf-watermark">SECTUR MÉXICO</div>
                      <div className="pdf-seal-gold">SELLO DIGITAL AUTORIZADO</div>
                      <h3>SECRETARÍA DE TURISMO • DIRECCIÓN GENERAL</h3>
                      <p className="pdf-folio-stamp">Folio Oficial: {oficio.folio}</p>
                      <hr style={{ margin: '14px 0', borderColor: '#BC955C' }} />
                      <p style={{ fontWeight: 700, marginBottom: '8px' }}>ASUNTO: {oficio.asunto}</p>
                      <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#334155' }}>
                        Por medio del presente documento institucional, se hace constar el registro y trámite de la correspondencia oficial para los fines y efectos a los que haya lugar conforme a la normativa vigente.
                      </p>
                      <div className="pdf-signature-box">
                        <div className="signature-line"></div>
                        <span>LIC. CLAUDIA HERNÁNDEZ MORA</span>
                        <small>Oficialía de Partes - SECTUR</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------------
            4. PIE DE ACCIONES SEGÚN ROL (Turnar, Observar, Responder)
            ------------------------------------------------------------------- */}
        <div className="modal-footer detail-footer">
          <div className="footer-left">
            <span className="user-role-notice">
              Acciones disponibles para tu rol: <strong>{activeRole?.nombre}</strong>
            </span>
          </div>

          <div className="footer-actions">
            {/* Acción para Directora o Admin: Turnar a Departamento */}
            {isDirectora && (
              <button
                className="btn btn-primary"
                onClick={() => setShowTurnarModal(true)}
              >
                <Send size={16} />
                Turnar Oficio
              </button>
            )}

            {/* Acciones para Titular de Departamento: Agregar Nota o Responder */}
            {isDepto && (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowObservacionModal(true)}
                >
                  <MessageSquarePlus size={16} />
                  Agregar Nota
                </button>
                <button
                  className="btn btn-accent"
                  onClick={() => setShowResponderModal(true)}
                >
                  <FileCheck size={16} />
                  Emitir Respuesta
                </button>
              </>
            )}

            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar Ficha
            </button>
          </div>
        </div>
      </div>

      {/* Modales Secundarios de Acción */}
      {showTurnarModal && (
        <TurnarModal
          oficio={oficio}
          onClose={() => setShowTurnarModal(false)}
        />
      )}

      {showResponderModal && (
        <ResponderModal
          oficio={oficio}
          onClose={() => setShowResponderModal(false)}
        />
      )}

      {showObservacionModal && (
        <ObservacionModal
          oficio={oficio}
          onClose={() => setShowObservacionModal(false)}
        />
      )}

      <style>{`
        .oficio-detail-modal {
          max-width: 860px;
          border-top: 4px solid var(--color-guinda-dark);
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 28px;
          background-color: #FAFBFD;
        }

        .inst-badge-gold {
          font-size: 10.5px;
          font-weight: 800;
          color: var(--color-dorado-hover);
          letter-spacing: 0.1em;
        }

        .detail-folio {
          font-size: 20px;
          font-weight: 800;
          color: var(--color-guinda-dark);
          margin-top: 2px;
        }

        .detail-header-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748B;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 6px;
        }

        .close-btn:hover {
          background-color: #F1F5F9;
          color: #1E293B;
        }

        .detail-tabs {
          display: flex;
          border-bottom: 1.5px solid var(--color-border);
          padding: 0 28px;
          background-color: #FFFFFF;
          gap: 8px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-subtle);
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: var(--color-guinda-dark);
        }

        .tab-btn.active {
          color: var(--color-guinda-dark);
          border-bottom-color: var(--color-dorado);
        }

        .detail-body {
          padding: 28px;
          background-color: #F8FAFC;
        }

        .official-sheet {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 28px 32px;
          box-shadow: var(--shadow-sm);
        }

        .sheet-top-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .sheet-gov-text {
          display: flex;
          flex-direction: column;
        }

        .sheet-gov-text strong {
          font-size: 14px;
          letter-spacing: 0.08em;
          color: var(--color-guinda-dark);
        }

        .sheet-gov-text span {
          font-size: 11px;
          color: var(--color-dorado-hover);
          font-weight: 600;
        }

        .sheet-seal-icon {
          font-size: 12px;
          font-weight: 800;
          color: var(--color-dorado);
          border: 1.5px solid var(--color-dorado);
          padding: 4px 10px;
          border-radius: 4px;
        }

        .sheet-divider-gold {
          height: 2px;
          background: linear-gradient(90deg, var(--color-guinda-dark) 0%, var(--color-dorado) 50%, var(--color-guinda-dark) 100%);
          margin-bottom: 20px;
        }

        .sheet-section {
          margin-bottom: 18px;
        }

        .sheet-field-title {
          font-size: 11.5px;
          font-weight: 800;
          color: var(--color-guinda-primary);
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .sheet-asunto-text {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text-dark);
          line-height: 1.4;
        }

        .sheet-objeto-text {
          font-size: 14px;
          color: var(--color-text-muted);
          line-height: 1.5;
          background-color: #F8FAFC;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--color-dorado);
        }

        .sheet-grid-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--color-border-light);
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .meta-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-subtle);
          letter-spacing: 0.04em;
        }

        .meta-value {
          font-size: 13.5px;
          color: var(--color-text-dark);
          font-weight: 500;
        }

        .sheet-turn-box {
          margin-top: 20px;
          padding: 14px 18px;
          background: #EEF2FF;
          border-radius: var(--radius-md);
          border: 1px solid #C7D2FE;
        }

        .turn-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #3730A3;
          margin-bottom: 6px;
        }

        .turn-box-text {
          font-size: 13.5px;
          color: #1E1B4B;
          font-style: italic;
        }

        /* Timeline Styles */
        .timeline-container {
          display: flex;
          flex-direction: column;
          gap: 18px;
          position: relative;
          padding-left: 20px;
        }

        .timeline-container::before {
          content: '';
          position: absolute;
          left: 37px;
          top: 15px;
          bottom: 15px;
          width: 2px;
          background-color: #E2E8F0;
        }

        .timeline-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          position: relative;
        }

        .timeline-node {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          flex-shrink: 0;
        }

        .timeline-gold .timeline-node {
          border-color: var(--color-dorado);
          color: var(--color-dorado-hover);
          background-color: var(--color-dorado-light);
        }

        .timeline-purple .timeline-node {
          border-color: #8B5CF6;
          color: #6D28D9;
          background-color: #EDE9FE;
        }

        .timeline-green .timeline-node {
          border-color: #10B981;
          color: #047857;
          background-color: #D1FAE5;
        }

        .timeline-amber .timeline-node {
          border-color: #F59E0B;
          color: #B45309;
          background-color: #FEF3C7;
        }

        .timeline-gray .timeline-node {
          border-color: #94A3B8;
          color: #64748B;
        }

        .timeline-card {
          flex: 1;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 14px 18px;
          box-shadow: var(--shadow-sm);
        }

        .timeline-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .timeline-card-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-text-dark);
        }

        .timeline-card-date {
          font-size: 11.5px;
          color: var(--color-text-subtle);
        }

        .timeline-card-desc {
          font-size: 13px;
          color: var(--color-text-muted);
          line-height: 1.4;
        }

        .timeline-card-author {
          margin-top: 8px;
          font-size: 11.5px;
          color: var(--color-guinda-primary);
        }

        /* Adjuntos Styles */
        .adjuntos-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .adjuntos-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .adjunto-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 14px 18px;
        }

        .adjunto-icon {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background-color: var(--color-guinda-light);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .adjunto-info {
          flex: 1;
        }

        .adjunto-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-dark);
        }

        .adjunto-meta {
          font-size: 12px;
          color: #64748B;
        }

        .adjunto-actions {
          display: flex;
          gap: 8px;
        }

        .btn-adjunto-action {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          background: #FFFFFF;
          color: var(--color-guinda-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-adjunto-action:hover {
          background-color: var(--color-dorado-light);
          border-color: var(--color-dorado);
        }

        .pdf-preview-box {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .pdf-preview-header {
          padding: 10px 16px;
          background: #F1F5F9;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close-preview-btn {
          background: none;
          border: none;
          font-size: 12px;
          color: #DC2626;
          font-weight: 600;
          cursor: pointer;
        }

        .pdf-canvas-simulation {
          background-color: #525659;
          padding: 24px;
          display: flex;
          justify-content: center;
        }

        .simulated-pdf-sheet {
          background: #FFFFFF;
          max-width: 580px;
          width: 100%;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          position: relative;
        }

        .pdf-watermark {
          position: absolute;
          top: 40%;
          left: 20%;
          font-size: 40px;
          font-weight: 900;
          color: rgba(188, 149, 92, 0.08);
          transform: rotate(-30deg);
          pointer-events: none;
        }

        .pdf-seal-gold {
          font-size: 10px;
          font-weight: 800;
          color: #8C682D;
          border: 1px dashed #BC955C;
          display: inline-block;
          padding: 2px 8px;
          margin-bottom: 12px;
        }

        .pdf-folio-stamp {
          font-size: 13px;
          color: var(--color-guinda-primary);
          font-weight: 700;
        }

        .pdf-signature-box {
          margin-top: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .signature-line {
          width: 200px;
          height: 1px;
          background-color: #94A3B8;
          margin-bottom: 6px;
        }

        .pdf-signature-box span {
          font-size: 12px;
          font-weight: 700;
          color: var(--color-text-dark);
        }

        .pdf-signature-box small {
          font-size: 11px;
          color: #64748B;
        }

        .detail-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 28px;
        }

        .user-role-notice {
          font-size: 12px;
          color: var(--color-text-subtle);
        }

        .footer-actions {
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}
