/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/form/NuevoOficioView.jsx
 * Propósito: Formulario de radicación y captura de nuevo oficio institucional.
 *            Genera folios consecutivos, valida campos obligatorios (asunto,
 *            destinatario, término) y permite adjuntar archivos PDF iniciales.
 * ============================================================================
 */

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { FileDropzone } from './FileDropzone';
import {
  FilePlus,
  Save,
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  User,
  AlertCircle,
  Sparkles,
  FileCheck
} from 'lucide-react';

export function NuevoOficioView() {
  const { data, activeUser, crearOficio, setActiveView, setSelectedOficioId } = useStore();

  // Generación automática del folio correlativo para el año 2026
  const nextFolioNum = (data.oficios.length + 1).toString().padStart(4, '0');
  const defaultFolio = `SECTUR/DGT/2026/${nextFolioNum}`;

  // Fechas predeterminadas (Fecha actual y 14 días para término estándar)
  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekStr = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Estado del formulario de captura
  const [formData, setFormData] = useState({
    folio: defaultFolio,
    tipo_documento_id: '1', // Tipo 1 = Oficio Ordinario
    asunto: '',
    objeto: '',
    destinatario: '',
    fecha_documento: todayStr,
    fecha_recepcion: `${todayStr} 09:00:00`,
    termino: nextWeekStr,
    departamento_destino_inicial_id: data.departamentos[1]?.id || '1',
    prioridad: 'NORMAL'
  });

  // Lista de archivos adjuntos iniciales (simulados)
  const [files, setFiles] = useState([
    {
      id: 1,
      name: `Oficio_${defaultFolio.replaceAll('/', '_')}_Original.pdf`,
      size: '1.8 MB',
      type: 'application/pdf'
    }
  ]);

  // Manejo de errores de validación de formulario
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Validación estricta de campos obligatorios
   */
  const validate = () => {
    const errs = {};
    if (!formData.asunto.trim()) errs.asunto = 'El asunto es obligatorio.';
    if (!formData.destinatario.trim()) errs.destinatario = 'Indica el destinatario o dependencia externa.';
    if (!formData.termino) errs.termino = 'La fecha de término o vencimiento es obligatoria.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /**
   * Envío del formulario: Registra el oficio, inserta adjuntos, guarda en auditoría
   * y redirige automáticamente al usuario a la bandeja con el oficio seleccionado.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newOficio = crearOficio(formData, files);
    setSelectedOficioId(newOficio.id);
    setActiveView('oficios');
  };

  return (
    <div className="nuevo-oficio-container">
      {/* ---------------------------------------------------------------------
          1. ENCABEZADO Y RETORNO
          --------------------------------------------------------------------- */}
      <div className="form-header-bar">
        <div>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setActiveView('oficios')}
            style={{ marginBottom: '8px' }}
          >
            <ArrowLeft size={14} /> Volver a la Bandeja
          </button>
          <div className="inst-badge-gold">OFICIALÍA DE PARTES • REGISTRO DE ENTRADA</div>
          <h1 className="form-title">Generar y Radicar Nuevo Oficio</h1>
          <p className="form-subtitle">
            Ingreso de correspondencia oficial al sistema para asignación y seguimiento de términos.
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          2. FORMULARIO PRINCIPAL DE CAPTURA
          --------------------------------------------------------------------- */}
      <form onSubmit={handleSubmit} className="oficio-form">
        <div className="form-layout-grid">
          {/* Tarjeta de Datos Generales */}
          <div className="card form-main-card">
            <div className="card-section-title">
              <FileCheck size={18} className="text-gold" />
              <span>Datos Generales del Oficio</span>
            </div>

            {/* Fila 1: Folio y Tipo de Documento */}
            <div className="form-row-two">
              <div className="form-group">
                <label className="form-label">
                  Folio Institucional Asignado <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="folio"
                  className="form-input font-bold text-guinda"
                  value={formData.folio}
                  onChange={handleChange}
                  required
                />
                <span className="form-helper">Folio oficial consecutivo de control interno.</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Tipo de Documento <span className="required">*</span>
                </label>
                <select
                  name="tipo_documento_id"
                  className="form-select"
                  value={formData.tipo_documento_id}
                  onChange={handleChange}
                >
                  {data.tiposDocumento.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Asunto */}
            <div className="form-group">
              <label className="form-label">
                Asunto / Título del Oficio <span className="required">*</span>
              </label>
              <input
                type="text"
                name="asunto"
                className={`form-input ${errors.asunto ? 'input-error' : ''}`}
                value={formData.asunto}
                onChange={handleChange}
                placeholder="Ej. Solicitud de Stand y Logística para Tianguis Turístico 2026"
              />
              {errors.asunto && <span className="error-text">{errors.asunto}</span>}
            </div>

            {/* Objeto / Alcance */}
            <div className="form-group">
              <label className="form-label">
                Objeto / Descripción Detallada
              </label>
              <textarea
                name="objeto"
                rows={4}
                className="form-textarea"
                value={formData.objeto}
                onChange={handleChange}
                placeholder="Describa los antecedentes, alcances específicos o solicitudes puntuales que contiene el oficio..."
              />
            </div>

            {/* Destinatario Externo */}
            <div className="form-group">
              <label className="form-label">
                Destinatario Externo / Membrete <span className="required">*</span>
              </label>
              <input
                type="text"
                name="destinatario"
                className={`form-input ${errors.destinatario ? 'input-error' : ''}`}
                value={formData.destinatario}
                onChange={handleChange}
                placeholder="Ej. H. Ayuntamiento de Cuetzalan / C. Gobernador del Estado"
              />
              {errors.destinatario && <span className="error-text">{errors.destinatario}</span>}
            </div>

            {/* Componente Dropzone para Carga de Archivos */}
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="form-label">
                Documento Escaneado y Anexos (PDF)
              </label>
              <FileDropzone files={files} setFiles={setFiles} />
            </div>
          </div>

          {/* -----------------------------------------------------------------
              3. COLUMNA LATERAL: ENRUTAMIENTO Y FECHAS DE TÉRMINO
              ----------------------------------------------------------------- */}
          <div className="form-sidebar-column">
            {/* Asignación departamental */}
            <div className="card form-side-card">
              <div className="card-section-title">
                <Building size={17} className="text-gold" />
                <span>Enrutamiento y Destino</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Departamento Destino Inicial <span className="required">*</span>
                </label>
                <select
                  name="departamento_destino_inicial_id"
                  className="form-select"
                  value={formData.departamento_destino_inicial_id}
                  onChange={handleChange}
                >
                  {data.departamentos.map(d => (
                    <option key={d.id} value={d.id}>{d.nombre}</option>
                  ))}
                </select>
                <span className="form-helper">
                  Define qué área recibirá y dará curso al documento.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Prioridad del Trámite</label>
                <select
                  name="prioridad"
                  className="form-select"
                  value={formData.prioridad}
                  onChange={handleChange}
                >
                  <option value="NORMAL">Normal</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                  <option value="URGENTE">Urgente</option>
                </select>
              </div>
            </div>

            {/* Fechas y Término */}
            <div className="card form-side-card">
              <div className="card-section-title">
                <Calendar size={17} className="text-gold" />
                <span>Fechas y Término</span>
              </div>

              <div className="form-group">
                <label className="form-label">Fecha del Documento</label>
                <input
                  type="date"
                  name="fecha_documento"
                  className="form-input"
                  value={formData.fecha_documento}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Fecha Límite de Término <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="termino"
                  className={`form-input ${errors.termino ? 'input-error' : ''}`}
                  value={formData.termino}
                  onChange={handleChange}
                />
                {errors.termino && <span className="error-text">{errors.termino}</span>}
                <span className="form-helper">Fecha perentoria para respuesta o resolución.</span>
              </div>
            </div>

            {/* Cuadro de Guardado y Confirmación */}
            <div className="card form-side-card" style={{ background: '#FAF6F0', borderColor: 'var(--color-dorado)' }}>
              <div style={{ fontSize: '13px', color: 'var(--color-guinda-dark)', marginBottom: '14px', lineHeight: 1.4 }}>
                Al guardar, se registrará el ingreso en Oficialía de Partes y quedará disponible para revisión y turno de la Directora General.
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <Save size={18} />
                Guardar y Radicar Oficio
              </button>
            </div>
          </div>
        </div>
      </form>

      <style>{`
        .nuevo-oficio-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .form-title {
          font-size: 24px;
          color: var(--color-guinda-dark);
        }

        .form-subtitle {
          font-size: 13.5px;
          color: var(--color-text-muted);
        }

        .form-layout-grid {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .form-layout-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-main-card, .form-side-card {
          padding: 24px;
        }

        .form-sidebar-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 700;
          color: var(--color-guinda-dark);
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1.5px solid var(--color-border-light);
        }

        .form-row-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .input-error {
          border-color: #DC2626 !important;
          background-color: #FEF2F2 !important;
        }

        .error-text {
          font-size: 11.5px;
          color: #DC2626;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
