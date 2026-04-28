import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { useState } from 'react';

export default function Navbar() {
  const { usuario, logout, autenticado } = useAuth();
  const { obtenerTotal } = useCarrito();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuAbierto(false);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-2xl hover:text-purple-100 transition">
            <span className="text-3xl">🍺</span>
            <span>VinaShop</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-purple-100 transition">
              Inicio
            </Link>
            <Link to="/carrito" className="relative hover:text-purple-100 transition">
              🛒 Carrito
              {obtenerTotal() > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {obtenerTotal()}
                </span>
              )}
            </Link>

            {autenticado ? (
              <>
                {usuario?.rol === 'admin' && (
                  <Link to="/admin" className="hover:text-purple-100 transition font-semibold">
                    🔧 Admin
                  </Link>
                )}
                <Link to="/mis-pedidos" className="hover:text-purple-100 transition">
                  📋 Mis Pedidos
                </Link>
                <div className="relative group">
                  <button className="hover:text-purple-100 transition flex items-center space-x-2">
                    <span>{usuario?.nombre || usuario?.email}</span>
                    <span>▼</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-50">
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 hover:bg-gray-100 transition rounded-t-lg"
                    >
                      👤 Mi Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition rounded-b-lg border-t"
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-semibold"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 transition font-semibold"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/carrito" className="relative">
              🛒
              {obtenerTotal() > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {obtenerTotal()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuAbierto && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 hover:bg-purple-600 rounded transition"
              onClick={() => setMenuAbierto(false)}
            >
              Inicio
            </Link>
            {autenticado ? (
              <>
                {usuario?.rol === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 hover:bg-purple-600 rounded transition font-semibold"
                    onClick={() => setMenuAbierto(false)}
                  >
                    🔧 Admin
                  </Link>
                )}
                <Link
                  to="/mis-pedidos"
                  className="block px-4 py-2 hover:bg-purple-600 rounded transition"
                  onClick={() => setMenuAbierto(false)}
                >
                  📋 Mis Pedidos
                </Link>
                <Link
                  to="/perfil"
                  className="block px-4 py-2 hover:bg-purple-600 rounded transition"
                  onClick={() => setMenuAbierto(false)}
                >
                  👤 Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-purple-600 rounded transition"
                >
                  🚪 Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-purple-600 rounded transition"
                  onClick={() => setMenuAbierto(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="block px-4 py-2 hover:bg-purple-600 rounded transition"
                  onClick={() => setMenuAbierto(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
