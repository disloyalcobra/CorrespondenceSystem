/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/ui/ToastContainer.jsx
 * Propósito: Componente visual de notificaciones emergentes (Toasts) para dar
 *            retroalimentación inmediata al usuario sobre el éxito o resultado
 *            de acciones (radicación de oficios, turnos, respuestas, altas).
 * ============================================================================
 */

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  // Si no hay notificaciones activas, no se renderiza nada en el DOM
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isInfo = toast.type === 'info';

        return (
          <div key={toast.id} className={`toast-card toast-${toast.type}`}>
            {/* Icono contextual según el tipo de notificación */}
            <div className="toast-icon">
              {isSuccess && <CheckCircle2 size={18} className="text-green" />}
              {isInfo && <Info size={18} className="text-gold" />}
              {!isSuccess && !isInfo && <AlertCircle size={18} className="text-red" />}
            </div>

            {/* Contenido textual */}
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>

            {/* Botón de cierre manual */}
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              title="Cerrar notificación"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}

      <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1000;
        }

        .toast-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-left: 4px solid var(--color-dorado);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 300px;
          max-width: 420px;
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toast-card.toast-success {
          border-left-color: #10B981;
        }

        .toast-card.toast-info {
          border-left-color: var(--color-dorado);
        }

        .toast-content {
          flex: 1;
        }

        .toast-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-guinda-dark);
        }

        .toast-message {
          font-size: 12px;
          color: var(--color-text-muted);
        }

        .toast-close {
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }

        .toast-close:hover {
          color: var(--color-text-dark);
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
