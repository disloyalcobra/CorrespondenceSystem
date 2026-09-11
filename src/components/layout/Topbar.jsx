/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/components/layout/Topbar.jsx
 * Propósito: Barra superior institucional con logotipo de SECTUR, barra de
 *            búsqueda global, campana de alertas de oficios por vencer y
 *            simulador interactivo de cambio de rol y usuario en tiempo real.
 * ============================================================================
 */

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  UserCheck,
  Bell,
  Sparkles,
  Shield,
  Layers,
  ChevronDown,
  RotateCcw,
  Building2,
  FileText
} from 'lucide-react';

export function Topbar() {
  const {
    activeUser,
    activeRole,
    activeDepto,
    data,
    setActiveUserId,
    searchQuery,
    setSearchQuery,
    setActiveView,
    metrics,
    resetMockData
  } = useStore();

  // Control de apertura de menús desplegables
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Identificación de oficios con término próximo (5 días o menos) para la campana de alertas
  const urgentOficios = data.oficios.filter(o => {
    if (o.estado_id === 5) return false;
    if (!o.termino) return false;
    const diff = Math.ceil((new Date(o.termino) - new Date()) / (1000 * 60 * 60 * 24));
    return diff <= 5;
  });

  return (
    <header className="topbar">
      {/* ---------------------------------------------------------------------
          1. LOGOTIPO Y MARCA INSTITUCIONAL SECTUR
          --------------------------------------------------------------------- */}
      <div className="topbar-left">
        <div className="brand-badge">
          <div className="brand-crest">
            <Building2 size={20} className="text-gold" />
          </div>
          <div className="brand-text">
            <span className="brand-sub">GOBIERNO DE MÉXICO • SECTUR</span>
            <span className="brand-title">Sistema de Correspondencia</span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          2. CAMPO DE BÚSQUEDA GLOBAL
          --------------------------------------------------------------------- */}
      <div className="topbar-center">
        <div className="search-wrapper">
          <Search size={17} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por folio, asunto, persona o dependencia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="topbar-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="search-clear-btn"
              title="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          3. ACCIONES Y SIMULADOR DE USUARIO / ROL
          --------------------------------------------------------------------- */}
      <div className="topbar-right">
        {/* Campana de Notificaciones Urgentes */}
        <div className="relative">
          <button
            className={`icon-button ${urgentOficios.length > 0 ? 'has-notifications' : ''}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleMenu(false);
            }}
            title="Oficios con término próximo"
          >
            <Bell size={19} />
            {urgentOficios.length > 0 && (
              <span className="notification-badge">{urgentOficios.length}</span>
            )}
          </button>

          {/* Menú Desplegable de Alertas */}
          {showNotifications && (
            <div className="dropdown-panel notifications-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">Oficios Urgentes / Por Vencer</span>
                <span className="badge badge-vencido">{urgentOficios.length} alertas</span>
              </div>
              <div className="dropdown-list">
                {urgentOficios.length === 0 ? (
                  <div className="empty-notice">No hay oficios con vencimiento próximo</div>
                ) : (
                  urgentOficios.map(o => (
                    <div
                      key={o.id}
                      className="notification-item"
                      onClick={() => {
                        setActiveView('oficios');
                        setShowNotifications(false);
                      }}
                    >
                      <div className="notification-item-folio">{o.folio}</div>
                      <div className="notification-item-asunto">{o.asunto}</div>
                      <div className="notification-item-term">
                        Término: <strong>{o.termino}</strong>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Botón y Menú del Simulador de Roles */}
        <div className="relative">
          <button
            className="role-selector-btn"
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifications(false);
            }}
          >
            <div className="user-avatar">{activeUser.avatar}</div>
            <div className="user-details-box">
              <div className="user-name">{activeUser.nombre}</div>
              <div className="user-role-tag">
                <span className="gold-dot"></span>
                {activeRole?.nombre}
              </div>
            </div>
            <ChevronDown size={16} className="text-gold" />
          </button>

          {/* Menú Desplegable del Simulador de Sesión */}
          {showRoleMenu && (
            <div className="dropdown-panel role-switcher-dropdown">
              <div className="dropdown-header">
                <div>
                  <div className="dropdown-title">Simulador de Rol / Usuario</div>
                  <div className="dropdown-subtitle">
                    Cambia de rol para probar permisos y vistas
                  </div>
                </div>
              </div>

              <div className="role-options-list">
                {data.usuarios.map(u => {
                  const role = data.roles.find(r => r.id === u.rol_id);
                  const isSelected = u.id === activeUser.id;

                  return (
                    <button
                      key={u.id}
                      className={`role-option-item ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        setActiveUserId(u.id);
                        setShowRoleMenu(false);
                      }}
                    >
                      <div className="role-avatar-circle">{u.avatar}</div>
                      <div className="role-option-info">
                        <div className="role-option-name">{u.nombre}</div>
                        <div className="role-option-title">{role?.nombre}</div>
                        <div className="role-option-cargo">{u.cargo}</div>
                      </div>
                      {isSelected && <UserCheck size={18} className="text-dorado" />}
                    </button>
                  );
                })}
              </div>

              <div className="dropdown-footer">
                <button
                  className="btn-reset-demo"
                  onClick={() => {
                    resetMockData();
                    setShowRoleMenu(false);
                  }}
                >
                  <RotateCcw size={14} />
                  Restablecer Datos Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .topbar {
          background-color: var(--color-guinda-dark);
          color: #FFFFFF;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          border-bottom: 2px solid var(--color-dorado);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .brand-badge {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-crest {
          width: 38px;
          height: 38px;
          background: rgba(188, 149, 92, 0.15);
          border: 1.5px solid var(--color-dorado);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .text-gold {
          color: var(--color-dorado);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-sub {
          font-size: 10px;
          letter-spacing: 0.12em;
          font-weight: 700;
          color: var(--color-dorado);
        }

        .brand-title {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #FFFFFF;
        }

        .topbar-center {
          flex: 1;
          max-width: 480px;
          margin: 0 24px;
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: #9CA3AF;
          pointer-events: none;
        }

        .topbar-search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 9999px;
          padding: 8px 36px 8px 38px;
          color: #FFFFFF;
          font-size: 13.5px;
          outline: none;
          transition: all 0.2s ease;
        }

        .topbar-search-input::placeholder {
          color: rgba(255, 255, 255, 0.65);
        }

        .topbar-search-input:focus {
          background: #FFFFFF;
          color: var(--color-text-dark);
          border-color: var(--color-dorado);
          box-shadow: 0 0 0 3px rgba(188, 149, 92, 0.3);
        }

        .search-clear-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #9CA3AF;
          font-size: 18px;
          cursor: pointer;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FFFFFF;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .icon-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: var(--color-dorado);
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: #EF4444;
          color: white;
          font-size: 10px;
          font-weight: 700;
          border-radius: 9999px;
          padding: 2px 5px;
          min-width: 17px;
          text-align: center;
          border: 1.5px solid var(--color-guinda-dark);
        }

        .role-selector-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(188, 149, 92, 0.4);
          padding: 5px 14px 5px 6px;
          border-radius: 30px;
          cursor: pointer;
          color: #FFFFFF;
          transition: all 0.2s ease;
        }

        .role-selector-btn:hover {
          background: rgba(0, 0, 0, 0.35);
          border-color: var(--color-dorado);
        }

        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-dorado) 0%, #8C682D 100%);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #FFFFFF;
        }

        .user-details-box {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 1.2;
        }

        .user-role-tag {
          font-size: 11px;
          color: var(--color-dorado);
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        }

        .gold-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--color-dorado);
        }

        .relative {
          position: relative;
        }

        .dropdown-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: #FFFFFF;
          color: var(--color-text-dark);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-xl);
          z-index: 100;
          animation: scaleUp 0.2s ease;
        }

        .role-switcher-dropdown {
          width: 360px;
        }

        .notifications-dropdown {
          width: 320px;
        }

        .dropdown-header {
          padding: 14px 18px;
          border-bottom: 1px solid var(--color-border);
          background-color: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        }

        .dropdown-title {
          font-weight: 700;
          font-size: 13.5px;
          color: var(--color-guinda-dark);
        }

        .dropdown-subtitle {
          font-size: 11.5px;
          color: var(--color-text-subtle);
        }

        .role-options-list {
          max-height: 320px;
          overflow-y: auto;
          padding: 8px;
        }

        .role-option-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s;
        }

        .role-option-item:hover {
          background-color: #F1F5F9;
        }

        .role-option-item.active {
          background-color: var(--color-dorado-light);
          border-color: var(--color-dorado-border);
        }

        .role-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-guinda-dark);
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .role-option-info {
          flex: 1;
        }

        .role-option-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-dark);
        }

        .role-option-title {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--color-guinda-primary);
        }

        .role-option-cargo {
          font-size: 11px;
          color: var(--color-text-subtle);
        }

        .dropdown-footer {
          padding: 10px 16px;
          border-top: 1px solid var(--color-border);
          background-color: #FAFBFD;
          display: flex;
          justify-content: center;
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        }

        .btn-reset-demo {
          background: none;
          border: none;
          color: #64748B;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          padding: 4px 8px;
        }

        .btn-reset-demo:hover {
          color: var(--color-guinda-dark);
        }

        .notification-item {
          padding: 12px 16px;
          border-bottom: 1px solid var(--color-border-light);
          cursor: pointer;
          transition: background 0.15s;
        }

        .notification-item:hover {
          background-color: #FEF2F2;
        }

        .notification-item-folio {
          font-size: 12px;
          font-weight: 700;
          color: #991B1B;
        }

        .notification-item-asunto {
          font-size: 12.5px;
          color: var(--color-text-dark);
          margin: 2px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .notification-item-term {
          font-size: 11px;
          color: #64748B;
        }

        .empty-notice {
          padding: 24px;
          text-align: center;
          font-size: 13px;
          color: #94A3B8;
        }
      `}</style>
    </header>
  );
}
