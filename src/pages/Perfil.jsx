import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Perfil() {
  const { usuario, logout, actualizarUsuario } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
    } else {
      setFormData({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        password: '',
      });
    }
  }, [usuario, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    setCargando(true);

    try {
      const datosActualizar = {};
      if (formData.nombre !== usuario.nombre) datosActualizar.nombre = formData.nombre;
      if (formData.email !== usuario.email) datosActualizar.email = formData.email;
      if (formData.password) datosActualizar.password = formData.password;

      if (Object.keys(datosActualizar).length === 0) {
        setError('No hay cambios para guardar');
        setCargando(false);
        return;
      }

      const respuesta = await authAPI.actualizarPerfil(datosActualizar);
      actualizarUsuario(respuesta.usuari || respuesta);
      setExito('✓ Perfil actualizado correctamente');
      setFormData((prev) => ({ ...prev, password: '' }));
      setEditando(false);

      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate('/');
    }
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">👤 Mi Perfil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tarjeta de Perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="mb-6">
                {usuario.foto ? (
                  <img
                    src={
                      usuario.foto.startsWith('http')
                        ? usuario.foto
                        : `${API_URL.replace('/api', '')}${usuario.foto}`
                    }
                    alt={usuario.nombre}
                    className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-purple-500"
                  />
                ) : (
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl">
                    👤
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-800">{usuario.nombre || 'Sin nombre'}</h2>
              <p className="text-gray-600 mb-4">{usuario.email}</p>

              <div className="mb-6">
                <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold text-sm">
                  {usuario.rol === 'admin' ? '🔐 Administrador' : usuario.rol === 'editor' ? '✏️ Editor' : '👤 Usuario'}
                </span>
              </div>

              {usuario.createdAt && (
                <p className="text-xs text-gray-500">
                  Miembro desde: {new Date(usuario.createdAt).toLocaleDateString('es-ES')}
                </p>
              )}

              <div className="mt-8 pt-8 border-t space-y-3">
                <button
                  onClick={() => navigate('/mis-pedidos')}
                  className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  📋 Mis Pedidos
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition"
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Formulario de Edición */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Información de la Cuenta</h2>
                <button
                  onClick={() => setEditando(!editando)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition font-semibold"
                >
                  {editando ? '❌ Cancelar' : '✏️ Editar'}
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {exito && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                  {exito}
                </div>
              )}

              <form onSubmit={handleGuardar} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {editando && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nueva Contraseña (opcional)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Dejar en blanco para no cambiar"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>ℹ️ Nota:</strong> Solo puedes editar tu información personal. Tu rol de usuario no puede ser cambiado desde aquí.
                  </p>
                </div>

                {editando && (
                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cargando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
