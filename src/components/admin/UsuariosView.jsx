import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  KeyRound,
  Edit,
  Shield,
  Building,
  Mail,
  Search,
  Check,
  X,
  Copy,
  AlertTriangle,
  Lock
} from 'lucide-react';

export function UsuariosView() {
  const {
    data,
    activeUserId,
    setActiveUserId,
    activeUser,
    crearUsuario,
    actualizarUsuario,
    toggleActivarUsuario,
    restablecerPassword,
    addToast
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [passwordResetUser, setPasswordResetUser] = useState(null);
  const [tempPassword, setTempPassword] = useState('');

  // New User Form State
  const [newUserData, setNewUserData] = useState({
    nombre: '',
    email: '',
    cargo: '',
    rol_id: '3', // Titular de Departamento default
    departamento_id: '1',
    password: ''
  });

  const filteredUsuarios = data.usuarios.filter(u => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const matchName = u.nombre.toLowerCase().includes(q);
    const matchEmail = u.email.toLowerCase().includes(q);
    const matchCargo = (u.cargo || '').toLowerCase().includes(q);
    return matchName || matchEmail || matchCargo;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newUserData.nombre.trim() || !newUserData.email.trim()) return;

    crearUsuario({
      ...newUserData,
      password: newUserData.password || 'Sectur2026!'
    });

    setNewUserData({
      nombre: '',
      email: '',
      cargo: '',
      rol_id: '3',
      departamento_id: '1',
      password: ''
    });
    setShowCreateModal(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    actualizarUsuario(editingUser.id, {
      nombre: editingUser.nombre,
      email: editingUser.email,
      cargo: editingUser.cargo,
      rol_id: editingUser.rol_id,
      departamento_id: editingUser.departamento_id
    });

    setEditingUser(null);
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = 'SECTUR-';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(pass);
  };

  const handleSavePasswordReset = (e) => {
    e.preventDefault();
    if (!passwordResetUser || !tempPassword.trim()) return;

    restablecerPassword(passwordResetUser.id, tempPassword);
    setPasswordResetUser(null);
    setTempPassword('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast('Copiado', 'Contraseña copiada al portapapeles', 'info');
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <div className="breadcrumb-tag">MÓDULO DE ADMINISTRACIÓN EXCLUSIVO</div>
          <h1 className="page-title">Gestión de Usuarios y Accesos</h1>
          <p className="page-desc">
            Alta de personal, asignación de roles institucionales, adscripción departamental y políticas de acceso.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <UserPlus size={16} />
          Dar de Alta Usuario
        </button>
      </div>

      {/* Search & Stats Filter Bar */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
            Total Personal: <strong>{data.usuarios.length}</strong>
          </span>
          <span className="badge badge-concluido">
            {data.usuarios.filter(u => u.activo).length} Activos
          </span>
          <span className="badge badge-vencido">
            {data.usuarios.filter(u => !u.activo).length} Inactivos
          </span>
        </div>

        <div style={{ minWidth: '280px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', color: '#9CA3AF' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '34px' }}
              placeholder="Buscar por nombre, cargo o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Usuario & Contacto</th>
              <th>Cargo Institucional</th>
              <th>Rol de Sistema</th>
              <th>Departamento Asignado</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones Administrativas</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map(u => {
              const rol = data.roles.find(r => r.id === u.rol_id);
              const depto = data.departamentos.find(d => d.id === u.departamento_id);
              const isCurrentSession = u.id === activeUserId;

              return (
                <tr key={u.id} style={{ opacity: u.activo ? 1 : 0.65, backgroundColor: isCurrentSession ? '#FAF5EE' : 'inherit' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: u.activo ? 'var(--color-guinda-dark)' : '#94A3B8',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                        flexShrink: 0
                      }}>
                        {u.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--color-text-dark)', fontSize: '13.5px' }}>
                          {u.nombre}
                          {isCurrentSession && (
                            <span style={{ marginLeft: '6px', fontSize: '11px', color: 'var(--color-guinda-primary)', fontWeight: 600 }}>
                              (Tu Sesión)
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                          <Mail size={12} /> {u.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    {u.cargo}
                  </td>

                  <td>
                    <span className="badge badge-dorado" style={{ fontWeight: 700 }}>
                      <Shield size={12} />
                      {rol?.nombre}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}>
                      <Building size={14} className="text-gold" />
                      {depto?.nombre}
                    </div>
                  </td>

                  <td>
                    <span className={`badge ${u.activo ? 'badge-concluido' : 'badge-vencido'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {/* Edit Button */}
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditingUser({ ...u })}
                        title="Editar rol y departamento"
                      >
                        <Edit size={13} />
                        Editar
                      </button>

                      {/* Reset Password Button */}
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          setPasswordResetUser(u);
                          handleGeneratePassword();
                        }}
                        title="Restablecer contraseña"
                      >
                        <KeyRound size={13} />
                        Clave
                      </button>

                      {/* Toggle Active/Inactive */}
                      <button
                        className={`btn btn-sm ${u.activo ? 'btn-secondary' : 'btn-accent'}`}
                        onClick={() => toggleActivarUsuario(u.id)}
                        title={u.activo ? 'Desactivar cuenta' : 'Reactivar cuenta'}
                        style={{ color: u.activo ? '#DC2626' : '#FFFFFF' }}
                      >
                        {u.activo ? <UserX size={13} /> : <UserCheck size={13} />}
                        {u.activo ? 'Desactivar' : 'Activar'}
                      </button>

                      {/* Switch session button for quick test */}
                      {!isCurrentSession && (
                        <button
                          className="btn btn-sm btn-outline-gold"
                          onClick={() => setActiveUserId(u.id)}
                          title="Simular inicio de sesión como este usuario"
                        >
                          Simular
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: DAR DE ALTA NUEVO USUARIO */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
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
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', color: 'var(--color-guinda-dark)' }}>Dar de Alta Nuevo Funcionario</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-subtle)' }}>Módulo de Administración de Accesos SECTUR</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">
                    Nombre Completo del Servidor Público <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUserData.nombre}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej. Lic. Fernando Gómez Álvarez"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Correo Electrónico Institucional <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ejemplo@turismo.gob.mx"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cargo / Puesto Nominal</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUserData.cargo}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, cargo: e.target.value }))}
                    placeholder="Ej. Jefe de Departamento de Difusión"
                  />
                </div>

                <div className="form-row-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Rol en el Sistema <span className="required">*</span></label>
                    <select
                      className="form-select"
                      value={newUserData.rol_id}
                      onChange={(e) => setNewUserData(prev => ({ ...prev, rol_id: e.target.value }))}
                    >
                      {data.roles.map(r => (
                        <option key={r.id} value={r.id}>{r.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Departamento Adscrito <span className="required">*</span></label>
                    <select
                      className="form-select"
                      value={newUserData.departamento_id}
                      onChange={(e) => setNewUserData(prev => ({ ...prev, departamento_id: e.target.value }))}
                    >
                      {data.departamentos.map(d => (
                        <option key={d.id} value={d.id}>{d.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Contraseña Inicial Temporal</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Por defecto: Sectur2026!"
                  />
                  <span className="form-helper">El usuario podrá cambiarla en su primer inicio de sesión.</span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITAR USUARIO */}
      {editingUser && (
        <div className="modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', color: 'var(--color-guinda-dark)' }}>
                Editar Usuario: {editingUser.nombre}
              </h3>
              <button onClick={() => setEditingUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingUser.nombre}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, nombre: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Correo Institucional</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cargo</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingUser.cargo}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, cargo: e.target.value }))}
                  />
                </div>

                <div className="form-row-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Rol en el Sistema</label>
                    <select
                      className="form-select"
                      value={editingUser.rol_id}
                      onChange={(e) => setEditingUser(prev => ({ ...prev, rol_id: e.target.value }))}
                    >
                      {data.roles.map(r => (
                        <option key={r.id} value={r.id}>{r.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Departamento</label>
                    <select
                      className="form-select"
                      value={editingUser.departamento_id}
                      onChange={(e) => setEditingUser(prev => ({ ...prev, departamento_id: e.target.value }))}
                    >
                      {data.departamentos.map(d => (
                        <option key={d.id} value={d.id}>{d.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RESTABLECER CONTRASEÑA */}
      {passwordResetUser && (
        <div className="modal-overlay" onClick={() => setPasswordResetUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <KeyRound size={20} className="text-gold" />
                <h3 style={{ fontSize: '16px', color: 'var(--color-guinda-dark)' }}>Restablecer Contraseña</h3>
              </div>
              <button onClick={() => setPasswordResetUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePasswordReset}>
              <div className="modal-body">
                <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  Genera una nueva contraseña temporal para <strong>{passwordResetUser.nombre}</strong> ({passwordResetUser.email}).
                </p>

                <div className="form-group">
                  <label className="form-label">Nueva Contraseña Temporal</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input font-bold"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleGeneratePassword}
                      title="Generar contraseña aleatoria segura"
                    >
                      Generar
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => copyToClipboard(tempPassword)}
                      title="Copiar al portapapeles"
                    >
                      <Copy size={15} />
                    </button>
                  </div>
                  <span className="form-helper">
                    Esta acción quedará registrada en la bitácora de auditoría.
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setPasswordResetUser(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Aplicar Nueva Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
      `}</style>
    </div>
  );
}
