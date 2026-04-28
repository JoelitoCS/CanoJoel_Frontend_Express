import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    passwordConfirm: '',
    foto: null,
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { registro } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      foto: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);

    try {
      await registro(formData.email, formData.password, formData.nombre, formData.foto);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="page-shell flex items-center justify-center px-4">
      <div className="panel w-full max-w-2xl rounded-[2.2rem] p-8 sm:p-10">
        <div className="mb-8 text-center">
          <span className="eyebrow">Nueva cuenta</span>
          <h1 className="mt-5 font-display text-5xl text-[#2d201a]">Crear acceso</h1>
          <p className="mt-3 text-[#6d5040]">Empieza con una presencia elegante desde tu primer acceso.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-[1.3rem] border border-[#d6a9a9] bg-[#fff2f2] px-4 py-3 text-[#7b3f3f]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full rounded-[1.2rem] border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.9)] px-4 py-3.5 outline-none transition focus:border-[#a77953] focus:bg-white"
              placeholder="Tu nombre"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-[1.2rem] border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.9)] px-4 py-3.5 outline-none transition focus:border-[#a77953] focus:bg-white"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-[1.2rem] border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.9)] px-4 py-3.5 outline-none transition focus:border-[#a77953] focus:bg-white"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">
              Confirmar
            </label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              className="w-full rounded-[1.2rem] border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.9)] px-4 py-3.5 outline-none transition focus:border-[#a77953] focus:bg-white"
              placeholder="••••••••"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">
              Foto de perfil
            </label>
            <input
              type="file"
              name="foto"
              onChange={handleFotoChange}
              accept="image/*"
              className="w-full rounded-[1.2rem] border border-dashed border-[rgba(121,88,66,0.24)] bg-[rgba(255,252,247,0.75)] px-4 py-3"
            />
            {formData.foto && (
              <p className="mt-2 text-sm font-semibold text-[#6d5040]">{formData.foto.name}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={cargando}
              className="wood-button w-full rounded-[1.2rem] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cargando ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-[#6d5040]">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-bold text-[#8c684d] hover:text-[#5e4434]">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
