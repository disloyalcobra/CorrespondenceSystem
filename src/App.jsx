/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/App.jsx
 * Propósito: Componente principal que orquesta el diseño maestro institucional,
 *            la barra lateral (Sidebar), barra superior (Topbar) y el enrutamiento
 *            dinámico de las vistas del sistema.
 * ============================================================================
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { OficiosView } from './components/oficios/OficiosView';
import { NuevoOficioView } from './components/form/NuevoOficioView';
import { DepartamentosView } from './components/admin/DepartamentosView';
import { UsuariosView } from './components/admin/UsuariosView';
import { AuditoriaView } from './components/admin/AuditoriaView';
import { ReportesView } from './components/reports/ReportesView';
import { ToastContainer } from './components/ui/ToastContainer';

function MainApp() {
  // Obtiene la vista actualmente seleccionada en el estado global
  const { activeView } = useStore();

  return (
    <div className="app-container">
      {/* Barra de Navegación Lateral (Sidebar Institucional) */}
      <Sidebar />

      {/* Área de Contenido Central */}
      <div className="main-content">
        {/* Barra Superior con Marca, Búsqueda y Simulador de Roles */}
        <Topbar />

        {/* Renderizado Dinámico de Módulos según la vista activa */}
        <main className="content-body">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'oficios' && <OficiosView />}
          {activeView === 'nuevo' && <NuevoOficioView />}
          {activeView === 'reportes' && <ReportesView />}
          {activeView === 'departamentos' && <DepartamentosView />}
          {activeView === 'usuarios' && <UsuariosView />}
          {activeView === 'auditoria' && <AuditoriaView />}
        </main>
      </div>

      {/* Contenedor Flotante de Notificaciones Toast */}
      <ToastContainer />
    </div>
  );
}

/**
 * Componente raíz exportado que envuelve la aplicación en el StoreProvider
 */
export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
