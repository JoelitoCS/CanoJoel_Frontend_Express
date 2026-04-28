import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="page-shell flex items-center justify-center px-4">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_0.88fr]">
        <section className="relative hidden overflow-hidden rounded-[2.2rem] border border-[rgba(121,88,66,0.18)] bg-[linear-gradient(145deg,rgba(31,21,17,0.97),rgba(89,63,47,0.92)_60%,rgba(188,149,106,0.7))] p-10 text-[#fff4e6] shadow-[0_30px_70px_rgba(45,30,22,0.26)] lg:block">
          <div className="absolute -left-8 top-10 h-44 w-44 rounded-full bg-[rgba(255,240,222,0.08)] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[rgba(255,216,176,0.12)] blur-3xl" />
          <span className="eyebrow border-[rgba(255,239,220,0.18)] bg-[rgba(255,248,240,0.08)] text-[#f2d4b2]">
            Members Access
          </span>
          <h1 className="mt-6 font-display text-6xl leading-[0.92]">Accede a una experiencia más refinada.</h1>
          <p className="mt-6 max-w-md text-lg text-[#f1decd]/90">
            Tu cuenta reúne pedidos, perfil y gestión personal dentro de un entorno cálido, sobrio y profesional.
          </p>
        </section>

        <section className="panel rounded-[2.2rem] p-8 sm:p-10">
          <div className="mb-8 text-center">
            <span className="eyebrow">Iniciar sesión</span>
            <h2 className="mt-5 font-display text-5xl text-[#2d201a]">Bienvenido de nuevo</h2>
            <p className="mt-3 text-[#6d5040]">Accede a tu perfil y continúa tu selección.</p>
          </div>

          {error && (
            <div className="mb-6 rounded-[1.3rem] border border-[#d6a9a9] bg-[#fff2f2] px-4 py-3 text-[#7b3f3f]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-[1.2rem] border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.9)] px-4 py-3.5 text-[#2d201a] outline-none transition focus:border-[#a77953] focus:bg-white"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-[1.2rem] border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.9)] px-4 py-3.5 text-[#2d201a] outline-none transition focus:border-[#a77953] focus:bg-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="wood-button w-full rounded-[1.2rem] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cargando ? 'Accediendo...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#6d5040]">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-bold text-[#8c684d] hover:text-[#5e4434]">
              Regístrate aquí
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm font-semibold text-[#6d5040] transition hover:text-[#2d201a]">
              Volver al inicio
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
