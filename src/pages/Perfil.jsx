import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI, getImagenUrl } from '../services/api';

export default function Perfil() {
  const { usuario, logout, actualizarUsuario } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData]       = useState({ nombre: '', email: '', password: '', foto: null });
  const [fotoPreview, setFotoPreview] = useState('');
  const [cargando, setCargando]       = useState(false);
  const [error, setError]             = useState('');
  const [exito, setExito]             = useState('');
  const [editando, setEditando]       = useState(false);

  useEffect(() => {
    if (!usuario) { navigate('/login'); return; }
    setFormData({ nombre: usuario.nombre || '', email: usuario.email || '', password: '', foto: null });
    setFotoPreview('');
  }, [usuario, navigate]);

  if (!usuario) return null;

  // Construir URL de la foto actual del perfil con getImagenUrl
  const fotoActualUrl = fotoPreview
    ? fotoPreview
    : getImagenUrl(usuario.foto);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = e => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setFormData(prev => ({ ...prev, foto: archivo }));
    setFotoPreview(URL.createObjectURL(archivo));
  };

  const handleGuardar = async e => {
    e.preventDefault();
    setError(''); setExito('');
    const datosActualizar = {};
    if (formData.nombre !== usuario.nombre) datosActualizar.nombre = formData.nombre;
    if (formData.email  !== usuario.email)  datosActualizar.email  = formData.email;
    if (formData.password)                  datosActualizar.password = formData.password;
    if (formData.foto instanceof File)      datosActualizar.foto = formData.foto;

    if (Object.keys(datosActualizar).length === 0) {
      setError('No hay cambios para guardar'); return;
    }

    setCargando(true);
    try {
      const respuesta = await authAPI.actualizarPerfil(datosActualizar);
      // La respuesta tiene { token, usuari }
      const usuarioActualizado = respuesta.usuari || respuesta;
      actualizarUsuario(usuarioActualizado);
      if (respuesta.token) localStorage.setItem('token', respuesta.token);
      setExito('Perfil actualizado correctamente ✓');
      setFormData(prev => ({ ...prev, password: '', foto: null }));
      setFotoPreview('');
      setEditando(false);
      setTimeout(() => setExito(''), 3500);
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Cerrar sesión?')) { logout(); navigate('/'); }
  };

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <span className="eyebrow">Mi perfil</span>
          <h1 className="mt-4 font-display text-5xl text-[#2d201a]">Cuenta personal</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">

          {/* ── Tarjeta lateral ── */}
          <aside className="panel rounded-[2rem] p-8 text-center">
            {fotoActualUrl ? (
              <img
                src={fotoActualUrl}
                alt={usuario.nombre || 'Perfil'}
                className="mx-auto h-28 w-28 rounded-full border-4 border-[rgba(121,88,66,0.2)] object-cover"
              />
            ) : (
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#876247] to-[#3d2a21] text-4xl font-bold text-[#fff4e6]">
                {(usuario.nombre || usuario.email || 'U')[0].toUpperCase()}
              </div>
            )}

            <h2 className="mt-6 font-display text-4xl text-[#2d201a]">{usuario.nombre || 'Sin nombre'}</h2>
            <p className="mt-1 text-[#6d5040]">{usuario.email}</p>

            <span className={`mt-4 inline-flex rounded-full border px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] ${
              usuario.rol === 'admin'  ? 'border-[#d9b7b7] bg-[#fff2f2] text-[#8d4a4a]'
              : usuario.rol === 'editor' ? 'border-[#abc8a8] bg-[#f0fdf0] text-[#446243]'
              : 'border-[rgba(121,88,66,0.14)] bg-[rgba(121,88,66,0.08)] text-[#7a5945]'
            }`}>
              {usuario.rol}
            </span>

            {usuario.createdAt && (
              <p className="mt-3 text-sm text-[#8c684d]">
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
                className="w-full rounded-[1.2rem] border border-[#d9b7b7] bg-[#fff6f6] px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#8d4a4a] transition hover:bg-[#ffe8e8]"
              >
                Cerrar sesión
              </button>
            </div>
          </aside>

          {/* ── Formulario ── */}
          <section className="panel rounded-[2rem] p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-4xl text-[#2d201a]">Información de la cuenta</h2>
              <button
                onClick={() => {
                  if (editando) {
                    setFormData(prev => ({ ...prev, foto: null, password: '' }));
                    setFotoPreview('');
                  }
                  setEditando(prev => !prev);
                }}
                className="wood-button-soft rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.16em]"
              >
                {editando ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            {error && (
              <div className="mb-5 rounded-[1.3rem] border border-[#d6a9a9] bg-[#fff2f2] px-4 py-3 text-sm text-[#7b3f3f]">{error}</div>
            )}
            {exito && (
              <div className="mb-5 rounded-[1.3rem] border border-[#abc8a8] bg-[#f3fbf1] px-4 py-3 text-sm text-[#446243]">{exito}</div>
            )}

            <form onSubmit={handleGuardar} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">Nombre</label>
                <input
                  type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                  disabled={!editando}
                  className="w-full rounded-[1.2rem] border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.9)] px-4 py-3.5 outline-none transition focus:border-[#a77953] focus:bg-white disabled:bg-[rgba(121,88,66,0.05)] disabled:text-[#8c7060]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">Email</label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  disabled={!editando}
                  className="w-full rounded-[1.2rem] border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.9)] px-4 py-3.5 outline-none transition focus:border-[#a77953] focus:bg-white disabled:bg-[rgba(121,88,66,0.05)] disabled:text-[#8c7060]"
                />
              </div>

              {editando && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">Nueva contraseña</label>
                    <input
                      type="password" name="password" value={formData.password} onChange={handleChange}
                      placeholder="Dejar en blanco para no cambiar"
                      className="w-full rounded-[1.2rem] border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.9)] px-4 py-3.5 outline-none transition focus:border-[#a77953] focus:bg-white placeholder:text-[#b09880]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">Foto de perfil</label>
                    {fotoPreview && (
                      <img
                        src={fotoPreview}
                        alt="Nueva foto"
                        className="mb-3 h-24 w-24 rounded-full object-cover border-2 border-[rgba(121,88,66,0.2)]"
                      />
                    )}
                    <input
                      type="file" accept="image/*" onChange={handleFotoChange}
                      className="w-full rounded-[1.2rem] border border-dashed border-[rgba(121,88,66,0.25)] bg-[rgba(255,252,247,0.75)] px-4 py-3 text-sm text-[#7a5945]"
                    />
                    {formData.foto && (
                      <p className="mt-2 text-sm font-semibold text-[#6d5040]">📷 {formData.foto.name}</p>
                    )}
                  </div>
                </>
              )}

              <div className="rounded-[1.3rem] border border-[rgba(121,88,66,0.14)] bg-[rgba(121,88,66,0.05)] p-4 text-sm text-[#6d5040]">
                El rol de usuario solo puede ser cambiado por un administrador.
              </div>

              {editando && (
                <button
                  type="submit"
                  disabled={cargando}
                  className="wood-button w-full rounded-[1.2rem] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em] disabled:opacity-50"
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
