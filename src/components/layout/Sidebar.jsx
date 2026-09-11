/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/layout/Sidebar.jsx
 * Propósito: Menú lateral de navegación con estética institucional Guinda y Dorado,
 *            accesos a los módulos de correspondencia, reportes, catálogos y auditoría,
 *            con visibilidad condicional según el rol del usuario autenticado.
 * ============================================================================
 */

import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Inbox,
  FilePlus,
  Building,
  Users,
  ShieldAlert,
  FileCheck,
  Sparkles,
  HelpCircle,
  Clock,
  FileSpreadsheet
} from 'lucide-react';

export function Sidebar() {
  const {
    activeView,
    setActiveView,
    activeUser,
    activeRole,
    activeDepto,
    metrics
  } = useStore();

  // Determinación de capacidades y permisos según el perfil
  const isGeneradorOrAdmin = activeUser.rol_id === 1 || activeUser.rol_id === 4;
  const isDirectora = activeUser.rol_id === 2;

  // Elementos del menú principal institucional
  const navItems = [
    {
      id: 'dashboard',
      label: 'Panel Principal',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'oficios',
      label: 'Bandeja de Oficios',
      icon: Inbox,
      badge: metrics.pendientes > 0 ? `${metrics.pendientes} pend.` : null,
      badgeColor: 'amber'
    },
    {
      id: 'nuevo',
      label: 'Generar Nuevo Oficio',
      icon: FilePlus,
      highlight: true,
      allowed: isGeneradorOrAdmin || isDirectora
    },
    {
      id: 'reportes',
      label: 'Reportes y Exportación',
      icon: FileSpreadsheet,
      badge: 'Excel / PDF',
      badgeColor: 'default'
    },
    {
      id: 'departamentos',
      label: 'Catálogo Departamentos',
      icon: Building,
      badge: null
    },
    {
      id: 'usuarios',
      label: 'Gestión de Usuarios',
      icon: Users,
      badge: null
    },
    {
      id: 'auditoria',
      label: 'Bitácora de Auditoría',
      icon: ShieldAlert,
      badge: null
    }
  ];

  return (
    <aside className="sidebar">
      {/* ---------------------------------------------------------------------
          1. CABECERA DEL MENÚ LATERAL CON SELLO SECTUR
          --------------------------------------------------------------------- */}
      <div className="sidebar-header">
        <div className="sidebar-institution-seal">
          <div className="seal-outer">
            <span className="seal-text">SECTUR</span>
          </div>
        </div>
        <div className="sidebar-inst-title">
          <h3>SECRETARÍA DE TURISMO</h3>
          <p>Correspondencia y Gestión</p>
        </div>
      </div>

      <div className="sidebar-gold-line"></div>

      {/* ---------------------------------------------------------------------
          2. NAVEGACIÓN Y ENLACES A MÓDULOS
          --------------------------------------------------------------------- */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">MENÚ PRINCIPAL</div>
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            if (item.allowed === false) {
              return null;
            }

            return (
              <li key={item.id}>
                <button
                  className={`nav-link ${isActive ? 'active' : ''} ${item.highlight ? 'nav-link-cta' : ''}`}
                  onClick={() => setActiveView(item.id)}
                >
                  <Icon size={19} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  {item.badge && (
                    <span className={`nav-badge badge-${item.badgeColor || 'default'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ---------------------------------------------------------------------
          3. PIE DEL MENÚ LATERAL: ÁREA ASIGNADA Y VERSIÓN
          --------------------------------------------------------------------- */}
      <div className="sidebar-footer">
        <div className="dept-context-card">
          <div className="dept-label">ÁREA ASIGNADA:</div>
          <div className="dept-name">{activeDepto?.nombre || 'Dirección General'}</div>
          <div className="dept-role-pill">
            <span>{activeRole?.nombre}</span>
          </div>
        </div>

        <div className="system-version-tag">
          <span>Versión 2.4.0 • SECTUR 2026</span>
        </div>
      </div>

      <style>{`
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #501324 0%, #691C32 40%, #460F1E 100%);
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          border-right: 2px solid var(--color-dorado);
          box-shadow: 4px 0 15px rgba(0, 0, 0, 0.15);
          height: 100vh;
          position: sticky;
          top: 0;
          flex-shrink: 0;
        }

        .sidebar-header {
          padding: 24px 20px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-institution-seal {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid var(--color-dorado);
          background: rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .seal-outer {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .seal-text {
          font-size: 9.5px;
          font-weight: 800;
          color: var(--color-dorado);
          letter-spacing: 0.08em;
        }

        .sidebar-inst-title h3 {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #FFFFFF;
          line-height: 1.2;
        }

        .sidebar-inst-title p {
          font-size: 11px;
          color: var(--color-dorado);
          font-weight: 500;
          margin-top: 2px;
        }

        .sidebar-gold-line {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--color-dorado) 50%, transparent 100%);
          margin: 0 16px 16px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 14px;
          overflow-y: auto;
        }

        .nav-section-title {
          font-size: 10.5px;
          letter-spacing: 0.12em;
          font-weight: 700;
          color: rgba(188, 149, 92, 0.85);
          padding: 8px 12px;
          margin-bottom: 4px;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nav-link {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: var(--radius-md);
          background: transparent;
          border: 1px solid transparent;
          color: rgba(255, 255, 255, 0.85);
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          border-color: rgba(188, 149, 92, 0.3);
          transform: translateX(3px);
        }

        .nav-link.active {
          background: linear-gradient(90deg, rgba(188, 149, 92, 0.28) 0%, rgba(188, 149, 92, 0.08) 100%);
          color: #FFFFFF;
          border-left: 3.5px solid var(--color-dorado);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .nav-link.active .nav-icon {
          color: var(--color-dorado);
        }

        .nav-link-cta {
          background: rgba(188, 149, 92, 0.15);
          border: 1px dashed var(--color-dorado);
          color: #FFFFFF;
          margin-top: 4px;
        }

        .nav-link-cta:hover {
          background: var(--color-dorado);
          color: #2b1307;
          border-style: solid;
        }

        .nav-link-cta.active {
          background: var(--color-dorado);
          color: #2b1307;
          border-color: #FFFFFF;
        }

        .nav-link-cta.active .nav-icon {
          color: #2b1307;
        }

        .nav-icon {
          color: rgba(255, 255, 255, 0.7);
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .nav-label {
          flex: 1;
        }

        .nav-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .badge-amber {
          background-color: #F59E0B;
          color: #78350F;
        }

        .badge-default {
          background-color: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
        }

        .sidebar-footer {
          padding: 16px 14px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dept-context-card {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(188, 149, 92, 0.3);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          margin-bottom: 12px;
        }

        .dept-label {
          font-size: 9.5px;
          letter-spacing: 0.08em;
          color: var(--color-dorado);
          font-weight: 700;
        }

        .dept-name {
          font-size: 12px;
          font-weight: 600;
          color: #FFFFFF;
          margin: 2px 0 6px;
          line-height: 1.3;
        }

        .dept-role-pill {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 600;
          background: rgba(188, 149, 92, 0.2);
          color: #FDF2F4;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid rgba(188, 149, 92, 0.3);
        }

        .system-version-tag {
          font-size: 10.5px;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
        }
      `}</style>
    </aside>
  );
}
