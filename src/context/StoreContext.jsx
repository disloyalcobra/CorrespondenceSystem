/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/context/StoreContext.jsx
 * Propósito: Proveedor de Estado Global y Capa de Almacenamiento Reactivo.
 *            Implementa la estructura de base de datos relacional de 'schema.db'
 *            con persistencia en LocalStorage y registro automático en auditoría.
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_ROLES,
  INITIAL_DEPARTAMENTOS,
  INITIAL_TIPOS_DOCUMENTO,
  INITIAL_ESTADOS,
  INITIAL_USUARIOS,
  INITIAL_OFICIOS,
  INITIAL_ADJUNTOS,
  INITIAL_TURNOS,
  INITIAL_SEGUIMIENTOS,
  INITIAL_LECTURAS,
  INITIAL_AUDITORIA
} from '../data/initialMockData';

// Creación del contexto global de la aplicación
const StoreContext = createContext();

// Clave única de persistencia para el almacenamiento local del navegador
const STORAGE_KEY = 'SECTUR_CORRESPONDENCIA_DATA_V1';

export function StoreProvider({ children }) {
  /**
   * Estado principal de datos:
   * Almacena en memoria todas las colecciones relacionales de 'schema.db':
   * - roles: Catálogo de perfiles de acceso (Generador, Directora, Departamento, Admin)
   * - departamentos: Estructura orgánica institucional
   * - tiposDocumento: Catálogo de oficios, memorándums, circulares, etc.
   * - estados: Catálogo de fases (Pendiente, Turnado, En Proceso, Respondido, Concluido, Vencido)
   * - usuarios: Personal institucional activo con su rol y departamento
   * - oficios: Núcleo de correspondencia y radicación
   * - adjuntos: Archivos PDF asociados a oficios o seguimientos
   * - turnos: Historial de despachos y asignaciones por la Dirección General
   * - seguimientos: Observaciones, notas de avance y respuestas formales
   * - lecturas: Registro de visualizaciones del documento por usuario
   * - auditoria: Bitácora inmutable de fiscalización y trazabilidad
   */
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('No se pudo cargar la información desde LocalStorage:', e);
    }
    return {
      roles: INITIAL_ROLES,
      departamentos: INITIAL_DEPARTAMENTOS,
      tiposDocumento: INITIAL_TIPOS_DOCUMENTO,
      estados: INITIAL_ESTADOS,
      usuarios: INITIAL_USUARIOS,
      oficios: INITIAL_OFICIOS,
      adjuntos: INITIAL_ADJUNTOS,
      turnos: INITIAL_TURNOS,
      seguimientos: INITIAL_SEGUIMIENTOS,
      lecturas: INITIAL_LECTURAS,
      auditoria: INITIAL_AUDITORIA,
    };
  });

  // Identificador del usuario actualmente autenticado (por defecto ID 2 = Directora General para vista ejecutiva)
  const [activeUserId, setActiveUserId] = useState(2);

  // Vista activa de la aplicación: 'dashboard' | 'oficios' | 'nuevo' | 'reportes' | 'departamentos' | 'usuarios' | 'auditoria'
  const [activeView, setActiveView] = useState('dashboard');

  // ID del oficio seleccionado para abrir el modal de ficha técnica
  const [selectedOficioId, setSelectedOficioId] = useState(null);

  // Término de búsqueda global para filtrado en tiempo real
  const [searchQuery, setSearchQuery] = useState('');

  // Cola de notificaciones tipo Toast para retroalimentación visual al usuario
  const [toasts, setToasts] = useState([]);

  // Guardado automático del estado en LocalStorage ante cualquier mutación
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error al persistir el estado en LocalStorage:', e);
    }
  }, [data]);

  // Entidades derivadas del usuario en sesión
  const activeUser = data.usuarios.find(u => u.id === activeUserId) || data.usuarios[0];
  const activeRole = data.roles.find(r => r.id === activeUser.rol_id);
  const activeDepto = data.departamentos.find(d => d.id === activeUser.departamento_id);

  /**
   * Agrega una notificación Toast en pantalla con descarte automático a los 4 segundos.
   * @param {string} title - Título breve de la notificación.
   * @param {string} message - Descripción o detalle de la acción.
   * @param {'success'|'info'|'warning'|'error'} type - Tipo de notificación para color e icono.
   */
  const addToast = (title, message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  /**
   * Helper que genera la fecha y hora actual en formato 'YYYY-MM-DD HH:mm:ss'
   */
  const getNowFormatted = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };

  /**
   * Helper para crear un registro en la tabla 'auditoria' de schema.db.
   * @param {string} accion - Clave de acción (ej. CREAR_OFICIO, TURNAR_OFICIO).
   * @param {string} entidad - Nombre de la tabla afectada (ej. oficios, usuarios).
   * @param {number} entidad_id - Identificador del registro afectado.
   * @param {string} detalle - Descripción en lenguaje natural del evento.
   */
  const logAudit = (accion, entidad, entidad_id, detalle) => {
    const newLog = {
      id: (data.auditoria.length ? Math.max(...data.auditoria.map(a => a.id)) + 1 : 1),
      usuario_id: activeUser.id,
      accion,
      entidad,
      entidad_id,
      detalle,
      creado_en: getNowFormatted()
    };
    return newLog;
  };

  /**
   * 1. CREAR / RADICAR UN NUEVO OFICIO
   * Registra un oficio en Oficialía de Partes con sus archivos adjuntos y genera la auditoría.
   */
  const crearOficio = (oficioData, files = []) => {
    const newOficioId = data.oficios.length ? Math.max(...data.oficios.map(o => o.id)) + 1 : 1;
    const nowStr = getNowFormatted();

    const newOficio = {
      id: newOficioId,
      folio: oficioData.folio || `SECTUR/DGT/2026/${String(newOficioId).padStart(4, '0')}`,
      tipo_documento_id: parseInt(oficioData.tipo_documento_id) || 1,
      asunto: oficioData.asunto,
      objeto: oficioData.objeto,
      destinatario: oficioData.destinatario || 'Secretaría de Turismo',
      fecha_documento: oficioData.fecha_documento || nowStr.split(' ')[0],
      fecha_recepcion: oficioData.fecha_recepcion || nowStr,
      termino: oficioData.termino,
      remitente_usuario_id: activeUser.id,
      origen_usuario_id: activeUser.id,
      departamento_destino_inicial_id: parseInt(oficioData.departamento_destino_inicial_id) || 1,
      estado_id: 1, // Estado 1 = Pendiente
      creado_en: nowStr,
      prioridad: oficioData.prioridad || 'NORMAL'
    };

    // Creación de adjuntos asociados en la tabla polimórfica 'adjuntos'
    const newAdjuntos = files.map((f, idx) => ({
      id: (data.adjuntos.length ? Math.max(...data.adjuntos.map(a => a.id)) + 1 : 1) + idx,
      entidad_tipo: 'OFICIO',
      entidad_id: newOficioId,
      nombre_archivo: f.name,
      archivo_url: f.url || `/docs/${f.name}`,
      tamano: f.size || '1.5 MB',
      creado_en: nowStr
    }));

    const auditEntry = logAudit(
      'CREAR_OFICIO',
      'oficios',
      newOficioId,
      `El usuario ${activeUser.nombre} ingresó el oficio con folio ${newOficio.folio}.`
    );

    setData(prev => ({
      ...prev,
      oficios: [newOficio, ...prev.oficios],
      adjuntos: [...prev.adjuntos, ...newAdjuntos],
      auditoria: [auditEntry, ...prev.auditoria]
    }));

    addToast('Oficio Registrado', `Se generó con éxito el folio ${newOficio.folio}`, 'success');
    return newOficio;
  };

  /**
   * 2. TURNAR OFICIO A UN DEPARTAMENTO (Flujo de la Directora General)
   * Inserta un registro en 'oficio_turnos' y cambia el estado del oficio a Turnado (ID 2).
   */
  const turnarOficio = (oficioId, departamentoId, instrucciones) => {
    const nowStr = getNowFormatted();
    const depto = data.departamentos.find(d => d.id === parseInt(departamentoId));
    
    const newTurno = {
      id: data.turnos.length ? Math.max(...data.turnos.map(t => t.id)) + 1 : 1,
      oficio_id: oficioId,
      departamento_id: parseInt(departamentoId),
      turnado_por_usuario_id: activeUser.id,
      turnado_en: nowStr,
      recibido_en: null,
      instrucciones: instrucciones || 'Atender según atribuciones normativas.'
    };

    const auditEntry = logAudit(
      'TURNAR_OFICIO',
      'oficio_turnos',
      newTurno.id,
      `Oficio turnado al departamento "${depto ? depto.nombre : 'Área'}" por ${activeUser.nombre}.`
    );

    setData(prev => ({
      ...prev,
      turnos: [...prev.turnos, newTurno],
      oficios: prev.oficios.map(o => o.id === oficioId ? { ...o, estado_id: 2 } : o),
      auditoria: [auditEntry, ...prev.auditoria]
    }));

    addToast('Oficio Turnado', `Se turnó exitosamente a ${depto?.nombre}`, 'success');
  };

  /**
   * 3. REGISTRAR OBSERVACIÓN / NOTA DE AVANCE (Tabla 'oficio_seguimiento')
   * Permite a los departamentos dejar constancia de llamadas, acuerdos y avances intermedios.
   */
  const agregarSeguimiento = (oficioId, contenido, tipo = 'OBSERVACION') => {
    const nowStr = getNowFormatted();
    const newSegId = data.seguimientos.length ? Math.max(...data.seguimientos.map(s => s.id)) + 1 : 1;

    const newSeg = {
      id: newSegId,
      oficio_id: oficioId,
      usuario_id: activeUser.id,
      tipo, // 'OBSERVACION' | 'AVANCE'
      contenido,
      creado_en: nowStr
    };

    const auditEntry = logAudit(
      'REGISTRAR_SEGUIMIENTO',
      'oficio_seguimiento',
      newSegId,
      `${activeUser.nombre} agregó una ${tipo.toLowerCase()} al oficio #${oficioId}.`
    );

    setData(prev => ({
      ...prev,
      seguimientos: [...prev.seguimientos, newSeg],
      oficios: prev.oficios.map(o => o.id === oficioId && o.estado_id === 2 ? { ...o, estado_id: 3 } : o), // Pasa a 'En Proceso' (ID 3)
      auditoria: [auditEntry, ...prev.auditoria]
    }));

    addToast('Seguimiento Guardado', 'Se añadió la nota al historial del oficio.', 'info');
  };

  /**
   * 4. EMITIR RESPUESTA FORMAL (Flujo de Conclusión del Departamento)
   * Registra el dictamen o respuesta en 'oficio_seguimiento', anexa el PDF de respuesta y
   * actualiza el estado a Respondido (ID 4) o Concluido (ID 5).
   */
  const emitirRespuestaFormal = (oficioId, respuestaTexto, archivoAdjunto = null, concluirDirectamente = false) => {
    const nowStr = getNowFormatted();
    const newSegId = data.seguimientos.length ? Math.max(...data.seguimientos.map(s => s.id)) + 1 : 1;

    const newSeg = {
      id: newSegId,
      oficio_id: oficioId,
      usuario_id: activeUser.id,
      tipo: 'RESPUESTA_FORMAL',
      contenido: respuestaTexto,
      creado_en: nowStr
    };

    let newAdj = null;
    if (archivoAdjunto) {
      newAdj = {
        id: data.adjuntos.length ? Math.max(...data.adjuntos.map(a => a.id)) + 1 : 1,
        entidad_tipo: 'SEGUIMIENTO',
        entidad_id: newSegId,
        nombre_archivo: archivoAdjunto.name || 'Oficio_Respuesta_Oficial.pdf',
        archivo_url: archivoAdjunto.url || `/docs/${archivoAdjunto.name}`,
        tamano: archivoAdjunto.size || '2.0 MB',
        creado_en: nowStr
      };
    }

    const nuevoEstadoId = concluirDirectamente ? 5 : 4; // 4 = Respondido, 5 = Concluido
    const auditEntry = logAudit(
      'EMITIR_RESPUESTA',
      'oficio_seguimiento',
      newSegId,
      `Respuesta formal emitida por ${activeUser.nombre} para el oficio #${oficioId}.`
    );

    setData(prev => ({
      ...prev,
      seguimientos: [...prev.seguimientos, newSeg],
      adjuntos: newAdj ? [...prev.adjuntos, newAdj] : prev.adjuntos,
      oficios: prev.oficios.map(o => o.id === oficioId ? { ...o, estado_id: nuevoEstadoId } : o),
      auditoria: [auditEntry, ...prev.auditoria]
    }));

    addToast('Respuesta Emitida', `El oficio ahora se encuentra en estado "${nuevoEstadoId === 5 ? 'Concluido' : 'Respondido'}".`, 'success');
  };

  /**
   * 5. MARCAR DOCUMENTO COMO LEÍDO (Tabla 'oficio_lecturas')
   * Registra automáticamente cuando un usuario visualiza el detalle del oficio.
   */
  const marcarComoLeido = (oficioId) => {
    const yaLeido = data.lecturas.some(l => l.oficio_id === oficioId && l.usuario_id === activeUser.id);
    if (yaLeido) return;

    const nowStr = getNowFormatted();
    const newLectura = {
      id: data.lecturas.length ? Math.max(...data.lecturas.map(l => l.id)) + 1 : 1,
      oficio_id: oficioId,
      usuario_id: activeUser.id,
      leido_en: nowStr
    };

    setData(prev => ({
      ...prev,
      lecturas: [...prev.lecturas, newLectura]
    }));
  };

  /**
   * 6. ALTA DE DEPARTAMENTO (Tabla 'departamentos')
   */
  const agregarDepartamento = (deptoData) => {
    const newId = data.departamentos.length ? Math.max(...data.departamentos.map(d => d.id)) + 1 : 1;
    const newDepto = {
      id: newId,
      nombre: deptoData.nombre,
      tipo: deptoData.tipo || 'OPERATIVO',
      clave: deptoData.clave || `DEP-${newId}`
    };

    const auditEntry = logAudit('CREAR_DEPARTAMENTO', 'departamentos', newId, `Se creó el departamento ${newDepto.nombre}.`);

    setData(prev => ({
      ...prev,
      departamentos: [...prev.departamentos, newDepto],
      auditoria: [auditEntry, ...prev.auditoria]
    }));

    addToast('Departamento Creado', `Se dio de alta "${newDepto.nombre}".`, 'success');
  };

  /**
   * 7. GESTIÓN COMPLETA DE USUARIOS (Módulo exclusivo del Administrador)
   * Permite alta, modificación, desactivación segura (activo: false) y reseteo de claves.
   */
  const crearUsuario = (userData) => {
    const newId = data.usuarios.length ? Math.max(...data.usuarios.map(u => u.id)) + 1 : 1;
    const initials = userData.nombre.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'U';

    const newUsuario = {
      id: newId,
      nombre: userData.nombre,
      email: userData.email,
      cargo: userData.cargo || 'Funcionario Público',
      rol_id: parseInt(userData.rol_id) || 3,
      departamento_id: parseInt(userData.departamento_id) || 1,
      password_hash: userData.password || 'TempPass2026!',
      activo: true,
      avatar: initials
    };

    const rol = data.roles.find(r => r.id === newUsuario.rol_id);
    const depto = data.departamentos.find(d => d.id === newUsuario.departamento_id);

    const auditEntry = logAudit(
      'CREAR_USUARIO',
      'usuarios',
      newId,
      `Alta del usuario "${newUsuario.nombre}" con rol "${rol?.nombre}" en el área "${depto?.nombre}".`
    );

    setData(prev => ({
      ...prev,
      usuarios: [...prev.usuarios, newUsuario],
      auditoria: [auditEntry, ...prev.auditoria]
    }));

    addToast('Usuario Registrado', `Se dio de alta la cuenta para ${newUsuario.nombre}`, 'success');
    return newUsuario;
  };

  const actualizarUsuario = (id, updatedData) => {
    const usr = data.usuarios.find(u => u.id === id);
    if (!usr) return;

    const auditEntry = logAudit(
      'MODIFICAR_USUARIO',
      'usuarios',
      id,
      `Se actualizaron datos del usuario "${usr.nombre}" (Rol: ${updatedData.rol_id}, Depto: ${updatedData.departamento_id}).`
    );

    setData(prev => ({
      ...prev,
      usuarios: prev.usuarios.map(u => u.id === id ? {
        ...u,
        ...updatedData,
        rol_id: parseInt(updatedData.rol_id) || u.rol_id,
        departamento_id: parseInt(updatedData.departamento_id) || u.departamento_id
      } : u),
      auditoria: [auditEntry, ...prev.auditoria]
    }));

    addToast('Usuario Actualizado', 'Los cambios de rol y departamento han sido guardados.', 'success');
  };

  const toggleActivarUsuario = (id) => {
    const usr = data.usuarios.find(u => u.id === id);
    if (!usr) return;

    const nuevoEstado = !usr.activo;
    const accion = nuevoEstado ? 'ACTIVAR_USUARIO' : 'DESACTIVAR_USUARIO';
    const auditEntry = logAudit(
      accion,
      'usuarios',
      id,
      `${nuevoEstado ? 'Reactivación' : 'Desactivación'} de la cuenta institucional de "${usr.nombre}".`
    );

    setData(prev => ({
      ...prev,
      usuarios: prev.usuarios.map(u => u.id === id ? { ...u, activo: nuevoEstado } : u),
      auditoria: [auditEntry, ...prev.auditoria]
    }));

    addToast(
      nuevoEstado ? 'Cuenta Activada' : 'Cuenta Desactivada',
      `El usuario ${usr.nombre} ahora está ${nuevoEstado ? 'activo' : 'inactivo'}.`,
      nuevoEstado ? 'success' : 'info'
    );
  };

  const restablecerPassword = (id, newPassword) => {
    const usr = data.usuarios.find(u => u.id === id);
    if (!usr) return;

    const auditEntry = logAudit(
      'RESTABLECER_PASSWORD',
      'usuarios',
      id,
      `Se restableció la contraseña temporal del usuario "${usr.nombre}".`
    );

    setData(prev => ({
      ...prev,
      usuarios: prev.usuarios.map(u => u.id === id ? { ...u, password_hash: newPassword } : u),
      auditoria: [auditEntry, ...prev.auditoria]
    }));

    addToast('Contraseña Restablecida', `Nueva clave temporal configurada para ${usr.nombre}.`, 'success');
  };

  /**
   * 8. UTILIDAD PARA DESCARGA DE REPORTES EN EXCEL / CSV
   * Genera un archivo .csv con prefijo BOM (\uFEFF) para total compatibilidad con acentos en Excel.
   */
  const descargarCSV = (nombreArchivo, encabezados, filas) => {
    const csvContent = '\uFEFF' + [
      encabezados.join(','),
      ...filas.map(fila => fila.map(val => {
        const escaped = String(val ?? '').replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Archivo Descargado', `Se generó "${nombreArchivo}" con éxito.`, 'success');
  };

  /**
   * 9. RESTABLECER DATOS DE DEMOSTRACIÓN
   */
  const resetMockData = () => {
    setData({
      roles: INITIAL_ROLES,
      departamentos: INITIAL_DEPARTAMENTOS,
      tiposDocumento: INITIAL_TIPOS_DOCUMENTO,
      estados: INITIAL_ESTADOS,
      usuarios: INITIAL_USUARIOS,
      oficios: INITIAL_OFICIOS,
      adjuntos: INITIAL_ADJUNTOS,
      turnos: INITIAL_TURNOS,
      seguimientos: INITIAL_SEGUIMIENTOS,
      lecturas: INITIAL_LECTURAS,
      auditoria: INITIAL_AUDITORIA,
    });
    addToast('Datos Restaurados', 'Se han restablecido los datos demo originales.', 'info');
  };

  /**
   * Métricas consolidadas en tiempo real para alimentar el Dashboard y los contadores del Sidebar
   */
  const metrics = {
    total: data.oficios.length,
    pendientes: data.oficios.filter(o => o.estado_id === 1).length,
    turnados: data.oficios.filter(o => o.estado_id === 2).length,
    enProceso: data.oficios.filter(o => o.estado_id === 3).length,
    respondidos: data.oficios.filter(o => o.estado_id === 4).length,
    concluidos: data.oficios.filter(o => o.estado_id === 5).length,
    vencidos: data.oficios.filter(o => {
      if (o.estado_id === 5) return false;
      if (!o.termino) return false;
      const term = new Date(o.termino);
      const now = new Date();
      return term < now;
    }).length,
  };

  return (
    <StoreContext.Provider
      value={{
        data,
        activeUser,
        activeRole,
        activeDepto,
        activeUserId,
        setActiveUserId,
        activeView,
        setActiveView,
        selectedOficioId,
        setSelectedOficioId,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        metrics,
        crearOficio,
        turnarOficio,
        agregarSeguimiento,
        emitirRespuestaFormal,
        marcarComoLeido,
        agregarDepartamento,
        crearUsuario,
        actualizarUsuario,
        toggleActivarUsuario,
        restablecerPassword,
        descargarCSV,
        resetMockData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

/**
 * Hook personalizado para consumir el Store en cualquier componente de React
 */
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore debe ser utilizado dentro de un StoreProvider');
  }
  return context;
}
