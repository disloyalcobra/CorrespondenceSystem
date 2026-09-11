/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/form/FileDropzone.jsx
 * Propósito: Componente interactivo de Drag & Drop para adjuntar archivos PDF
 *            y anexos a los expedientes institucionales.
 * ============================================================================
 */

import React, { useState } from 'react';
import { UploadCloud, File, X, CheckCircle, FileText } from 'lucide-react';

export function FileDropzone({ files, setFiles }) {
  // Estado para detectar si el usuario está arrastrando archivos sobre el área
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  /**
   * Formatea los archivos agregados y los añade al estado de adjuntos
   */
  const addFiles = (newFilesList) => {
    const formatted = newFilesList.map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      type: f.type || 'application/pdf',
      raw: f
    }));
    setFiles(prev => [...prev, ...formatted]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="dropzone-wrapper">
      {/* Zona activa de arrastre */}
      <div
        className={`dropzone-box ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="dropzone-icon-circle">
          <UploadCloud size={28} className="text-gold" />
        </div>
        <h4 className="dropzone-title">Arrastra y suelta tus archivos aquí</h4>
        <p className="dropzone-subtitle">
          Soporta documentos PDF, DOCX o imágenes escaneadas de hasta 25 MB
        </p>

        <label className="btn btn-secondary btn-sm dropzone-btn">
          <span>Seleccionar desde el equipo</span>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Lista de archivos preparados para adjuntar */}
      {files.length > 0 && (
        <div className="uploaded-files-list">
          <div className="files-list-header">
            Archivos listos para adjuntar ({files.length}):
          </div>
          {files.map(file => (
            <div key={file.id} className="file-chip-item">
              <FileText size={18} className="text-guinda" />
              <div className="file-chip-info">
                <span className="file-chip-name">{file.name}</span>
                <span className="file-chip-size">{file.size}</span>
              </div>
              <button
                type="button"
                className="file-chip-remove"
                onClick={() => removeFile(file.id)}
                title="Quitar archivo"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .dropzone-wrapper {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dropzone-box {
          border: 2px dashed var(--color-dorado);
          border-radius: var(--radius-md);
          background-color: #FAFBFD;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.2s ease;
        }

        .dropzone-box.dragging {
          background-color: var(--color-dorado-light);
          border-color: var(--color-dorado-hover);
          transform: scale(1.01);
        }

        .dropzone-icon-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background-color: var(--color-dorado-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .dropzone-title {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--color-text-dark);
          margin-bottom: 4px;
        }

        .dropzone-subtitle {
          font-size: 12.5px;
          color: var(--color-text-subtle);
          margin-bottom: 14px;
        }

        .dropzone-btn {
          cursor: pointer;
        }

        .uploaded-files-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .files-list-header {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--color-guinda-dark);
        }

        .file-chip-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
        }

        .file-chip-info {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
        }

        .file-chip-name {
          font-weight: 600;
          color: var(--color-text-dark);
          max-width: 400px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-chip-size {
          font-size: 11.5px;
          color: #64748B;
        }

        .file-chip-remove {
          background: none;
          border: none;
          cursor: pointer;
          color: #94A3B8;
          display: flex;
          align-items: center;
          padding: 2px;
        }

        .file-chip-remove:hover {
          color: #DC2626;
        }
      `}</style>
    </div>
  );
}
