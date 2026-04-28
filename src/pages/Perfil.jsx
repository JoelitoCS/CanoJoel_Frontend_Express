import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Perfil() {
  const { usuario, logout, actualizarUsuario } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
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
      setExito('Perfil actualizado correctamente');
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
      <div className="page-shell flex items-center justify-center">
        <div className="panel rounded-[2rem] p-12 text-center text-[#6d5040]">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <span className="eyebrow">Mi perfil</span>
          <h1 className="mt-4 font-display text-5xl text-[#2d201a]">Cuenta personal</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="panel rounded-[2rem] p-8 text-center">
            {usuario.foto ? (
              <img
                src={usuario.foto.startsWith('http') ? usuario.foto : `${API_URL.replace('/api', '')}${usuario.foto}`}
                alt={usuario.nombre}
                className="mx-auto h-28 w-28 rounded-full border-4 border-[rgba(121,88,66,0.18)] object-cover"
              />
            ) : (
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[linear-gradient(145deg,#876247,#3d2a21)] text-4xl font-bold text-[#fff4e6]">
                {(usuario.nombre || usuario.email || 'U').slice(0, 1)}
              </div>
            )}

            <h2 className="mt-6 font-display text-4xl text-[#2d201a]">{usuario.nombre || 'Sin nombre'}</h2>
            <p className="mt-2 text-[#6d5040]">{usuario.email}</p>

            <span className="mt-5 inline-flex rounded-full border border-[rgba(121,88,66,0.14)] bg-[rgba(121,88,66,0.08)] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#7a5945]">
              {usuario.rol}
            </span>

            {usuario.createdAt && (
              <p className="mt-4 text-sm text-[#7a5945]">
                Miembro desde {new Date(usuario.createdAt).toLocaleDateString('es-ES')}
              </p>
            )}

            <div className="mt-8 space-y-3">
              <button
                onClick={() => navigate('/mis-pedidos')}
                className="wood-button w-full rounded-[1.2rem] px-4 py-3 text-sm font-bold uppercase tracking-[0.16em]"
              >
                Mis pedidos
              </button>
              <button
                onClick={handleLogout}
                className="w-full rounded-[1.2rem] border border-[#d9b7b7] bg-[#fff6f6] px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#8d4a4a]"
              >
                Cerrar sesión
              </button>
            </div>
          </aside>

          <section className="panel rounded-[2rem] p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-4xl text-[#2d201a]">Información de la cuenta</h2>
              <button
                onClick={() => setEditando(!editando)}
                className="wood-button-soft rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.16em]"
              >
                {editando ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            {error && <div className="mb-6 rounded-[1.3rem] border border-[#d6a9a9] bg-[#fff2f2] px-4 py-3 text-[#7b3f3f]">{error}</div>}
            {exito && <div className="mb-6 rounded-[1.3rem] border border-[#abc8a8] bg-[#f3fbf1] px-4 py-3 text-[#446243]">{exito}</div>}

            <form onSubmit={handleGuardar} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={!editando}
                  className="w-full rounded-[1.2rem] border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.9)] px-4 py-3.5 outline-none transition focus:border-[#a77953] focus:bg-white disabled:bg-[rgba(121,88,66,0.06)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editando}
                  className="w-full rounded-[1.2rem] border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.9)] px-4 py-3.5 outline-none transition focus:border-[#a77953] focus:bg-white disabled:bg-[rgba(121,88,66,0.06)]"
                />
              </div>

              {editando && (
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Dejar en blanco para no cambiar"
                    className="w-full rounded-[1.2rem] border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.9)] px-4 py-3.5 outline-none transition focus:border-[#a77953] focus:bg-white"
                  />
                </div>
              )}

              <div className="rounded-[1.3rem] border border-[rgba(121,88,66,0.14)] bg-[rgba(121,88,66,0.06)] p-4 text-sm text-[#6d5040]">
                Solo puedes editar tu información personal. El rol de usuario no se modifica desde aquí.
              </div>

              {editando && (
                <button
                  type="submit"
                  disabled={cargando}
                  className="wood-button w-full rounded-[1.2rem] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cargando ? 'Guardando...' : 'Guardar cambios'}
                </button>
              )}
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
