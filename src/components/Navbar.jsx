import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { useState } from 'react';

export default function Navbar() {
  const { usuario, logout, autenticado } = useAuth();
  const { obtenerTotal } = useCarrito();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const total = obtenerTotal();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuAbierto(false);
  };

  const closeMenu = () => setMenuAbierto(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(121,88,66,0.18)] bg-[rgba(37,26,21,0.84)] text-[#f7efe3] shadow-[0_20px_40px_rgba(30,20,15,0.28)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05),transparent_20%,transparent_80%,rgba(194,155,120,0.08))]" />
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 transition hover:opacity-90"
          onClick={closeMenu}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(231,205,176,0.18)] bg-[linear-gradient(145deg,#7f5b42,#422e24)] text-lg shadow-[inset_0_1px_0_rgba(255,240,222,0.24)]">
            V
          </span>
          <span>
            <span className="font-display block text-3xl leading-none tracking-[0.18em] text-[#fff4e6]">
              VINASHOP
            </span>
            <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#d2b28c]">
              Selection House
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/"
            className="rounded-full px-4 py-2 text-sm font-semibold tracking-wide text-[#efe1cf] transition hover:bg-[rgba(255,248,240,0.08)]"
          >
            Inicio
          </Link>
          <Link
            to="/carrito"
            className="relative rounded-full px-4 py-2 text-sm font-semibold tracking-wide text-[#efe1cf] transition hover:bg-[rgba(255,248,240,0.08)]"
          >
            Carrito
            {total > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c68e5e] px-1 text-[10px] font-extrabold text-[#fff8ef]">
                {total}
              </span>
            )}
          </Link>

          {autenticado ? (
            <>
              {usuario?.rol === 'admin' && (
                <Link
                  to="/admin"
                  className="rounded-full border border-[rgba(231,205,176,0.2)] px-4 py-2 text-sm font-semibold tracking-wide text-[#f3d7b1] transition hover:bg-[rgba(255,248,240,0.08)]"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/mis-pedidos"
                className="rounded-full px-4 py-2 text-sm font-semibold tracking-wide text-[#efe1cf] transition hover:bg-[rgba(255,248,240,0.08)]"
              >
                Mis pedidos
              </Link>
              <div className="group relative">
                <button className="flex items-center gap-2 rounded-full border border-[rgba(231,205,176,0.18)] bg-[rgba(255,248,240,0.06)] px-4 py-2 text-sm font-semibold text-[#fff4e6] transition hover:bg-[rgba(255,248,240,0.12)]">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(231,205,176,0.14)] text-xs uppercase tracking-[0.2em]">
                    {(usuario?.nombre || usuario?.email || 'U').slice(0, 1)}
                  </span>
                  <span className="max-w-40 truncate">{usuario?.nombre || usuario?.email}</span>
                  <span className="text-xs text-[#d2b28c]">▼</span>
                </button>
                <div className="pointer-events-none absolute right-0 mt-3 w-56 translate-y-2 rounded-3xl border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.96)] p-2 text-[#2d201a] opacity-0 shadow-[0_25px_45px_rgba(47,31,23,0.18)] transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <Link
                    to="/perfil"
                    className="block rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-[rgba(121,88,66,0.08)]"
                  >
                    Mi perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[#7b3f3f] transition hover:bg-[rgba(122,63,63,0.08)]"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-[rgba(231,205,176,0.22)] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#fff4e6] transition hover:bg-[rgba(255,248,240,0.08)]"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="wood-button rounded-full px-5 py-2.5 text-sm font-bold tracking-wide transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            to="/carrito"
            className="relative rounded-full border border-[rgba(231,205,176,0.18)] bg-[rgba(255,248,240,0.05)] px-4 py-2 text-sm font-semibold"
          >
            Carrito
            {total > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c68e5e] px-1 text-[10px] font-extrabold text-[#fff8ef]">
                {total}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="rounded-full border border-[rgba(231,205,176,0.18)] bg-[rgba(255,248,240,0.05)] px-4 py-2 text-sm font-semibold"
          >
            Menú
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div className="border-t border-[rgba(231,205,176,0.12)] bg-[rgba(31,21,17,0.96)] px-4 py-4 md:hidden">
          <div className="space-y-2">
            <Link
              to="/"
              className="block rounded-2xl px-4 py-3 font-semibold text-[#efe1cf] transition hover:bg-[rgba(255,248,240,0.08)]"
              onClick={closeMenu}
            >
              Inicio
            </Link>
            {autenticado ? (
              <>
                {usuario?.rol === 'admin' && (
                  <Link
                    to="/admin"
                    className="block rounded-2xl px-4 py-3 font-semibold text-[#f3d7b1] transition hover:bg-[rgba(255,248,240,0.08)]"
                    onClick={closeMenu}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/mis-pedidos"
                  className="block rounded-2xl px-4 py-3 font-semibold text-[#efe1cf] transition hover:bg-[rgba(255,248,240,0.08)]"
                  onClick={closeMenu}
                >
                  Mis pedidos
                </Link>
                <Link
                  to="/perfil"
                  className="block rounded-2xl px-4 py-3 font-semibold text-[#efe1cf] transition hover:bg-[rgba(255,248,240,0.08)]"
                  onClick={closeMenu}
                >
                  Mi perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full rounded-2xl px-4 py-3 text-left font-semibold text-[#d89b86] transition hover:bg-[rgba(122,63,63,0.08)]"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block rounded-2xl px-4 py-3 font-semibold text-[#efe1cf] transition hover:bg-[rgba(255,248,240,0.08)]"
                  onClick={closeMenu}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="block rounded-2xl px-4 py-3 font-semibold text-[#fff4e6] wood-button"
                  onClick={closeMenu}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
