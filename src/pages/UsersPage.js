import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UsersPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '', 
    password: '', 
    email: '',
    nombre_completo: '', 
    documento_identidad: '', 
    rol: 'cajero'
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      if (data.success) setUsuarios(data.data);
    } catch (error) {
      alert('Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await userService.updateUser(formData.id, formData);
      } else {
        await userService.createUser(formData);
      }
      setShowModal(false);
      loadUsers();
      alert(isEditing ? 'Usuario actualizado' : 'Usuario creado');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleEdit = (user) => {
    setFormData({ ...user, password: '' }); // No mostramos el hash de la contraseña
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que desea eliminar este usuario?')) {
      await userService.deleteUser(id);
      loadUsers();
    }
  };

  const openNew = () => {
    setFormData({ 
        username: '', 
        password: '', 
        email: '',
        nombre_completo: '', 
        documento_identidad: '', 
        rol: 'cajero' 
    });
    setIsEditing(false);
    setShowModal(true);
  };

  if (loading) return <LoadingSpinner text="Cargando personal..." />;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>👥 Gestión de Personal</h2>
        <button onClick={openNew} style={{ background: '#2196f3', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          + Nuevo Usuario
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Nombre</th>
            <th style={{ padding: '12px' }}>Usuario</th>
            <th style={{ padding: '12px' }}>Rol</th>
            <th style={{ padding: '12px' }}>Estado</th>
            <th style={{ padding: '12px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{user.nombre_completo}</td>
              <td style={{ padding: '12px' }}>{user.username}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ 
                  background: user.rol === 'admin' ? '#e3f2fd' : '#fff3e0', 
                  color: user.rol === 'admin' ? '#1976d2' : '#f57c00',
                  padding: '4px 8px', borderRadius: '12px', fontSize: '12px' 
                }}>
                  {user.rol.toUpperCase()}
                </span>
              </td>
              <td style={{ padding: '12px' }}>{user.activo ? '✅ Activo' : '❌ Inactivo'}</td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => handleEdit(user)} style={{ marginRight: '5px' }}>✏️</button>
                <button onClick={() => handleDelete(user.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Formulario */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <h3>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                placeholder="Nombre Completo" required
                value={formData.nombre_completo}
                onChange={e => setFormData({...formData, nombre_completo: e.target.value})}
                style={{ padding: '8px' }}
              />
              <input 
                placeholder="Documento ID" required
                value={formData.documento_identidad}
                onChange={e => setFormData({...formData, documento_identidad: e.target.value})}
                style={{ padding: '8px' }}
              />
              <input 
                type="email"
                placeholder="Correo Electrónico" required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                style={{ padding: '8px' }}
              />
              <input 
                placeholder="Nombre de Usuario" required
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                style={{ padding: '8px' }}
              />
              <input 
                type="password"
                placeholder={isEditing ? "Contraseña (dejar en blanco si no cambia)" : "Contraseña"} 
                required={!isEditing}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                style={{ padding: '8px' }}
              />
              <select 
                value={formData.rol}
                onChange={e => setFormData({...formData, rol: e.target.value})}
                style={{ padding: '8px' }}
              >
                <option value="cajero">Cajero</option>
                <option value="admin">Administrador</option>
              </select>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#4caf50', color: 'white', border: 'none' }}>Guardar</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: '#f44336', color: 'white', border: 'none' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;